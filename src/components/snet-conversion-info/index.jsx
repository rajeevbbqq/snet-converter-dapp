import { toUpper } from 'lodash';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getConversionStatus } from '../../utils/HttpRequests';
import ConversionDetailsModal from '../../pages/Converter/ETHTOADAConversionPopup';
import ReadyToClaim from './ReadyToClaim';
import { txnOperations } from '../../utils/ConverterConstants';

const SNETConversion = ({ openPopup, conversion, handleConversionModal, openLink, readyToClaim }) => {
  const [conversionTitle, setConversionTitle] = useState('');
  const [blockConfirmationsRequired, setConfirmationsRequired] = useState(0);
  const [blockConfirmations, setConfirmations] = useState(0);
  const [isReadyToClaim, setIsReadyToClaim] = useState(readyToClaim);
  const [operation, setOperation] = useState('');

  const { entities } = useSelector((state) => state.blockchains);

  const getTotalBlockConfirmations = (blockchainName) => {
    const [blockchain] = entities.filter((entity) => toUpper(entity.name) === toUpper(blockchainName));
    return blockchain.block_confirmation;
  };

  const getConversionDetails = async () => {
    try {
      const { conversionId } = conversion;
      const response = await getConversionStatus(conversionId);
      console.log(response);

      const title = `${response.from_token.name} to ${response.to_token.name}`;
      const transaction = response.transactions.length ? response.transactions[response.transactions.length - 1] : response.transactions;
      const currentConfirmations = transaction?.confirmation || 0;
      const totalBlockConfirmationsRequired = getTotalBlockConfirmations(response.from_token.blockchain.name);

      setOperation(transaction.transaction_operation);
      if (currentConfirmations >= totalBlockConfirmationsRequired) {
        if (response.from_token.blockchain.name === 'Cardano' && transaction.transaction_operation === txnOperations.TOKEN_BURNT) {
          setIsReadyToClaim(true);
        } else {
          handleConversionModal();
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

  const startPollingConversionDetails = async () => {
    await getConversionDetails();
    const sixtySeconds = 60 * 1000;
    const interval = setInterval(() => getConversionDetails(), sixtySeconds);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (openPopup && !isReadyToClaim) {
      getConversionDetails();

      const sixtySeconds = 60000;
      const intervalId = setInterval(() => {
        getConversionDetails();
      }, sixtySeconds);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);

  const handlePopupModalClose = () => {
    setIsReadyToClaim(false);
    handleConversionModal();
  };

  if (isReadyToClaim) {
    return <ReadyToClaim closePopup={handlePopupModalClose} isReadyToClaim={isReadyToClaim} conversion={conversion} />;
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
