import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Typography, Button } from '@mui/material';
import SwapIcon from '@mui/icons-material/SwapVert';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import propTypes from 'prop-types';
import SnetConversionDropdown from '../../components/snet-conversion-input';
import SnetConversionCharges from '../../components/sent-conversion-charges';
import styles from './styles';

const TokenPairs = ({
  fromBlockchains,
  toBlockchains,
  fromSelectedBlockchain,
  toSelectedBlockchain,
  handleFromBlockchainSelection,
  handleToBlockchainSelection,
  onSwapBlockchain,
  fromTokenPair,
  toTokenPair,
  onSelectingFromToken,
  onSelectingToToken,
  onUseFullamount,
  toInputChange,
  toInputValue,
  fromInputChange,
  fromInputValue,
  walletBalance,
  walletTokenSymbol,
  conversionFee,
  conversionSymbol
}) => {
  const { fromAddress, toAddress, wallets } = useSelector((state) => state.wallet);

  const onClickUseFullAmount = () => {
    onUseFullamount(walletBalance);
  };

  return (
    <>
      <SnetConversionDropdown
        tokenPair={fromTokenPair}
        handleBlockchainSelect={handleFromBlockchainSelection}
        selectedBlockchain={fromSelectedBlockchain}
        blockchains={fromBlockchains}
        tokenPairs={fromSelectedBlockchain.tokenPairs}
        handleSelectToken={onSelectingFromToken}
        onInputChange={fromInputChange}
        inputValue={fromInputValue}
        walletAddress={fromAddress}
        direction="FROM"
        id="from"
      />
      {!isEmpty(wallets) ? (
        <Stack direction="row" alignItems="center" marginTop={1}>
          <Typography variant="caption">Balance: </Typography>
          <Typography variant="caption" marginX={1}>
            {walletBalance} {walletTokenSymbol}
          </Typography>
          <Button onClick={onClickUseFullAmount} variant="text" size="small" sx={{ fontSize: 12 }}>
            Use Full Amount
          </Button>
        </Stack>
      ) : null}
      <Stack direction="row" alignItems="center" justifyContent="center" padding={4.5}>
        <IconButton sx={styles.iconButton} onClick={onSwapBlockchain} color="primary" size="large">
          <SwapIcon />
        </IconButton>
      </Stack>
      <SnetConversionDropdown
        tokenPair={toTokenPair}
        handleBlockchainSelect={handleToBlockchainSelection}
        selectedBlockchain={toSelectedBlockchain}
        blockchains={toBlockchains}
        tokenPairs={toSelectedBlockchain.tokenPairs}
        handleSelectToken={onSelectingToToken}
        walletAddress={toAddress}
        onInputChange={toInputChange}
        inputValue={toInputValue}
        readOnly
        direction="TO"
        id="to"
      />
      {Number(conversionFee) > 0 ? <SnetConversionCharges conversionFee={conversionFee} conversionSymbol={conversionSymbol} /> : null}
    </>
  );
};

TokenPairs.propTypes = {
  fromBlockchains: propTypes.arrayOf(propTypes.object).isRequired,
  toBlockchains: propTypes.arrayOf(propTypes.object).isRequired,
  fromSelectedBlockchain: propTypes.object.isRequired,
  toSelectedBlockchain: propTypes.object.isRequired,
  handleFromBlockchainSelection: propTypes.func.isRequired,
  handleToBlockchainSelection: propTypes.func.isRequired,
  onSwapBlockchain: propTypes.func.isRequired,
  onSelectingToToken: propTypes.func.isRequired,
  onSelectingFromToken: propTypes.func.isRequired,
  toInputChange: propTypes.func.isRequired,
  toInputValue: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  fromInputChange: propTypes.func.isRequired,
  fromInputValue: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  fromTokenPair: propTypes.object.isRequired,
  toTokenPair: propTypes.object.isRequired,
  onUseFullamount: propTypes.func.isRequired,
  walletBalance: propTypes.oneOfType([propTypes.string, propTypes.number]),
  walletTokenSymbol: propTypes.string,
  conversionFee: propTypes.oneOfType([propTypes.string, propTypes.number]),
  conversionSymbol: propTypes.string
};

TokenPairs.defaultProps = {
  conversionFee: 0,
  walletBalance: 0,
  walletTokenSymbol: ''
};

export default TokenPairs;
