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
  const { getBalance, poolCapAccount, balanceUpdated, mintCapAccount } = useAccounts();

  const [amountToBuy, setAmountToBuy] = useState(1);
  const [amountAvailable, setAmountAvailable] = useState(0);
  const totalSupply = mintCapAccount?.supply.toNumber();
  const [price, setPrice] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");

  useEffect(async() => {
    if (poolCapAccount) {
      console.log('Buy.amountAvailable', poolCapAccount.pubkey.toString());
      setAmountAvailable(await getBalance(poolCapAccount));
    }
  },[poolCapAccount, balanceUpdated]);

  useEffect(async() => {
    if (connection && pool) {
      console.log('Buy.price');
      const newPrice = await calculateDependentAmount(
        connection,
        config.capMint,
        amountToBuy,
        pool,
        PoolOperation.SwapGivenProceeds);
      setPrice(newPrice);
      setFormattedPrice(newPrice.toFixed(2));
    }
  },[amountToBuy, connection, pool, balanceUpdated]);

  return (
    <PriceContext.Provider
      value={{
        amountToBuy,
        setAmountToBuy,
        amountAvailable,
        totalSupply,
        price,
        formattedPrice
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
  const { walletCapAccount, getBalance, balanceUpdated } = useAccounts();
  const { pool } = usePool();

  const [amountToSell, setAmountToSell] = useState(1);

  const [amountAvailable, setAmountAvailable] = useState(0);
  useEffect(async() => {
    if (walletCapAccount) {
      console.log('Sell.amountAvailable');
      setAmountAvailable(await getBalance(walletCapAccount));
    }
  },[walletCapAccount, balanceUpdated]);


  const [price, setPrice] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  useEffect(async() => {
    if (connection && pool) {
      console.log('Sell.price');
      const newPrice = await calculateDependentAmount(connection, config.capMint, amountToSell, pool, PoolOperation.SwapGivenInput);
      setPrice(newPrice);
      setFormattedPrice(newPrice.toFixed(2));
    }
  },[amountToSell, connection, pool, balanceUpdated]);

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


