import React, { useContext, useEffect, useMemo, useState } from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';
import { useConnection } from './connection'

const WalletContext = React.createContext();

export function WalletProvider({ children }) {

  const { config } = useConnection();
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState();
  const notify = console.log;

  useEffect(() => {
    let wallet = new Wallet('https://www.sollet.io', config.url);
    wallet.on("connect", () => {
      setConnected(true);
      let walletPublicKey = wallet.publicKey.toBase58();
      let keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length
            )}`
          : walletPublicKey;

      notify({
        message: "Wallet update",
        description: "Connected to wallet " + keyToDisplay,
      });
    });
    wallet.on("disconnect", () => {
      setConnected(false);
      notify({
        message: "Wallet update",
        description: "Disconnected from wallet",
      });
    });
    setWallet(wallet);
    return () => {
      wallet.disconnect();
      setConnected(false);
    };
  }, [config]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  return useContext(WalletContext);
}

