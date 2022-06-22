import { List, ListItem, Stack, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import isNil from 'lodash/isNil';
import propTypes from 'prop-types';
import { useState } from 'react';
import Button from '../snet-button';
import style from './style';
import WalletAddressInfo from './WalletAddressInfo';

const BlockchainList = ({
  blockchain,
  blockchainLogo,
  onSaveAddress,
  blockChainConnectInfo,
  isWalletAvailable,
  walletAddress,
  disconnectWallet,
  openWallet,
  supportedWallets
}) => {
  const [showInput, setShowInput] = useState(false);

  const showOrHideInput = () => {
    setShowInput(!showInput);
  };

  const saveAddress = (address) => {
    showOrHideInput();
    if (address.length > 0) {
      onSaveAddress(address);
    }
  };

  const isWalletAddressAvailable = () => {
    return !isNil(walletAddress);
  };

  const onCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
  };

  const addEllipsisInBetweenString = (str) => {
    if (str.length && blockchain === 'Cardano') {
      return `${str.substr(0, 25)}...${str.substr(str.length - 25)}`;
    }
    return str;
  };

  return (
    <Box divider id="snet-blockchains-list-box-1" sx={(style.box, blockchain === 'Ethereum' ? style.ethContainer : style.adaContainer)}>
      <Grid container sx={style.grid} minWidth="0">
        <Grid item sm={isWalletAddressAvailable() ? 6 : 4} sx={style.flex}>
          <Avatar alt={blockchain} src={blockchainLogo} />
          <ListItemText primary={blockchain} sx={style.blockchain} />
        </Grid>
        {isWalletAddressAvailable() ? (
          <Grid item sm={isWalletAddressAvailable() ? 6 : 4} sx={style.walletAddInfo}>
            <WalletAddressInfo
              addEllipsisInBetweenString={addEllipsisInBetweenString}
              onCopyAddress={() => onCopyAddress(walletAddress)}
              onDisconnect={() => {
                if (!isWalletAvailable) {
                  showOrHideInput();
                }
                disconnectWallet();
              }}
              onEdit={showOrHideInput}
              walletAddress={walletAddress}
              isWalletAvailable={isWalletAvailable}
            />
          </Grid>
        ) : null}
        {/* {supportedWallets.length < 1 && isNil(walletAddress) ? (
          <Button
            onClick={() => {
              if (!isWalletAvailable) {
                showOrHideInput();
              } else {
                openWallet();
              }
            }}
            name={isWalletAvailable ? 'Connect' : 'Add'}
            variant="outlined"
          />
        ) : null} */}
      </Grid>
      {!isWalletAddressAvailable() ? (
        <Box display="flex" alignItems="center" marginTop={4}>
          <List sx={style.cardanoWalletList}>
            {supportedWallets.map((wallet) => {
              return (
                <ListItem key={wallet.identifier} onClick={() => openWallet(wallet)}>
                  <Tooltip title={wallet.wallet}>
                    <img alt={wallet.wallet} src={wallet.logo} />
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : null}
    </Box>
  );
};

BlockchainList.propTypes = {
  blockchain: propTypes.string.isRequired,
  blockchainLogo: propTypes.string.isRequired,
  blockChainConnectInfo: propTypes.string.isRequired,
  isWalletAvailable: propTypes.bool.isRequired,
  walletAddress: propTypes.string,
  onSaveAddress: propTypes.func,
  disconnectWallet: propTypes.func,
  openWallet: propTypes.func,
  supportedWallets: propTypes.array
};

BlockchainList.defaultProps = {
  supportedWallets: []
};

export default BlockchainList;
