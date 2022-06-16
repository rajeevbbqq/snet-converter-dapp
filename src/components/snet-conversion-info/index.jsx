import { toUpper } from 'lodash';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { getConversionStatus } from '../../utils/HttpRequests';
import ConversionDetailsModal from '../../pages/Converter/ETHTOADAConversionPopup';
import TransactionReceipt from '../snet-ada-eth-conversion-form/TransactionReceipt';
import ReadyToClaim from './ReadyToClaim';
import { availableBlockchains, txnOperations } from '../../utils/ConverterConstants';
import SnetDialog from '../snet-dialog';

const SNETConversion = ({ openPopup, conversion, handleConversionModal, openLink, readyToClaim }) => {
  const [conversionTitle, setConversionTitle] = useState('');
  const [blockConfirmationsRequired, setConfirmationsRequired] = useState(0);
  const [blockConfirmations, setConfirmations] = useState(0);
  const [isReadyToClaim, setIsReadyToClaim] = useState(readyToClaim);
  const [isConversionCompleted, setIsConversionCompleted] = useState(false);
  const [txnReceipt, setTxnReceipt] = useState([]);
  const [operation, setOperation] = useState('');

  const { entities } = useSelector((state) => state.blockchains);

  const getTotalBlockConfirmations = (blockchainName) => {
    const [blockchain] = entities.filter((entity) => toUpper(entity.name) === toUpper(blockchainName));
    return blockchain.block_confirmation;
  };

  const generateReceipt = (depositAmount, claimAmount, txnFee, fromTokenSymbol, toTokenSymbol) => {
    return [
      { label: 'Tokens Deposited ', value: `${depositAmount} ${fromTokenSymbol}` },
      { label: 'Tokens Converted ', value: `${claimAmount} ${toTokenSymbol}` },
      { label: 'Transaction Charges ', value: `${txnFee} ${toTokenSymbol}` },
      { label: 'Total tokens received ', value: `${claimAmount} ${toTokenSymbol}` }
    ];
  };

  const getConversionDetails = async () => {
    try {
      const { conversionId } = conversion;
      const response = await getConversionStatus(conversionId);

      const title = `${response.from_token.name} to ${response.to_token.name}`;
      const transaction = response.transactions.length ? response.transactions[response.transactions.length - 1] : response.transactions;
      const currentConfirmations = transaction?.confirmation || 0;
      const totalBlockConfirmationsRequired = getTotalBlockConfirmations(response.from_token.blockchain.name);

      setOperation(transaction.transaction_operation);
      if (currentConfirmations >= totalBlockConfirmationsRequired) {
        const blockchainName = toUpper(response.from_token.blockchain.name);
        if (blockchainName === availableBlockchains.CARDANO && transaction.transaction_operation === txnOperations.TOKEN_BURNT) {
          setIsReadyToClaim(true);
        }
      }
      setConversionTitle(title);
      setConfirmations(currentConfirmations);
      setConfirmationsRequired(totalBlockConfirmationsRequired);
    } catch (error) {
      console.log('Error on getConversionDetails: ', error);
      throw error;
    }
  };

  const handleConversionComplete = () => {
    const receipt = generateReceipt(
      conversion.depositAmount,
      conversion.receivingAmount,
      conversion.conversionFees,
      conversion.pair.from_token.symbol,
      conversion.pair.to_token.symbol
    );

    setTxnReceipt(receipt);
    setIsConversionCompleted(true);
  };

  const startPollingConversionDetails = async () => {
    await getConversionDetails();
    const sixtySeconds = 60 * 1000;
    const interval = setInterval(() => getConversionDetails(), sixtySeconds);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (openPopup && !isReadyToClaim) {
      startPollingConversionDetails();
    }
  }, []);

  const handlePopupModalClose = () => {
    setIsReadyToClaim(false);
    handleConversionModal();
  };

  if (isConversionCompleted) {
    return (
      <SnetDialog showClosebutton={false} isDialogOpen onDialogClose={handlePopupModalClose}>
        <Box padding={4}>
          <TransactionReceipt onClose={handlePopupModalClose} receiptLines={txnReceipt} />
        </Box>
      </SnetDialog>
    );
  }

  if (isReadyToClaim) {
    return (
      <ReadyToClaim
        onConversionComplete={handleConversionComplete}
        closePopup={handlePopupModalClose}
        isReadyToClaim={isReadyToClaim}
        conversion={conversion}
      />
    );
  }

  return (
    <ConversionDetailsModal
      handlePopupClose={handleConversionModal}
      openPopup={openPopup}
      openLink={openLink}
      title={conversionTitle}
      blockConfiramtionsReceived={blockConfirmations}
      blockConfiramtionsRequired={blockConfirmationsRequired}
      transactionOperation={operation}
    />
  );
};

SNETConversion.propTypes = {
  openPopup: propTypes.bool,
  conversion: propTypes.object,
  handleConversionModal: propTypes.func,
  openLink: propTypes.func,
  readyToClaim: propTypes.bool
};

SNETConversion.defaultProps = {
  readyToClaim: false
};
export default SNETConversion;
