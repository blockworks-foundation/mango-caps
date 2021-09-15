import React, { useEffect, useState } from "react"
import styled from "styled-components"
import RedeemModal from "../components/RedeemModal"
import { useAccounts } from "../providers/accounts"
import { SellPriceProvider } from "../providers/price"
import DisclaimerPop from "./DisclaimerPop"

const Button = styled.button`
  background: #efedf9;
  color: #696969;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0.87rem;
  line-height: 1;
  letter-spacing: 0.01em;
  margin: 0 0 0 15px;
  opacity: 50%;
`

export default function Redeem() {
  const { walletCapAccount, walletCapBalance } = useAccounts()

  const [isOpen, setIsOpen] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [readDisclaimer, setRedDisclaimer] = useState(false)
  const hasCap = walletCapBalance > 0

  const handleClick = function() {
    if (!readDisclaimer) {
      setShowDisclaimer(true)
      return
    }
    setIsOpen(true)
  }

  const handleAcceptDisclaimer = function() {
    setRedDisclaimer(true)
    setShowDisclaimer(false)
    setIsOpen(true)
  }

  return (
    <>
      {showDisclaimer && <DisclaimerPop onAccept={handleAcceptDisclaimer}/>}
      <Button
        disabled={!hasCap}
        style={{
          opacity: hasCap ? 1.0 : 0.5,
          cursor: hasCap ? "pointer" : "default",
        }}
        onClick={handleClick}
      >
        <span>Redeem</span>
      </Button>
      <SellPriceProvider>
        <RedeemModal open={isOpen} onClose={() => setIsOpen(false)} />
      </SellPriceProvider>
    </>
  )
}
