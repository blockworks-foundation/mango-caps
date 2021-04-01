
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import RedeemModal from '../components/RedeemModal'
import { useAccounts } from '../providers/accounts'
import { SellPriceProvider } from '../providers/price'

const Button = styled.button`
  background: #EFEDF9;
  color: #696969;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  letter-spacing: 0.01em;
  margin: 0 0 0 15px;


`

export default function Redeem() {

  const { walletCapAccount, walletCapBalance } = useAccounts();

  const [isOpen, setIsOpen] = useState(false);
  const hasCap = walletCapBalance > 0;

  return (
    <>
    <Button disabled={!hasCap} style={{
      opacity: hasCap ? 1.0 : 0.5,
      cursor: hasCap ? "pointer" : "default",
    }} onClick={() => setIsOpen(true)}>
        <span>Redeem</span>
      </Button>
      <SellPriceProvider>
        <RedeemModal open={isOpen} onClose={() => setIsOpen(false)} />
      </SellPriceProvider>
    </>
  );
}

