import React, { useContext, useEffect, useMemo, useState } from "react";
import { useConnection } from './connection'
import { usePool } from './pool'
import { useAccounts } from './accounts'
import { useWallet } from './wallet'
import { cache, calculateDependentAmount, PoolOperation } from '../lib/pool'

const PriceContext = React.createContext();

export function PriceProvider({ children }) {

  const { connection, config } = useConnection();
  const { pool } = usePool();

  const [amountToBuy, setAmountToBuy] = useState(1);
  const totalSupply = config.capAmount;

  const [amountAvailable, setAmountAvailable] = useState(0);
  const refreshAvailable = async () => {
    console.log('refreshing', {connection, pool});
    if (pool) {
      const capAccount = await cache.refreshAccount(
        connection,
        pool.pubkeys.holdingAccounts[0]
      );
      const capAmount = capAccount.info.amount.toNumber();
      setAmountAvailable(capAmount);
    }
  };
  useEffect(refreshAvailable,[connection, pool]);

  const [price, setPrice] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  useEffect(async() => {
    if (pool) {
      const newPrice = await calculateDependentAmount(
        connection,
        config.capMint,
        amountToBuy,
        pool,
        PoolOperation.SwapGivenProceeds);
      setPrice(newPrice);
      console.log({newPrice})
      setFormattedPrice(newPrice.toFixed(2));
    }
  },[amountAvailable, amountToBuy, pool]);

  return (
    <PriceContext.Provider
      value={{
        amountToBuy,
        setAmountToBuy,
        amountAvailable,
        totalSupply,
        price,
        formattedPrice,
        refreshAvailable
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export function usePrice() {
  return useContext(PriceContext);
}


export function SellPriceProvider({ children }) {
  const { connection, config } = useConnection();
  const { connected, wallet } = useWallet();
  const { capAccount } = useAccounts();
  const { pool } = usePool();

  const [amountToSell, setAmountToSell] = useState(1);

  const [amountAvailable, setAmountAvailable] = useState(0);
  useEffect(async() => {
    console.log('refresh amountAvailable', {capAccount, key: capAccount?.pubkey?.toString(), amount: capAccount?.info?.amount?.toNumber()});
    if (capAccount) {
      const capAmount = capAccount.info.amount.toNumber();
      setAmountAvailable(capAmount);
    }
  },[capAccount]);

  const [price, setPrice] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  useEffect(async() => {
    if (pool) {
      const newPrice = await calculateDependentAmount(connection, config.capMint, amountToSell, pool, PoolOperation.SwapGivenInput);
      setPrice(newPrice);
      setFormattedPrice(newPrice.toFixed(2));
    }
  },[amountToSell, pool, capAccount, amountAvailable]);

  return (
    <PriceContext.Provider
      value={{
        amountToSell,
        setAmountToSell,
        amountAvailable,
        price,
        formattedPrice
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};


