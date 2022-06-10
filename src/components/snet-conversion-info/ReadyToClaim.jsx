import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import SnetButton from '../snet-button';
import SnetDialog from '../snet-dialog';
import { useStyles } from '../snet-conversion-status/styles';
import { bigNumberToString } from '../../utils/bignumber';
import { useWalletHook } from '../snet-wallet-connector/walletHook';
import { conversionClaim, updateTransactionStatus } from '../../utils/HttpRequests';
import { setBlockchainStatus } from '../../services/redux/slices/blockchain/blockchainSlice';
import { blockchainStatusLabels } from '../../utils/ConverterConstants';
import SnetLoader from '../snet-loader';
import SnetAlert from '../snet-alert';

const ReadyToClaim = ({ conversion, isReadyToClaim, closePopup }) => {
  const classes = useStyles();
  const [fees, setFees] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [token, setToken] = useState('');
  const [conversionTitle, setConversionTitle] = useState('');

  const { fromAddress, toAddress } = useSelector((state) => state.wallet);
  const { blockchainStatus } = useSelector((state) => state.blockchains);

  const { generateSignatureForClaim, conversionIn } = useWalletHook();

  const dispatch = useDispatch();

  const formatTransactionReciept = () => {
    console.log('formatTransactionReciept', conversion);
    setClaimAmount(bigNumberToString(conversion.receivingAmount));
    setFees(bigNumberToString(conversion.conversionFees));
    setToken(conversion.pair.to_token.symbol);

    const title = `${conversion.pair.from_token.symbol} [${conversion.pair.from_token.blockchain.name}] to ${conversion.pair.to_token.symbol} [${conversion.pair.to_token.blockchain.name}]`;
    setConversionTitle(title);
  };

  useEffect(() => {
    formatTransactionReciept();
  }, []);

  const getSignature = async () => {
    try {
      const amount = conversion.receivingAmount;
      const { conversionId } = conversion;
      const signature = await generateSignatureForClaim(conversionId, amount, fromAddress, toAddress);
      return await conversionClaim(conversionId, amount, signature, toAddress, fromAddress);
    } catch (error) {
      console.log('Getsignature error', error);
      throw error;
    }
  };

  const claimTokens = async (contractAddress, conversionId, amount, signature, decimals) => {
    try {
      return await conversionIn(contractAddress, amount, conversionId, signature, decimals);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const onClaimTokens = async () => {
    try {
      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_SIGNING_FROM_WALLET));
      const claim = await getSignature();
      const decimals = conversion.pair.from_token.allowed_decimal;
      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_CONFIRMING_TXN));
      const txnHash = await claimTokens(claim.contract_address, conversion.conversionId, claim.claim_amount, claim.signature, decimals);

      dispatch(setBlockchainStatus(blockchainStatusLabels.ON_UPDATING_TXN_STATUS));
      await updateTransactionStatus(conversion.conversionId, txnHash);
      dispatch(setBlockchainStatus(null));
      closePopup();
    } catch (error) {
      console.log('Error on onClaimTokens: ', error);
      throw error;
    }
  };

  if (blockchainStatus) {
    return <SnetLoader dialogBody={blockchainStatus.message} onDialogClose={() => {}} isDialogOpen dialogTitle={blockchainStatus.title} />;
  }

  return (
    <SnetDialog isDialogOpen={isReadyToClaim} onDialogClose={closePopup} title={conversionTitle} showClosebutton>
      <div className={classes.ethToAdaTransactionReceiptContainer}>
        <Box display="flex" alignItems="center" className={classes.progressSection}>
          <CircularProgress />
          <Typography align="center" color="grey" variant="body2" marginLeft={2}>
            Please claim the tokens to complete the conversion process.
          </Typography>
        </Box>
        <Box minWidth={540} className={classes.transactionReceiptContent}>
          <Typography variant="body2" marginY={2}>
            Transaction Receipt
          </Typography>
          <Box className={classes.transactionDetails}>
            <Typography variant="body2">Tokens Converted</Typography>
            <Typography variant="body1">
              {claimAmount} {token}
            </Typography>
          </Box>
          {Number(fees) > 0 && (
            <Box className={classes.transactionDetails}>
              <Typography variant="body2">Conversion fees</Typography>
              <Typography variant="body1">
                {fees} {token}
              </Typography>
            </Box>
          )}
        </Box>
        <SnetAlert
          iconPresence={false}
          error={
            <p>
              Claiming the tokens can take upto few minutes depending on network traffic. Once initiated, claim progess can be checked from the transactions
              history page.
            </p>
          }
          type="info"
        />
        <Box className={classes.transactionReceiptActions}>
          <SnetButton variant="text" onClick={closePopup} name="Claim tokens later" />
          <SnetButton onClick={onClaimTokens} name="Claim tokens" />
        </Box>
      </div>
    </SnetDialog>
  );
};

ReadyToClaim.propTypes = {
  conversion: propTypes.object.isRequired,
  isReadyToClaim: propTypes.bool.isRequired,
  closePopup: propTypes.func.isRequired
};

export default ReadyToClaim;
