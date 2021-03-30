import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SellModal from '../components/SellModal'
import { SellPriceProvider } from '../providers/price'
import { useAccounts } from '../providers/accounts'


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
  margin: 0 0 0 0;
`

export default function SellButton() {

  const { walletCapAccount, getBalance, balanceUpdated } = useAccounts();

  const [isOpen, setIsOpen] = useState(false);
  const [hasCap, setHasCap] = useState(false);

  useEffect(async() => {
    setHasCap(walletCapAccount && 0 < await getBalance(walletCapAccount));
  }, [walletCapAccount, balanceUpdated]);

  return (
    <>
    <Button disabled={!hasCap} style={{
      opacity: hasCap ? 1.0 : 0.5,
      cursor: hasCap ? "pointer" : "default",
    }} onClick={() => setIsOpen(true)}>
        <span>Sell</span>
      </Button>
      <SellPriceProvider>
        <SellModal open={isOpen} onClose={() => setIsOpen(false)} />
      </SellPriceProvider>
    </>
  );
}

