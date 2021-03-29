import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PublicKey
} from '@solana/web3.js';

import { useConnection } from './connection';
import { useWallet } from './wallet';
import { cache, getCachedAccountByMintAndOwner } from '../lib/pool';

const AccountsContext = React.createContext();

export function AccountsProvider({ children }) {

  const { config, connection } = useConnection();
  const { connected, wallet } = useWallet();

  const [capAccount, setCapAccount] = useState();
  const [usdAccount, setUsdAccount] = useState();

  const refreshAccounts = async () => {
    console.log('refreshing', {connected, connection, wallet});
    if (!connected || !connection || !wallet?.publicKey) {
      setCapAccount();
      setUsdAccount();
      return;
    }

    const accounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      { programId: new PublicKey(config.tokenProgramId) });

    console.log({accounts});
    accounts.value.forEach(a => cache.addAccount(a.pubkey, a.account));

    setCapAccount(getCachedAccountByMintAndOwner(config.capMint, wallet.publicKey));
    setUsdAccount(getCachedAccountByMintAndOwner(config.usdMint, wallet.publicKey));
  };

  useEffect(refreshAccounts, [config, connection, connected, wallet]);

  return (
    <AccountsContext.Provider
      value={{
        capAccount,
        usdAccount,
        refreshAccounts
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export function useAccounts() {
  return useContext(AccountsContext);
}

