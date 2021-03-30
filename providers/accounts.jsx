import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PublicKey
} from '@solana/web3.js';

import { useConnection } from './connection';
import { usePool } from './pool';
import { useWallet } from './wallet';
import { cache, getCachedAccountByMintAndOwner } from '../lib/pool';

const AccountsContext = React.createContext();

export function AccountsProvider({ children }) {

  const { config, connection } = useConnection();
  const { pool } = usePool();
  const { connected, wallet } = useWallet();

  const [poolCapAccount, setPoolCapAccount] = useState();
  const [poolUsdAccount, setPoolUsdAccount] = useState();
  const [walletCapAccount, setWalletCapAccount] = useState();
  const [walletUsdAccount, setWalletUsdAccount] = useState();
  const [balanceUpdated, setBalanceUpdated] = useState(0);

  async function getBalance(account) {
    if (account) {
      console.log('getBalance', account.pubkey.toString());
      const _account = await cache.queryAccount(
        connection,
        account.pubkey
      );
      return _account.info.amount.toNumber();
    } else {
      return undefined;
    }
  }

  const refreshPoolAccounts = async () => {
    if (connection && pool) {
      // TODO: parallelize
      const capAccount = await cache.queryAccount(
        connection,
        pool.pubkeys.holdingAccounts[0]
      );
      setPoolCapAccount(capAccount);

      const usdAccount = await cache.queryAccount(
        connection,
        pool.pubkeys.holdingAccounts[1]
      );
      setPoolUsdAccount(usdAccount);
    }
  };
  useEffect(refreshPoolAccounts, [connection, pool]);

  const refreshWalletAccounts = async () => {
    if (!connected || !connection || !wallet?.publicKey) {
      setWalletCapAccount();
      setWalletUsdAccount();
      return;
    }

    const accounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      { programId: new PublicKey(config.tokenProgramId) });

    accounts.value.forEach(a => cache.addAccount(a.pubkey, a.account));

    setWalletCapAccount(getCachedAccountByMintAndOwner(config.capMint, wallet.publicKey));
    setWalletUsdAccount(getCachedAccountByMintAndOwner(config.usdMint, wallet.publicKey));
  };
  useEffect(refreshWalletAccounts, [config, connection, connected, wallet]);

  function subscribeToAccount(account) {
    if (connection && account) {
      let id = connection.onAccountChange(account.pubkey, (info, context) => {
        cache.addAccount(account.pubkey, info);
        setBalanceUpdated(Date.now());
      });
      return () => { connection.removeAccountChangeListener(id); };
    }
  }

  useEffect(() => subscribeToAccount(poolCapAccount), [connection, poolCapAccount]);
  useEffect(() => subscribeToAccount(poolUsdAccount), [connection, poolUsdAccount]);
  useEffect(() => subscribeToAccount(walletCapAccount), [connection, walletCapAccount]);
  useEffect(() => subscribeToAccount(walletUsdAccount), [connection, walletUsdAccount]);


  return (
    <AccountsContext.Provider
      value={{
        poolCapAccount,
        poolUsdAccount,
        walletCapAccount,
        walletUsdAccount,
        getBalance,
        balanceUpdated,
        refreshWalletAccounts
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export function useAccounts() {
  return useContext(AccountsContext);
}

