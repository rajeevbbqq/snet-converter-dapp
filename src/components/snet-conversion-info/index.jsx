import propTypes from 'prop-types';
import { useEffect, useState } from 'react';

import ConversionDetailsModal from '../../pages/Converter/ETHTOADAConversionPopup';
import { getConversionStatus } from '../../utils/HttpRequests';

const SNETConversion = ({ openPopup, conversion }) => {
  const [conversionTitle, setConversionTitle] = useState('');
  const [blockConfirmationsRequired, setConfirmationsRequired] = useState(0);
  const [blockConfirmations, setConfirmations] = useState(0);

  const getConversionDetails = async () => {
    try {
      const { conversionId } = conversion;
      const response = await getConversionStatus(conversionId);
      console.log(response);

      const title = `${response.from_token.name} to ${response.to_token.name}`;
      const [confirmation] = response.transaction;

      setConversionTitle(title);
      setConfirmations(confirmation.confirmation);
      setConfirmationsRequired(confirmation.confirmation_required);
    } catch (error) {
      console.log('Error on getConversionDetails: ', error);
      throw error;
    }
  };

  useEffect(() => {
    if (openPopup) {
      const interval = 60000;
      setInterval(() => {
        getConversionDetails();
      }, interval);

      clearInterval(interval);
    }
  }, []);

  return (
    <ConversionDetailsModal
      handlePopupClose={() => {}}
      openPopup={openPopup}
      title={conversionTitle}
      blockConfiramtionsReceived={blockConfirmations}
      blockConfiramtionsRequired={blockConfirmationsRequired}
    />
  );
};

SNETConversion.propTypes = {
  openPopup: propTypes.bool,
  conversion: propTypes.object
};

export default SNETConversion;
