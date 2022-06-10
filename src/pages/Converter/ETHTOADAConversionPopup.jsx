import { useMemo } from 'react';
import { Typography, Modal, Box, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import propTypes from 'prop-types';
import SnetButton from '../../components/snet-button';
import styles from './styles';
import { txnOperations } from '../../utils/ConverterConstants';

const ETHTOADAConversionPopup = ({
  title,
  openPopup,
  handlePopupClose,
  openLink,
  blockConfiramtionsRequired,
  blockConfiramtionsReceived,
  transactionOperation
}) => {
  const opration = useMemo(() => {
    let message = 'Awaiting Confimation';
    if (transactionOperation === txnOperations.TOKEN_BURNT) {
      message = 'Burning Tokens, Awaiting confirmation';
    } else if (transactionOperation === txnOperations.TOKEN_MINTED) {
      message = 'Mining Tokens, Awaiting confirmation';
    } else if (transactionOperation === txnOperations.TOKEN_RECEIVED) {
      message = 'Receiving Confirmation';
    }

    return message;
  });
  return (
    <Modal open={openPopup} onClose={handlePopupClose} sx={styles.conersionModal}>
      <Box sx={styles.conersionBox}>
        <Box sx={styles.conersionModalHeader}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <CloseIcon onClick={handlePopupClose} />
        </Box>
        <Box sx={styles.conversionModalBody}>
          <Box sx={styles.processingLoaderContainer}>
            <CircularProgress />
            <Typography>
              Processing: {opration} {blockConfiramtionsReceived}/{blockConfiramtionsRequired}
            </Typography>
          </Box>
          <Typography>
            Your transaction is in progress and may take some time to complete. You can close this overlay and monitor the status from &apos;Transactions&apos;.
          </Typography>
        </Box>
        <Box sx={styles.conersionModalActions}>
          <SnetButton name="view transaction history" onClick={openLink} variant="text" />
          <SnetButton name="close" onClick={handlePopupClose} />
        </Box>
      </Box>
    </Modal>
  );
};

ETHTOADAConversionPopup.propTypes = {
  title: propTypes.string.isRequired,
  openPopup: propTypes.bool.isRequired,
  handlePopupClose: propTypes.func.isRequired,
  openLink: propTypes.func.isRequired,
  blockConfiramtionsRequired: propTypes.number.isRequired,
  blockConfiramtionsReceived: propTypes.number.isRequired,
  transactionOperation: propTypes.string.isRequired
};

export default ETHTOADAConversionPopup;
