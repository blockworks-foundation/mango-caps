import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PublicKey
} from '@solana/web3.js';

import { useConnection } from './connection';
import { useWallet } from './wallet';
import { tokenAccountFactory } from '../lib/pool';

const AccountsContext = React.createContext();

export function AccountsProvider({ children }) {

  const { config, connection } = useConnection();
  const { connected, wallet } = useWallet();

  const [capAccount, setCapAccount] = useState({});
  const [usdAccount, setUsdAccount] = useState({});

  useEffect(async () => {
    if (!connected || !connection || !wallet?.publicKey) {
      setCapAccount({});
      setUsdAccount({});
      return;
    }

    const accounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      { programId: new PublicKey(config.tokenProgramId) });
    const parsedAccounts = accounts.value.map(a => tokenAccountFactory(a.pubkey, a.account));

    setCapAccount(parsedAccounts.find(a => a.info.mint.toString() === config.capMint));
    setUsdAccount(parsedAccounts.find(a => a.info.mint.toString() === config.usdMint));
  },[config, connection, connected, wallet]);

  return (
    <AccountsContext.Provider
      value={{
        capAccount,
        usdAccount
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export function useAccounts() {
  return useContext(AccountsContext);
}

