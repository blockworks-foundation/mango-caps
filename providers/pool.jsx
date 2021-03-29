import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Account, AccountInfo,
  Connection,
  PublicKey,
  SystemProgram, Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { TokenSwapLayout } from '../lib/pool';
import { useConnection } from '../providers/connection'

const PoolContext = React.createContext();

const toPublicKey = (s) => new PublicKey(s);

async function toPoolInfo(data, account, program) {
  return {
    pubkeys: {
      account,
      program: toPublicKey(program),
      mint: toPublicKey(data.tokenPool),
      feeAccount: toPublicKey(data.feeAccount),
      holdingMints: [data.mintA, data.mintB].map(toPublicKey),
      holdingAccounts: [data.tokenAccountA, data.tokenAccountB].map(toPublicKey),
    },
    legacy: false,
    raw: data,
  }
};

export function PoolProvider({ children }) {

  const { config, connection } = useConnection();

  const [pool, setPool] = useState();

  useEffect(async () => {
    let response = await connection.getProgramAccounts(toPublicKey(config.swapProgramId));
    let allPools = await Promise.all(response
      .filter(s => s.account.data.length === TokenSwapLayout.span)
      .map(s => toPoolInfo(TokenSwapLayout.decode(s.account.data), s.pubkey, config.swapProgramId)));
    setPool(allPools.find(p =>
      p.pubkeys.holdingMints.map(m => m.toString()).toString() ===
      [config.capMint, config.usdMint].toString()));
  }, [config, connection]);

  return (
    <PoolContext.Provider
      value={{
        pool,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};

export function usePool() {
  return useContext(PoolContext);
}

