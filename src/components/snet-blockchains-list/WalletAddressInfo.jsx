import { Typography } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CopyOrEditIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import propTypes from 'prop-types';
import style from './style';

const WalletAddressInfo = ({ addEllipsisInBetweenString, onCopyAddress, walletAddress, isWalletAvailable, onEdit, onDisconnect }) => {
  const [copyBtn, setCopyBtn] = useState('Copy');
  const disconnectBtnColor = '#000';

  const onClickCopy = () => {
    onCopyAddress(walletAddress);
    setCopyBtn('Copied');
    setTimeout(() => {
      setCopyBtn('Copy');
    }, 5000);
  };

  return (
    <>
      <Stack direction="row" alignItems="center">
        <WalletIcon sx={style.icon} color="grey" />
        <Typography variant="caption" color="text.primary" fontSize="16px">
          {addEllipsisInBetweenString(walletAddress)}
        </Typography>
      </Stack>
      <Stack direction="row" sx={style.btnsAfterConnectOrAdd}>
        <Button padding="0" variant="text" onClick={onClickCopy} startIcon={<CopyOrEditIcon />}>
          {copyBtn}
        </Button>
        {!isWalletAvailable ? (
          <Button onClick={onEdit} variant="text" startIcon={<CopyOrEditIcon />}>
            Edit
          </Button>
        ) : null}
        <Button onClick={onDisconnect} variant="text" sx={style.disconnectBtn} startIcon={<LogoutIcon />}>
          Disconnect
        </Button>
      </Stack>
    </>
  );
};

WalletAddressInfo.propTypes = {
  addEllipsisInBetweenString: propTypes.func.isRequired,
  walletAddress: propTypes.string.isRequired,
  isWalletAvailable: propTypes.bool.isRequired,
  onEdit: propTypes.func,
  onDisconnect: propTypes.func,
  onCopyAddress: propTypes.func
};

export default WalletAddressInfo;
