import React, { useContext, useEffect, useMemo, useState } from "react"
import { useConnection } from "./connection"
import { usePool } from "./pool"
import { useAccounts } from "./accounts"
import { useWallet } from "./wallet"
import { cache, calculateDependentAmount, PoolOperation } from "../lib/pool"

const PriceContext = React.createContext()

export function PriceProvider({ children }) {
  const { connection, config } = useConnection()
  const { pool } = usePool()
  const { poolCapBalance, poolUSDBalance, mintCapAccount } = useAccounts()

  const amountAvailable = poolCapBalance
  const [amountToBuy, setAmountToBuy] = useState(1)
  const totalSupply = mintCapAccount?.supply?.toNumber() || config.capAmount
  const [price, setPrice] = useState(0)
  const [formattedPrice, setFormattedPrice] = useState("")

  useEffect(async () => {
    if (connection && pool) {
      const newPrice = await calculateDependentAmount(
        connection,
        config.capMint,
        amountToBuy,
        pool,
        PoolOperation.SwapGivenProceeds
      )
      setPrice(newPrice)
      setFormattedPrice(newPrice.toFixed(2))
    }
  }, [amountToBuy, connection, pool, poolCapBalance, poolUSDBalance])

  return (
    <PriceContext.Provider
      value={{
        amountToBuy,
        setAmountToBuy,
        amountAvailable,
        totalSupply,
        price,
        formattedPrice,
      }}
    >
      {children}
    </PriceContext.Provider>
  )
}

export function usePrice() {
  return useContext(PriceContext)
}

export function SellPriceProvider({ children }) {
  const { connection, config } = useConnection()
  const { connected, wallet } = useWallet()
  const { walletCapAccount, walletCapBalance } = useAccounts()
  const { pool } = usePool()

  const amountAvailable = walletCapBalance
  const [amountToSell, setAmountToSell] = useState(1)
  const [price, setPrice] = useState(0)
  const [formattedPrice, setFormattedPrice] = useState("")

  useEffect(async () => {
    if (connection && pool) {
      console.log("Sell.price")
      const newPrice = await calculateDependentAmount(
        connection,
        config.capMint,
        amountToSell,
        pool,
        PoolOperation.SwapGivenInput
      )
      setPrice(newPrice)
      setFormattedPrice(newPrice.toFixed(2))
    }
  }, [amountToSell, connection, pool, walletCapBalance])

  return (
    <PriceContext.Provider
      value={{
        amountToSell,
        setAmountToSell,
        amountAvailable,
        price,
        formattedPrice,
      }}
    >
      {children}
    </PriceContext.Provider>
  )
}
