
import React, { useState } from 'react'
import styled from 'styled-components'
import StatsModal from '../components/StatsModal'
import { useAccounts } from '../providers/accounts'
import { useConnection } from '../providers/connection'


const Button = styled.button`
  color: #FECA1A;
  border: 2px solid #FECA1A;
  border-radius: 10px;
  transform: scale(1);
  transition: transform 0.3s ease 0s;

  box-sizing: border-box;;
  padding: .75rem;
  line-height: 1;
  letter-spacing: 0.01em;
  
  :hover {
    transform: scale(1.04);
    transition-duration: 0.5s;
    box-shadow: 0px 5px 12px rgba(170, 131, 0, 0.36);
  }
`


export default function StatsButton() {

  const { config } = useConnection();
  const { escrowCapBalance, mintCapAccount } = useAccounts();
  const [isOpen, setIsOpen] = useState(false)

  const mintSupply = mintCapAccount?.supply?.toNumber()
  const redeemed = mintSupply ? config.capAmount - mintSupply + escrowCapBalance : 0


  return (
    <>
    <Button onClick={() => setIsOpen(true)}>
      <div className="space-x-2">
        <span>🔥</span>
        <span>{redeemed} redeemed</span>
      </div>
    </Button>
    <StatsModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

