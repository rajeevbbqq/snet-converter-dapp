import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Stack, Typography } from '@mui/material';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import BlockchainDropdown from './BlockchainDropdown';
import InputWithAssetDropdown from './InputWithAssetDropdown';
import { styles } from './styles';

const SnetConversionOptions = ({
  walletAddress,
  tokenPair,
  tokenPairs,
  handleSelectToken,
  // old data
  handleBlockchainSelect,
  selectedBlockchain,
  direction,
  blockchains,
  onInputChange,
  inputValue,
  readOnly,
  id
}) => {
  const state = useSelector((state) => state);
  const { wallets } = state.wallet;

  const onSelectBlockchain = (event) => {
    const blockchain = event.target.value;
    handleBlockchainSelect(blockchain);
  };

  const onSelectToken = (event) => {
    const token = event.target.value;
    handleSelectToken(token);
  };

  const addEllipsisInBetweenString = (str) => {
    if (str.length) {
      return `${str.substr(0, 6)}...${str.substr(str.length - 6)}`;
    }
    return str;
  };

  return (
    <>
      <Stack sx={styles.fromToDetailsContainer} spacing={1} id={`conversion-direction-${id}`}>
        <Stack spacing={1} sx={styles.fromToDropDownContainer}>
          <Typography sx={styles.dropDownLabel}>{direction}</Typography>
          {blockchains ? (
            <BlockchainDropdown value={selectedBlockchain} handleSelect={onSelectBlockchain} tokens={blockchains} id="snet-conversion-input" />
          ) : null}
        </Stack>
        <Stack spacing={1} sx={styles.walletAddressContainer} id={`wallet-address-${id}`}>
          <WalletIcon sx={styles.walletIcon} />
          <Typography sx={styles.walletAddress}>
            {walletAddress === null || walletAddress === undefined ? 'Wallet Not Selected' : addEllipsisInBetweenString(walletAddress)}
          </Typography>
        </Stack>
      </Stack>
      <InputWithAssetDropdown
        id={`snet-conversion-value-${id}`}
        readOnly={readOnly}
        onInputChange={onInputChange}
        inputValue={inputValue}
        value={tokenPair}
        handleSelect={onSelectToken}
        tokenPairs={tokenPairs}
      />
    </>
  );
};

SnetConversionOptions.propTypes = {
  blockchains: propTypes.arrayOf(propTypes.object),
  tokenPairs: propTypes.arrayOf(propTypes.object),
  walletAddress: propTypes.string,
  handleSelectToken: propTypes.func.isRequired,
  // old data
  direction: propTypes.string.isRequired,
  onInputChange: propTypes.func,
  inputValue: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  readOnly: propTypes.bool,
  tokenPair: propTypes.object,
  id: propTypes.string.isRequired,
  selectedBlockchain: propTypes.object.isRequired,
  handleBlockchainSelect: propTypes.func.isRequired
};

SnetConversionOptions.defaultProps = {
  blockchains: [],
  tokenPairs: [],
  readOnly: false
};

export default SnetConversionOptions;
