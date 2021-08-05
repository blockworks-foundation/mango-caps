import React, { useContext, useEffect, useMemo, useState } from "react"

import { Account, clusterApiUrl, Connection, Transaction, TransactionInstruction } from "@solana/web3.js"

export const CFG = {
  default: "mainnet-beta",
  "mainnet-beta": {
    url: "https://mango.rpcpool.com/",
    swapProgramId: "9bohspFveydu5Wg9Pm4mcLotLE2eBYMZ17G1aJ6ooqk1",
    tokenProgramId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    capMint: "2prC8tcVsXwVJAinhxd2zeMeWMWaVyzPoQeLKyDZRFKd",
    usdMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    usdDecimals: 6,
    capAmount: 500,
  },
  devnet: {
    url: clusterApiUrl("devnet"),
    swapProgramId: "4agVeHTmm3Uis4Wt84NhrQXpEaV1Sb1HZmFvnkMQzDi4",
    tokenProgramId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    capMint: "3qAPiwUSGuqkwkvaLXkKxaoSXr9SpQDMR2xgoPQTgW7j",
    usdMint: "FUneZen4boSp7x3LJ1qYSd4grs2HCNQirot5pexTcBpX",
    usdDecimals: 6,
    capAmount: 500,
  },
}

const ConnectionContext = React.createContext()

export function ConnectionProvider({ children }) {
  const [cluster, setCluster] = useState(CFG.default)
  const config = useMemo(() => CFG[cluster])
  const connection = useMemo(() => new Connection(config.url, "recent"), [config])

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => {})
    return () => {
      connection.removeAccountChangeListener(id)
    }
  }, [connection])

  useEffect(() => {
    const id = connection.onSlotChange(() => null)
    return () => {
      connection.removeSlotChangeListener(id)
    }
  }, [connection])

  return (
    <ConnectionContext.Provider
      value={{
        cluster,
        setCluster,
        config,
        connection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection() {
  return useContext(ConnectionContext)
}
