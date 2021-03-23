
import React, { useState } from 'react'
import styled from 'styled-components'
import StatsModal from '../components/StatsModal'


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
`
const numRedeemed = 102;


export default function StatsButton() {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <Button onClick={() => setIsOpen(true)}>
      <div className="space-x-2">
        <span>🔥</span>
        <span>{numRedeemed} redeemed</span>
      </div>
    </Button>
    <StatsModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

