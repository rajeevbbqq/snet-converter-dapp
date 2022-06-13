import { Box, Typography } from '@mui/material';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SnetDialog from '../snet-dialog';
import ColorCodes from '../../assets/theme/colorCodes';
import SnetButton from '../snet-button';
import paths from '../../router/paths';
import { useStyles } from './styles';

const SnetConversionStatus = ({ link, isDialogOpen, onDialogClose, title, amount, tokenName }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const openLink = () => {
    navigate(paths.Transactions);
  };

  return (
    <SnetDialog isDialogOpen={isDialogOpen} onDialogClose={onDialogClose} title={title} showClosebutton>
      <div className={classes.ethToAdaTransactionReceiptContainer}>
        <Box display="flex" alignItems="center" className={classes.progressSection}>
          <CheckCircleOutlineIcon className={classes.checkCircleIcon} />
          <Typography align="center" color="grey" variant="body2" marginLeft={2}>
            Tokens converted successfully.
          </Typography>
        </Box>
        <Box minWidth={540} className={classes.transactionReceiptContent}>
          <Typography variant="body2" marginY={2}>
            Transaction Receipt
          </Typography>
          <Box className={classes.transactionDetails}>
            <Typography variant="body2">Tokens Converted</Typography>
            <Typography variant="body1">
              {amount} {tokenName}
            </Typography>
          </Box>
          <Box className={classes.transactionReceiptActions}>
            <SnetButton variant="text" onClick={openLink} name="View Transaction history" />
            <SnetButton onClick={onDialogClose} name="Finish" />
          </Box>
        </Box>
      </div>
    </SnetDialog>
  );
};

SnetConversionStatus.propTypes = {
  title: propTypes.string.isRequired,
  isDialogOpen: propTypes.bool.isRequired,
  onDialogClose: propTypes.func.isRequired,
  link: propTypes.string.isRequired,
  amount: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  tokenName: propTypes.string.isRequired
};

export default SnetConversionStatus;
