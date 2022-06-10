import { toUpper } from 'lodash';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getConversionStatus } from '../../utils/HttpRequests';
import ConversionDetailsModal from '../../pages/Converter/ETHTOADAConversionPopup';
import ReadyToClaim from './ReadyToClaim';

const SNETConversion = ({ openPopup, conversion, handleConversionModal }) => {
  const [conversionTitle, setConversionTitle] = useState('');
  const [blockConfirmationsRequired, setConfirmationsRequired] = useState(0);
  const [blockConfirmations, setConfirmations] = useState(0);
  const [isReadyToClaim, setIsReadyToClaim] = useState(false);

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
      const [confirmation] = response.transactions;

      const currentConfirmations = confirmation.confirmation;
      const totalBlockConfirmationsRequired = getTotalBlockConfirmations(response.from_token.blockchain.name);

      setIsReadyToClaim(currentConfirmations >= totalBlockConfirmationsRequired);
      setConversionTitle(title);
      setConfirmations(currentConfirmations);
      setConfirmationsRequired(totalBlockConfirmationsRequired);
    } catch (error) {
      console.log('Error on getConversionDetails: ', error);
      throw error;
    }
  };

  useEffect(() => {
    if (openPopup) {
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
      openLink={() => {}}
      title={conversionTitle}
      blockConfiramtionsReceived={blockConfirmations}
      blockConfiramtionsRequired={blockConfirmationsRequired}
    />
  );
};

SNETConversion.propTypes = {
  openPopup: propTypes.bool,
  conversion: propTypes.object,
  handleConversionModal: propTypes.func
};

export default SNETConversion;
