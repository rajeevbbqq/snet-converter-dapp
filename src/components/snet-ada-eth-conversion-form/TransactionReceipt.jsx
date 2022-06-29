import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Stack, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ColorCodes from '../../assets/theme/colorCodes';
import SnetButton from '../snet-button';
import Paths from '../../router/paths';
import { resetConversionStepsForAdaToEth, setActiveStep, setConversionDirection } from '../../services/redux/slices/tokenPairs/tokenPairSlice';
import { availableBlockchains, conversionSteps } from '../../utils/ConverterConstants';
import { useStyles } from './styles';

const TransactionReceipt = ({ receiptLines, txnHash, onClose }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickFinish = () => {
    dispatch(setConversionDirection(availableBlockchains.ETHEREUM));
    dispatch(resetConversionStepsForAdaToEth());
    dispatch(setActiveStep(conversionSteps.DEPOSIT_TOKENS));
    onClose();
  };

  const openLink = () => {
    dispatch(setActiveStep(conversionSteps.DEPOSIT_TOKENS));
    navigate(Paths.Transactions);
  };

  return (
    <Box className={classes.adaEthTransactionReceipt}>
      <Box className={classes.successMsgIconContainer}>
        <CheckCircleOutlineIcon fontSize="large" />
        <Typography variant="h3" color="grey">
          Tokens conversion and claiming successfully completed.
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight="bold">
        Transaction Receipt
      </Typography>
      <List>
        {receiptLines.map((line) => {
          return (
            <ListItem key={line.id} className={classes.receiptList}>
              <Typography>{line.label}</Typography>
              <Typography>{line.value}</Typography>
            </ListItem>
          );
        })}
      </List>
      <Box className={classes.btnContainer}>
        <SnetButton onClick={openLink} variant="text" name="View Transaction History" />
        <SnetButton name="Finish" onClick={onClickFinish} />
      </Box>
    </Box>
  );
};

TransactionReceipt.propTypes = {
  receiptLines: propTypes.arrayOf(propTypes.object),
  txnHash: propTypes.string,
  onClose: propTypes.func
};

TransactionReceipt.defaultProps = {
  receiptLines: [],
  txnHash: ''
};

export default TransactionReceipt;
