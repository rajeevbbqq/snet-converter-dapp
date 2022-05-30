import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import { Stack, Typography, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { toUpper, isEmpty, isNil } from 'lodash';
import SnetPaper from '../../components/snet-paper';
import useConverterHook from './hooks/ConverterHook';
import ConversionFormLoader from './ConversionFormLoader';
import TokenPairs from './TokenPairs';
import useERC20TokenHook from './hooks/ERC20TokenHook';
import { availableBlockchains, conversionDirections, conversionStatuses, conversionSteps } from '../../utils/ConverterConstants';
import SnetAlert from '../../components/snet-alert';
import SnetLoader from '../../components/snet-loader';
import SnetConversionStatus from '../../components/snet-conversion-status';
import ADATOETHButton from '../../components/snet-converter-form-buttons/ADATOETHButton';
import ETHTOADAButton from '../../components/snet-converter-form-buttons/ETHTOADAButton';
import SnetSnackbar from '../../components/snet-snackbar';
import Paths from '../../router/paths';
import ETHTOADAConversionPopup from './ETHTOADAConversionPopup';
import styles from './styles';
import { resetConversionStepsForAdaToEth, setActiveStep, setConversionStatus } from '../../services/redux/slices/tokenPairs/tokenPairSlice';

const ERC20TOADA = ({ onADATOETHConversion, callPendingTxnAlert }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blockchains, wallet } = useSelector((state) => state);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfirmationBlockPopup, setConfirmationBlockPopup] = useState(false);
  const [errorRedirectTo, seterrorRedirectTo] = useState(null);
  const { conversionDirection } = useSelector((state) => state.wallet);
  const { blockchainStatus } = useSelector((state) => state.blockchains);
  const {
    fromBlockchains,
    toBlockchains,
    fromSelectedBlockchain,
    toSelectedBlockchain,
    handleFromBlockchainSelection,
    handleToBlockchainSelection,
    swapBlockchains,
    fromTokenPair,
    toTokenPair,
    onSelectingFromToken,
    onSelectingToToken,
    handleFromInputChange,
    handleToInputChange,
    onUseFullamount,
    fromAndToTokenValues,
    conversionCharge,
    error,
    updateWalletBalance,
    walletBalance,
    resetFromAndToValues,
    conversionIsComplete
  } = useConverterHook();
  const {
    mintERC20Tokens,
    resetTxnInfo,
    fetchWalletBalance,
    getAllowanceInfo,
    conversionEnabled,
    authorizationRequired,
    approveSpendLimit,
    isLoading,
    burnERC20Tokens,
    txnInfo,
    isConversionInProgress
  } = useERC20TokenHook();
  const { toAddress, fromAddress, wallets } = wallet;

  const getBalanceFromWallet = async () => {
    const balanceInfo = await fetchWalletBalance(fromTokenPair.token_address);
    updateWalletBalance(balanceInfo);
  };

  useEffect(() => {
    if (!isEmpty(fromTokenPair) && toUpper(fromTokenPair.blockchain.name) === availableBlockchains.ETHEREUM && Number(fromAndToTokenValues.fromValue) > 0) {
      getAllowanceInfo(fromTokenPair.id, fromAndToTokenValues.fromValue);
    }
  }, [fromAndToTokenValues, conversionDirection, wallets]);

  useEffect(() => {
    if (!isEmpty(fromTokenPair) && toUpper(fromTokenPair.blockchain.name) === availableBlockchains.ETHEREUM) {
      getBalanceFromWallet();
    }
  }, [fromTokenPair, wallets, fromAndToTokenValues, conversionDirection]);

  const onClickAuthorize = async () => {
    try {
      await approveSpendLimit(fromTokenPair.id);
    } catch (exception) {
      setErrorMessage(exception?.message || String(exception));
      seterrorRedirectTo(exception?.redirectTo || null);
    } finally {
      getAllowanceInfo(fromTokenPair.id, fromAndToTokenValues.fromValue);
    }
  };

  const getConversionIdForADATOETH = async () => {
    try {
      const conversionInfo = await mintERC20Tokens(fromTokenPair.id, fromAndToTokenValues.fromValue, fromAddress);

      dispatch(setActiveStep(conversionSteps.DEPOSIT_TOKENS));
      dispatch(resetConversionStepsForAdaToEth());
      dispatch(setConversionStatus(conversionStatuses.IDLE));

      onADATOETHConversion(conversionInfo);
    } catch (exception) {
      setErrorMessage(exception?.message || String(exception));
      seterrorRedirectTo(exception?.redirectTo || null);
    }
  };

  const onETHToADAConversion = async () => {
    try {
      setConfirmationBlockPopup(true);
      await burnERC20Tokens(fromTokenPair.id, fromAndToTokenValues.fromValue, toAddress);
      resetFromAndToValues();
    } catch (exception) {
      setErrorMessage(exception?.message || String(exception));
      seterrorRedirectTo(exception?.redirectTo || null);
    }
  };

  const resetErrorState = () => {
    setErrorMessage(null);
    seterrorRedirectTo(null);
  };

  if (blockchains.entities.length === 0) {
    return (
      <SnetPaper>
        <ConversionFormLoader />
      </SnetPaper>
    );
  }

  const formatConversionTitle = () => {
    if (fromTokenPair) {
      const from = `${fromTokenPair.symbol} [${fromTokenPair.blockchain.name}]`;
      const to = `${toTokenPair.symbol} [${toTokenPair.blockchain.name}]`;
      return `Converting ${from} to ${to}`;
    }
    return '';
  };

  const handlePopupClose = () => {
    callPendingTxnAlert();
    setConfirmationBlockPopup(false);
  };

  const openLink = () => navigate(Paths.Transactions);

  return (
    <>
      <SnetSnackbar open={!isNil(errorMessage)} message={String(errorMessage)} onClose={resetErrorState} redirectTo={errorRedirectTo} />
      {!isNil(txnInfo.txnLink) && !isConversionInProgress.status ? (
        <SnetConversionStatus
          isDialogOpen={txnInfo.txnLink}
          title={formatConversionTitle()}
          amount={txnInfo.txnAmount}
          tokenName={txnInfo.tokenSymbol}
          link={txnInfo.txnLink ?? ''}
          onDialogClose={resetTxnInfo}
        />
      ) : null}
      <SnetPaper>
        {blockchainStatus ? (
          <SnetLoader dialogBody={blockchainStatus.message} onDialogClose={() => {}} isDialogOpen={isLoading} dialogTitle={blockchainStatus.title} />
        ) : null}
        <Box sx={styles.ethAdaConversionBox}>
          <TokenPairs
            fromBlockchains={fromBlockchains}
            fromSelectedBlockchain={fromSelectedBlockchain}
            toBlockchains={toBlockchains}
            toSelectedBlockchain={toSelectedBlockchain}
            handleFromBlockchainSelection={handleFromBlockchainSelection}
            handleToBlockchainSelection={handleToBlockchainSelection}
            onSwapBlockchain={() => swapBlockchains()}
            fromTokenPair={fromTokenPair}
            toTokenPair={toTokenPair}
            onSelectingFromToken={onSelectingFromToken}
            onSelectingToToken={onSelectingToToken}
            onUseFullamount={onUseFullamount}
            fromInputChange={handleFromInputChange}
            toInputChange={handleToInputChange}
            fromInputValue={fromAndToTokenValues.fromValue}
            toInputValue={fromAndToTokenValues.toValue}
            conversionFee={conversionCharge.amount}
            conversionSymbol={conversionCharge.symbol}
            walletBalance={walletBalance.balance}
            walletTokenSymbol={walletBalance.symbol}
          />
        </Box>
        <Box style={styles.alertAndBtnContainer}>
          {wallet.conversionDirection === conversionDirections.ETH_TO_ADA && authorizationRequired ? (
            <Stack direction="row" alignItems="center">
              <SnetAlert iconPresence={false} error={<p>Allow SingularityNET Bridge to use ethereum tokens from your wallet</p>} type="info" />
            </Stack>
          ) : null}
          {error.error && error.message.length ? (
            <Stack marginTop={1}>
              <SnetAlert error={error.message} />
            </Stack>
          ) : null}
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center" padding={4}>
            {wallet.conversionDirection === conversionDirections.ADA_TO_ETH ? (
              <ADATOETHButton conversionEnabled={!error.message.length && !isNil(fromAddress)} onClickConvert={getConversionIdForADATOETH} />
            ) : (
              <ETHTOADAButton
                conversionEnabled={conversionEnabled && !error.error}
                authorizationRequired={authorizationRequired}
                onClickConvert={onETHToADAConversion}
                onClickAuthorize={onClickAuthorize}
              />
            )}
          </Stack>
          {isConversionInProgress.status ? (
            <ETHTOADAConversionPopup
              blockConfiramtionsReceived={isConversionInProgress.blockConfiramtionsReceived}
              blockConfiramtionsRequired={isConversionInProgress.blockConfiramtionsRequired}
              title={formatConversionTitle()}
              openPopup={showConfirmationBlockPopup}
              handlePopupClose={handlePopupClose}
              openLink={openLink}
            />
          ) : null}
        </Box>
      </SnetPaper>
    </>
  );
};

ERC20TOADA.propTypes = {
  onADATOETHConversion: propTypes.func.isRequired,
  callPendingTxnAlert: propTypes.func.isRequired
};

export default ERC20TOADA;
