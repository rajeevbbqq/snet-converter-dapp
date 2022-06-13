import BigNumber from 'bignumber.js';
import { isEmpty, toUpper } from 'lodash';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWalletHook } from '../../../components/snet-wallet-connector/walletHook';
import { bigNumberSubtract, convertFromCogs, convertToValueFromPercentage } from '../../../utils/bignumber';
import { generateConversionID, getConversionStatus, updateTransactionStatus } from '../../../utils/HttpRequests';
import { setBlockchainStatus } from '../../../services/redux/slices/blockchain/blockchainSlice';
import { availableBlockchains, blockchainStatusLabels, progress } from '../../../utils/ConverterConstants';

const useERC20TokenHook = () => {
  const [authorizationRequired, setAuthorizationRequired] = useState(false);
  const [conversionEnabled, setConversionEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConversionInProgress, setIsConversionInProgress] = useState({ status: false, blockConfiramtionsRequired: 0, blockConfiramtionsReceived: 0 });
  const [txnInfo, setTxnInfo] = useState({ txnLink: null, txnAmount: 0, tokenName: '', tokenSymbol: '' });
  const [operation, setOperation] = useState('');

  const { tokens } = useSelector((state) => state.tokenPairs);
  const { entities } = useSelector((state) => state.blockchains);

  const { balanceFromWallet, checkAllowance, approveSpender, getLatestBlock, signMessage, conversionOut, convertToCogs, getWalletAddress } = useWalletHook();

  const dispatch = useDispatch();

  const resetTxnInfo = () => {
    setTxnInfo({ ...txnInfo, txnLink: null });
  };

  const getBlockConfirmationStatus = async (conversionId) => {
    const [blockchain] = entities.filter((entity) => toUpper(entity.name) === availableBlockchains.ETHEREUM);
    const blockConfiramtionsRequired = blockchain.block_confirmation;
    setIsConversionInProgress({ ...isConversionInProgress, blockConfiramtionsRequired, status: true });
    let isBlockConfirmationPending = true;

    const sixtySeconds = 60000;
    const intervalId = setInterval(async () => {
      try {
        if (isBlockConfirmationPending) {
          const { transactions } = await getConversionStatus(conversionId);
          const transaction = transactions.length ? transactions[transactions.length - 1] : transactions;
          const { confirmation } = transaction;
          if (transactions.length > 1 && Number(blockConfiramtionsRequired) <= Number(confirmation)) {
            isBlockConfirmationPending = false;
          } else {
            isBlockConfirmationPending = true;
          }
          setOperation(transaction.transaction_operation);
          setIsConversionInProgress({ status: isBlockConfirmationPending, blockConfiramtionsReceived: confirmation, blockConfiramtionsRequired });
        }
      } catch (error) {
        console.log(error);
      }
    }, sixtySeconds);

    return () => {
      clearInterval(intervalId);
    };
  };

  const getConversionId = async (tokenpairId, amount, fromTokenAddress, toAddress) => {
    try {
      setIsLoading(true);
      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_SIGNING_FROM_WALLET));
      const blockNumber = await getLatestBlock();
      const personalSignature = await signMessage(tokenpairId, amount, fromTokenAddress, toAddress);
      const conversionResponse = await generateConversionID(tokenpairId, amount, personalSignature, blockNumber, fromTokenAddress, toAddress);
      return {
        conversionId: conversionResponse.id,
        signature: conversionResponse.signature,
        amount,
        depositAddress: conversionResponse.deposit_address,
        depositAmount: conversionResponse.deposit_amount
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const convertEthToAda = async (contractAddress, amount, conversionId, signature, decimals) => {
    try {
      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_CONFIRMING_TXN));
      const transactionHash = await conversionOut(contractAddress, amount, conversionId, signature, decimals);
      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_UPDATING_TXN_STATUS));
      await updateTransactionStatus(conversionId, transactionHash);
      return `${process.env.REACT_APP_ETHERSCAN_TXN_BASE_URL}/${transactionHash}`;
    } catch (error) {
      console.log(JSON.stringify(error));
      throw error;
    }
  };

  const disableButtons = () => {
    setAuthorizationRequired(false);
    setConversionEnabled(false);
  };

  const mintERC20Tokens = async (tokenPairId, amount, fromAddress) => {
    try {
      disableButtons();
      const [pair] = tokens.filter((token) => token.from_token.id === tokenPairId);
      const decimals = pair.from_token.allowed_decimal;
      const amountInCogs = convertToCogs(amount, decimals);
      const toAddress = await getWalletAddress();
      const conversionInfo = await getConversionId(pair.id, amountInCogs, fromAddress, toAddress);
      const depositAmount = convertFromCogs(conversionInfo.depositAmount, decimals);
      let conversionFees = 0;
      if (!isEmpty(pair.conversion_fee)) {
        conversionFees = convertToValueFromPercentage(depositAmount, pair.conversion_fee.percentage_from_source);
      }
      const receivingAmount = bigNumberSubtract(depositAmount, conversionFees);
      return { ...conversionInfo, depositAmount, pair, receivingAmount, conversionFees };
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setConversionEnabled(true);
      setIsLoading(false);
    }
  };

  const burnERC20Tokens = async (tokenPairId, amount, toAddress) => {
    try {
      disableButtons();
      const [pair] = tokens.filter((token) => token.from_token.id === tokenPairId);
      const contractAddress = pair.contract_address;
      const fromAddress = await getWalletAddress();
      console.log(`Burning ${amount} ${pair.from_token.symbol} from ${fromAddress} to ${toAddress}`);
      const amountInCogs = convertToCogs(amount, pair.from_token.allowed_decimal);
      const { conversionId, signature } = await getConversionId(pair.id, amountInCogs, fromAddress, toAddress);
      const txnLink = await convertEthToAda(contractAddress, amount, conversionId, signature, pair.from_token.allowed_decimal);
      dispatch(setBlockchainStatus(null));
      getBlockConfirmationStatus(conversionId);
      setTxnInfo({ txnLink, txnAmount: amount, tokenName: pair.from_token.name, tokenSymbol: pair.from_token.symbol });
    } catch (error) {
      console.log('Error on burnERC20Tokens', error);
      throw error;
    } finally {
      setConversionEnabled(true);
      setIsLoading(false);
    }
  };

  const approveSpendLimit = async (tokenPairId) => {
    try {
      disableButtons();
      setIsLoading(true);
      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_APPROVING_SPEND_LIMIT));
      const [pair] = tokens.filter((token) => token.from_token.id === tokenPairId);
      const spenderAddress = pair.contract_address;
      const tokenContractAddress = pair.from_token.token_address;

      console.log('Authorization Token Contract Address:', tokenContractAddress);
      console.log('Authorization Spender address', spenderAddress);

      await approveSpender(tokenContractAddress, spenderAddress);
      setConversionEnabled(true);
      setAuthorizationRequired(false);
    } catch (error) {
      const e = error.message || error;
      setAuthorizationRequired(true);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllowanceInfo = async (tokenPairId, conversionAmount) => {
    try {
      const [pair] = tokens.filter((token) => token.from_token.id === tokenPairId);
      const spenderAddress = pair.contract_address;
      const tokenContractAddress = pair.from_token.token_address;
      const allowanceAmount = await checkAllowance(tokenContractAddress, spenderAddress);
      console.log('Allowance is ', allowanceAmount);

      setAuthorizationRequired(new BigNumber(allowanceAmount).lt(conversionAmount));
      setConversionEnabled(new BigNumber(allowanceAmount).gte(conversionAmount));
    } catch (error) {
      console.log('Get Allowance Info Error', error);
      throw error;
    }
  };

  const fetchWalletBalance = async (tokenContractAddress) => {
    try {
      return await balanceFromWallet(tokenContractAddress);
    } catch (error) {
      console.log('Fetch Wallet Balance error', error);
      throw error;
    }
  };

  const conversionIsComplete = () => setIsConversionInProgress({ ...isConversionInProgress, status: false });

  return {
    mintERC20Tokens,
    fetchWalletBalance,
    getAllowanceInfo,
    conversionEnabled,
    authorizationRequired,
    approveSpendLimit,
    isLoading,
    burnERC20Tokens,
    txnInfo,
    resetTxnInfo,
    isConversionInProgress,
    conversionIsComplete,
    operation
  };
};

export default useERC20TokenHook;
