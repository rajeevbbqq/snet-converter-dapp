import { useEffect, useState } from 'react';
import { Typography, FormControl, InputLabel, OutlinedInput, Box, Stack, CircularProgress } from '@mui/material';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSelector, useDispatch } from 'react-redux';
import SnetButton from '../snet-button';
import AdaToEthTokenAndValue from './AdaToEthTokenAndValue';
import { conversionStatuses, conversionSteps, progress } from '../../utils/ConverterConstants';
import { setActiveStep, setCurrentConversionStep } from '../../services/redux/slices/tokenPairs/tokenPairSlice';
import { useStyles } from './styles';
import SnetAlert from '../snet-alert';
import Paths from '../../router/paths';

const DepositAndBurnTokens = ({ onClickCancel, onClickContinueLater, isBurning, blockConfiramtionsReceived, blockConfiramtionsRequired }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { conversion, activeStep } = useSelector((state) => state.tokenPairs.conversionOfAdaToEth);
  const [buttonName, setButtonName] = useState('Copy');

  const isDepositReceived = conversion.status === conversionStatuses.WAITING_FOR_CLAIM;
  const isWaitingForDeposit = activeStep === conversionSteps.DEPOSIT_TOKENS;

  const dispatch = useDispatch();

  const onClickContinue = () => {
    if (isWaitingForDeposit) {
      dispatch(setActiveStep(conversionSteps.CONVERT_TOKENS));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.DEPOSIT_TOKENS, progress: progress.COMPLETE }));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.CONVERT_TOKENS, progress: progress.PROCESSING }));
    } else if (isDepositReceived) {
      dispatch(setActiveStep(conversionSteps.CLAIM_TOKENS));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.CONVERT_TOKENS, progress: progress.COMPLETE }));
    }
  };

  useEffect(() => {
    if (isDepositReceived) {
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.DEPOSIT_TOKENS, progress: progress.COMPLETE }));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.CONVERT_TOKENS, progress: progress.COMPLETE }));
    }
  }, [isDepositReceived]);

  const onClickConvertToken = () => {
    dispatch(setActiveStep(conversionSteps.CLAIM_TOKENS));
  };

  const onCopy = () => {
    navigator.clipboard.writeText(conversion.depositAddress);
    setButtonName('Copied');
    setTimeout(() => {
      setButtonName('Copy');
    }, 4000);
  };

  const openLink = () => {
    navigate(Paths.Transactions);
  };

  useEffect(() => {
    if (conversion.status === conversionStatuses.EXPIRED) {
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.DEPOSIT_TOKENS, progress: progress.ERROR }));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.CONVERT_TOKENS, progress: progress.ERROR }));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.CLAIM_TOKENS, progress: progress.ERROR }));
      dispatch(setCurrentConversionStep({ activeStep: conversionSteps.SUMMARY, progress: progress.ERROR }));
    }
  }, [conversion]);

  return (
    <>
      {activeStep === 0 ? (
        <Typography variant="h6" marginY={4}>
          Please deposit tokens to the Cardano address displayed below. This would incur transaction charges on the cardano chain.
        </Typography>
      ) : (
        <Typography variant="h6" marginY={4}>
          Once the deposit is received, click convert tokens to initiate token burn process and the amount will be converted to the ethereum chain.
        </Typography>
      )}
      <Box>
        <AdaToEthTokenAndValue
          fromTokenAmount={conversion.depositAmount}
          fromTokenSymbol={conversion.pair.from_token.symbol}
          toTokenAmount={conversion.receivingAmount}
          toTokenSymbol={conversion.pair.to_token.symbol}
          conversionFee={conversion.conversionFees}
          conversionFeeTokenSymbol={conversion.pair.from_token.symbol}
        />
        {conversion.status !== conversionStatuses.EXPIRED ? (
          <>
            {activeStep === 0 ? (
              <>
                <Box className={classes.inputBoxAndCopyBtnContainer}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Cardano Deposit Address</InputLabel>
                    <OutlinedInput id="snet-input-with-copy" fullWidth type="text" value={conversion.depositAddress} label="Cardano Deposit Address" disabled />
                  </FormControl>
                  <SnetButton name={buttonName} onClick={onCopy} />
                </Box>
                <Box className={classes.btnContainer}>
                  <SnetButton name="cancel" variant="outlined" onClick={onClickCancel} />
                  <SnetButton disabled={!isWaitingForDeposit && !isDepositReceived} name="i have transferred & ready to continue" onClick={onClickContinue} />
                </Box>
              </>
            ) : null}
            {!isWaitingForDeposit ? (
              <>
                <Box className={classes.processingStatus}>
                  {isDepositReceived ? <CheckCircleOutlineIcon className={classes.checkCircleIcon} /> : <CircularProgress />}
                  {!isDepositReceived && isBurning ? <span>Completed: Token Received</span> : null}
                  <span>
                    {isDepositReceived
                      ? 'Deposit received successfully'
                      : `Processing: ${
                          isBurning ? 'Burning Tokens, Awaiting confirmation' : 'Receiving Confirmation'
                        } ${blockConfiramtionsReceived}/${blockConfiramtionsRequired}`}
                  </span>
                  {isDepositReceived ? null : (
                    <Typography>
                      Your transaction is in progress and may take some time to complete. You can close this overlay and monitor the status from Transactions.
                    </Typography>
                  )}
                </Box>
                <Box className={classes.btnContainer}>
                  <SnetButton name="continue later" variant="outlined" onClick={onClickContinueLater} />
                  <SnetButton disabled={!isWaitingForDeposit && !isDepositReceived} name="convert tokens" onClick={onClickConvertToken} />
                </Box>
              </>
            ) : null}
          </>
        ) : (
          <Box marginTop={2}>
            <SnetAlert
              iconPresence={false}
              type="error"
              error={<p>A more recent deposit was received or this transaction was expired. Please check transaction history for more details.</p>}
            />
            <Box className={classes.btnContainer}>
              <SnetButton name="close" onClick={onClickCancel} variant="outlined" />
              <SnetButton name="view transaction history" onClick={openLink} />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

DepositAndBurnTokens.propTypes = {
  onClickCancel: propTypes.func.isRequired,
  onClickContinueLater: propTypes.func.isRequired,
  isBurning: propTypes.bool.isRequired,
  blockConfiramtionsReceived: propTypes.number.isRequired,
  blockConfiramtionsRequired: propTypes.number.isRequired
};

export default DepositAndBurnTokens;
