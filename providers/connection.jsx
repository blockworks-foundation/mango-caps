import React, { useContext, useEffect, useMemo, useState } from "react";

import {
  Account,
  clusterApiUrl,
  Connection,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

const CFG = {
  'mainnet-beta': {
    url: 'https://solana-api.projectserum.com/',
    swapProgramId: 'HbHpkEBvbPVTDPsqWZi7AWgcUZppbmj1YPU4FdxV93kZ',
    tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    capMint: '',
    usdMint: '',
  },
  'devnet': {
    url: clusterApiUrl('devnet'),
    swapProgramId: 'GKZabbjt1rQ5V8at9axSu5pefGqF4JeHt8f7owt6CHpJ',
    tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    capMint: '',
    usdMint: '7tSPGVhneTBWZjLGJGZb9V2UntC7T98cwtSLtgcXjeSs',
  },
};

const ConnectionContext = React.createContext();

export function ConnectionProvider({ children }) {
  const [cluster, setCluster] = useState('devnet');
  const config = useMemo(() => CFG[cluster]);
  const connection = useMemo(() => new Connection(config.url, "recent"), [config]);

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => {});
    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection]);

  useEffect(() => {
    const id = connection.onSlotChange(() => null);
    return () => {
      connection.removeSlotChangeListener(id);
    };
  }, [connection]);

   return (
    <ConnectionContext.Provider
      value={{
        cluster,
        setCluster,
        config,
        connection
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}

