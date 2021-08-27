import React, { useContext, useEffect, useMemo, useState } from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';
import { useConnection } from './connection'
import {PhantomWalletAdapter} from '../lib/phantom'

const WalletContext = React.createContext();

export function WalletProvider({ children }) {

  const { config } = useConnection();
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState();
  const [walletName, setWalletName] = useState('sollet');
  const [pubkey, setPubkey] = useState();
  const notify = console.log;

  useEffect(() => {
    const wallet = connectWallet(walletName);
    setWallet(wallet);
    return () => {
      wallet.disconnect();
      setConnected(false);
    };
  }, [config, walletName]);

  function connectWallet(walletName) {
    let newWallet;
    switch (walletName) {
      case 'phantom': {
        newWallet = new PhantomWalletAdapter();
        break;
      }
      case 'sollet': {
        newWallet = new Wallet("https://www.sollet.io", config.url);
        break;
      }
      default: {
        newWallet = new Wallet("https://www.sollet.io", config.url);
        break;
      }
    }
    newWallet.on("connect", () => {
      setConnected(true);
      let walletPublicKey = newWallet.publicKey.toBase58();
      let keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length
            )}`
          : walletPublicKey;
      setPubkey(keyToDisplay);
      notify({
        message: "Wallet update",
        description: "Connected to wallet " + keyToDisplay,
      });
    });
    newWallet.on("disconnect", () => {
      setConnected(false);
      notify({
        message: "Wallet update",
        description: "Disconnected from wallet",
      });
    });
    setWallet(newWallet);
    return newWallet;
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        walletName,
        pubkey,
        setWalletName
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  return useContext(WalletContext);
}

