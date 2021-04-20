
import React, { useState } from 'react'
import styled from 'styled-components'
import ShipmentModal from '../components/ShipmentModal'
import { useWallet } from '../providers/wallet'
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


export default function ShipmentButton() {

  const { config } = useConnection();
  const { wallet, connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (connected)
      setIsOpen(true);
    else
      wallet.connect();
  };

  return (
    <>
    <Button onClick={handleClick}>
      <div className="space-x-2">
        <span>🚚</span>
        <span>Shipment Status</span>
      </div>
    </Button>
    <ShipmentModal owner={wallet?.publicKey?.toBase58()} open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
