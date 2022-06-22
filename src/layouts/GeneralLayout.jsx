import propTypes from 'prop-types';
import { isNil } from 'lodash';
import store from 'store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menubar from '../components/snet-navigation';
import SnetModal from '../components/snet-modal';
import { getAvailableBlockchains } from '../services/redux/slices/blockchain/blockchainActions';
import { useStyles } from './styles';
import SnetFooter from '../components/snet-footer';
import { useWalletHook } from '../components/snet-wallet-connector/walletHook';
import {
  availableBlockchains,
  cardanoSupportingWallets,
  cardanoWalletConnected,
  supportedCardanoNetworks,
  supportedEthereumNetworks
} from '../utils/ConverterConstants';
import useInjectableWalletHook from '../libraries/useInjectableWalletHook';

import { setWallets } from '../services/redux/slices/wallet/walletSlice';

const cardanoNetworkId = Number(process.env.REACT_APP_CARDANO_NETWORK_ID);

const GeneralLayout = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { entities } = useSelector((state) => state.blockchains);
  const { wallets } = useSelector((state) => state.wallet);
  const { userSelecteNetworkId } = useWalletHook();
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { selectedNetwork, selectedWallet, connectWallet } = useInjectableWalletHook(cardanoSupportingWallets, cardanoNetworkId);

  useEffect(() => {
    if (!isNil(userSelecteNetworkId)) {
      const expectedNetworkId = Number(process.env.REACT_APP_INFURA_NETWORK_ID);
      const currentNetworkId = Number(userSelecteNetworkId);
      setOpenModal(expectedNetworkId !== currentNetworkId);
      const networkName = supportedEthereumNetworks[process.env.REACT_APP_INFURA_NETWORK_ID];
      setModalMessage(`Please Switch to Ethereum ${networkName} Network`);
    }
  }, [userSelecteNetworkId]);

  const connectCardanoWallet = async () => {
    try {
      const connectedCardanoWallet = store.get(cardanoWalletConnected) ?? false;
      if (connectedCardanoWallet) {
        await connectWallet(connectedCardanoWallet);
      }
    } catch (error) {
      console.log('Error on connectCardanoWallet', error);
      throw error;
    }
  };

  useEffect(() => {
    if (entities.length < 1) {
      dispatch(getAvailableBlockchains());
      connectCardanoWallet();
    }
  }, []);

  useEffect(() => {
    if (!isNil(selectedWallet)) {
      dispatch(setWallets({ ...wallets, [availableBlockchains.CARDANO]: selectedWallet }));
    }

    if (!isNil(selectedNetwork)) {
      const currentNetworkId = Number(selectedNetwork);
      const expectedNetworkId = Number(process.env.REACT_APP_CARDANO_NETWORK_ID);
      const networkName = supportedCardanoNetworks[process.env.REACT_APP_CARDANO_NETWORK_ID];
      setOpenModal(expectedNetworkId !== currentNetworkId);
      setModalMessage(`Please Switch to Cardano ${networkName} Network`);
    }
  }, [selectedWallet, selectedNetwork]);

  return (
    <>
      <SnetModal open={openModal} heading="Unsupported Network" message={modalMessage} />
      <Menubar blockchains={entities} />
      <div className={classes.mainContainer}>
        <div className={classes.wrapper}>{children}</div>
      </div>
      <SnetFooter />
    </>
  );
};

GeneralLayout.propTypes = {
  children: propTypes.node.isRequired
};

export default GeneralLayout;
