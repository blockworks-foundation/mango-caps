import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PublicKey
} from '@solana/web3.js';

import { useConnection } from './connection';
import { useWallet } from './wallet';

import { assert } from 'assert';
import * as BN from 'bn.js';
import { blob, struct, u32, u8 } from 'buffer-layout';
const publicKey = (property = 'publicKey') => blob(32, property);
const uint64 = (property = 'uint64') => blob(8, property);
const AccountLayout = struct([publicKey('mint'), publicKey('owner'), uint64('amount'), u32('delegateOption'), publicKey('delegate'), u8('state'), u32('isNativeOption'), uint64('isNative'), uint64('delegatedAmount'), u32('closeAuthorityOption'), publicKey('closeAuthority')]);

class u64 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer() {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);

    if (b.length === 8) {
      return b;
    }

    assert(b.length < 8, 'u64 too large');
    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }
  /**
   * Construct a u64 from Buffer representation
   */
  static fromBuffer(buffer) {
    //assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
    return new u64([...buffer].reverse().map(i => `00${i.toString(16)}`.slice(-2)).join(''), 16);
  }
}

function parseAccount(publicKey, data) {
  const decoded = AccountLayout.decode(data);
  return {
    amount: u64.fromBuffer(decoded.amount),
    mint: new PublicKey(decoded.mint),
    owner: new PublicKey(decoded.owner),
    publicKey
  };
}


const AccountsContext = React.createContext();

export function AccountsProvider({ children }) {

  const { config, connection } = useConnection();
  const { connected, wallet } = useWallet();

  const [capAccount, setCapAccount] = useState({});
  const [usdAccount, setUsdAccount] = useState({});

  useEffect(async () => {
    //console.log({connected, connection, key: wallet?.publicKey});
    if (!connected || !connection || !wallet?.publicKey) {
      setCapAccount({});
      setUsdAccount({});
      return;
    }

    const accounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      { programId: new PublicKey(config.tokenProgramId) });
    const parsedAccounts = accounts.value.map(a => parseAccount(a.pubkey, a.account.data));

    setCapAccount(parsedAccounts.find(a => a.mint.toString() === config.capMint));
    setUsdAccount(parsedAccounts.find(a => a.mint.toString() === config.usdMint));
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

