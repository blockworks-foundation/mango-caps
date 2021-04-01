import React, { useContext, useEffect, useMemo, useState } from "react";

import {
  Account,
  clusterApiUrl,
  Connection,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export const CFG = {
  'mainnet-beta': {
    url: 'https://solana-api.projectserum.com/',
    swapProgramId: 'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8',
    tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    capMint: '',
    usdMint: '',
    usdDecimals: 6,
    capAmount: 0,
  },
  'devnet': {
    url: clusterApiUrl('devnet'),
    swapProgramId: '4agVeHTmm3Uis4Wt84NhrQXpEaV1Sb1HZmFvnkMQzDi4',
    tokenProgramId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    capMint: '4a88o4HibvEm2CvxLkMTs8ciryhkvcx2moBhp6rNnVRq',
    usdMint: '7tSPGVhneTBWZjLGJGZb9V2UntC7T98cwtSLtgcXjeSs',
    usdDecimals: 9,
    capAmount: 500,
  },
};

const ConnectionContext = React.createContext();

export function ConnectionProvider({ children }) {
  const [cluster, setCluster] = useState('devnet');
  const config = useMemo(() => CFG[cluster]);
  const connection = useMemo(() => new Connection(config.url, 'recent'), [config]);

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

