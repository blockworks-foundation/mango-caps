import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PublicKey
} from '@solana/web3.js';
import * as BufferLayout from "buffer-layout";

import { useConnection } from './connection';
import { usePool } from './pool';
import { useWallet } from './wallet';
import { cache, getCachedAccountByMintAndOwner } from '../lib/pool';

const notify = console.log;

const AccountsContext = React.createContext();

export function AccountsProvider({ children }) {

  const { config, connection } = useConnection();
  const { pool } = usePool();
  const { connected, wallet } = useWallet();

  const [poolCapAccount, setPoolCapAccount] = useState();
  const [poolUsdAccount, setPoolUsdAccount] = useState();
  const [walletCapAccount, setWalletCapAccount] = useState();
  const mintCapAccount = useMint(config.capMint);
  const [walletUsdAccount, setWalletUsdAccount] = useState();

  const [poolCapBalance, setPoolCapBalance] = useState(0);
  //const [poolUsdBalance, setPoolUsdBalance] = useState(0);
  const [walletCapBalance, setWalletCapBalance] = useState(0);
  //const [walletUsdBalance, setWalletUsdBalance] = useState(0);

  async function refreshBalance(account, set) {
    if (account) {
      const _account = await cache.queryAccount(
        connection,
        account.pubkey
      );
      set(_account.info.amount.toNumber());
    } else {
      set(0);
    }
  }

  useEffect(() => refreshBalance(poolCapAccount, setPoolCapBalance), [connection, poolCapAccount]);
  //useEffect(() => refreshBalance(poolUsdAccount, setPoolUsdBalance), [connection, poolUsdAccount]);
  useEffect(() => refreshBalance(walletCapAccount, setWalletCapBalance), [connection, walletCapAccount]);
  //useEffect(() => refreshBalance(walletUsdAccount, setWalletUsdBalance), [connection, walletUsdAccount]);

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
      { programId: new PublicKey(config.tokenProgramId) }
    );

    // Just hack this in to parse amount from account with minimal other code changes
    const ACCOUNT_LAYOUT = BufferLayout.struct([
      BufferLayout.blob(64),
      BufferLayout.nu64("amount"),
      BufferLayout.blob(93),
    ]);

    accounts.value
      .filter((x) => ACCOUNT_LAYOUT.decode(x.account.data).amount > 0)
      .forEach((a) => cache.addAccount(a.pubkey, a.account));

    const _walletCapAccount = getCachedAccountByMintAndOwner(config.capMint, wallet.publicKey);
    const _walletUsdAccount = getCachedAccountByMintAndOwner(config.usdMint, wallet.publicKey);
    setWalletCapAccount(_walletCapAccount);
    setWalletUsdAccount(_walletUsdAccount);
  };

  useEffect(refreshWalletAccounts, [config, connection, connected, wallet]);

  function subscribeToAccount(account, set) {
    if (connection && account) {
      let id = connection.onAccountChange(account.pubkey, (info, context) => {
        cache.addAccount(account.pubkey, info);
        refreshBalance(account, set)
      });
      return () => { connection.removeAccountChangeListener(id); };
    }
  }

  useEffect(() => subscribeToAccount(poolCapAccount, setPoolCapBalance), [connection, poolCapAccount]);
  //useEffect(() => subscribeToAccount(poolUsdAccount, setPoolUsdBalance), [connection, poolUsdAccount]);
  useEffect(() => subscribeToAccount(walletCapAccount, setWalletCapBalance), [connection, walletCapAccount]);
  //useEffect(() => subscribeToAccount(walletUsdAccount, setWalletUsdBalance), [connection, walletUsdAccount]);


  return (
    <AccountsContext.Provider
      value={{
        poolCapAccount,
        poolUsdAccount,
        walletCapAccount,
        walletUsdAccount,
        mintCapAccount,
        poolCapBalance,
        //poolUsdBalance,
        walletCapBalance,
        //walletUsdBalance,
        refreshWalletAccounts
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export function useMint(key) {
  const { connection } = useConnection();
  const [mint, setMint] = useState();

  const pubkey = new PublicKey(key);

  useEffect(() => {

    console.log(`mint ${key}`);
    if (!key) {
      return;
    }

    cache
      .queryMint(connection, key)
      .then(setMint)
      .catch((err) =>
        notify({
          message: err.message,
          type: "error",
        })
      );

    const id = connection.onAccountChange(pubkey, (account) => {
      if (account) {
        cache.addMint(pubkey, account);
      }
    });
    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection, key]);

  return mint;
};

export function useAccounts() {
  return useContext(AccountsContext);
}

