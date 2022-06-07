import { lazy, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Backdrop, CircularProgress, Grid } from '@mui/material';
import { availableBlockchains, conversionSteps, supportedCardanoWallets } from '../../utils/ConverterConstants';
import { setAdaConversionInfo, setConversionDirection, setActiveStep } from '../../services/redux/slices/tokenPairs/tokenPairSlice';
import PendingTxnAlert from './PendingTxnAlert';
import styles from './styles';
import useInjectableWalletHook from '../../libraries/useInjectableWalletHook';
import SnetSnackbar from '../../components/snet-snackbar';
import { useStyles } from '../Contact/styles';
import { bigNumberToString } from '../../utils/bignumber';

const GeneralLayout = lazy(() => import('../../layouts/GeneralLayout'));
const WelcomeBox = lazy(() => import('./WelcomeBox'));
const ADATOERC20ETH = lazy(() => import('./ADATOERC20ETH'));
const ERC20TOADA = lazy(() => import('./ERC20TOADA'));
const SNETADAETHConversionInfo = lazy(() => import('../../components/snet-conversion-info'));

const Converter = () => {
  const [error, setError] = useState({ showError: false, message: '' });
  const [isPopupOpen, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversion, setConversion] = useState(null);
  const { tokenPairs, wallet } = useSelector((state) => state);
  const classes = useStyles();

  const { transferTokens } = useInjectableWalletHook([supportedCardanoWallets.NAMI], process.env.REACT_APP_CARDANO_NETWORK_ID);

  const { conversionDirection } = tokenPairs;
  const pendingTxn = useRef();

  const dispatch = useDispatch();

  const onADATOETHConversion = async (conversionInfo) => {
    try {
      setIsLoading(true);
      const { depositAddress, amount } = conversionInfo;
      console.log('conversionInfo: ', conversionInfo);

      const assetName = conversionInfo.pair.from_token.symbol;
      const assetNameHex = Buffer.from(assetName).toString('hex');
      const assetPolicyId = conversionInfo.pair.from_token.token_address;
      const depositAmount = bigNumberToString(amount);

      await transferTokens(wallet.cardanoWalletSelected, depositAddress, assetPolicyId, assetNameHex, depositAmount);
      dispatch(setAdaConversionInfo(conversionInfo));
      dispatch(setActiveStep(conversionSteps.CONVERT_TOKENS));
      setConversion(conversionInfo);
      setPopup(true);
    } catch (error) {
      console.log('error', error);
      setError({ showError: true, message: error?.info || JSON.stringify(error) });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const closeError = () => {
    setError({ showError: false, message: '' });
  };

  const callPendingTxnAlert = () => {
    pendingTxn.current.fetchPendingTransactionCounts();
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="white" />
      </Backdrop>
      <SnetSnackbar open={error.showError} message={error.message} onClose={closeError} />
      <Helmet>
        <title>SingularityNet Bridge</title>
      </Helmet>
      <GeneralLayout>
        {conversionDirection === availableBlockchains.CARDANO ? (
          <Grid display="flex" justifyContent="center">
            <Grid item>
              <ADATOERC20ETH />
            </Grid>
          </Grid>
        ) : (
          <Grid display="flex" alignItems="flex-start" container spacing={2} sx={styles.homePageContainer}>
            <Grid item xs={12} md={12} sx={styles.pendingTxnAlertContainer}>
              <PendingTxnAlert ref={pendingTxn} />
            </Grid>
            <Grid item xs={12} md={5}>
              <WelcomeBox />
            </Grid>
            <Grid item xs={12} md={7} sx={styles.converterBox}>
              <ERC20TOADA callPendingTxnAlert={callPendingTxnAlert} onADATOETHConversion={onADATOETHConversion} />
            </Grid>
          </Grid>
        )}
        {isPopupOpen && <SNETADAETHConversionInfo conversion={conversion} openPopup={isPopupOpen} />}
      </GeneralLayout>
    </>
  );
};

export default Converter;
