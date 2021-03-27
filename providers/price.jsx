import React, { useContext, useEffect, useMemo, useState } from "react";
import { useConnection } from './connection'
import { usePool } from './pool'
import { cache, calculateDependentAmount, PoolOperation } from '../lib/pool'

const PriceContext = React.createContext();

export function PriceProvider({ children }) {

  const { connection, config } = useConnection();
  const { pool } = usePool();

  const [amountToBuy, setAmountToBuy] = useState(1);
  const totalSupply = 500;

  const [amountAvailable, setAmountAvailable] = useState(0);
  useEffect(async() => {
    if (pool) {
      const capAccount = await cache.queryAccount(
        connection,
        pool.pubkeys.holdingAccounts[0]
      );
      const capAmount = capAccount.info.amount.toNumber();
      setAmountAvailable(capAmount);
    }
  },[pool]);

  const [price, setPrice] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState("");
  useEffect(async() => {
    if (pool) {
      const newPrice = await calculateDependentAmount(connection, config.capMint, amountToBuy, pool, PoolOperation.SwapGivenProceeds);
      setPrice(newPrice);
      setFormattedPrice(newPrice.toFixed(2));
    }
  },[amountToBuy, pool]);

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

