
import React, { useState } from 'react'
import styled from 'styled-components'
import BuyModal from '../components/BuyModal'
import { PriceProvider } from '../providers/price'

const Button = styled.button`
  color: #FFFFFF;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 5px 11px rgba(170, 131, 0, 0.29);
  transform: scale(1);
  transition: transform 0.3s ease 0s;
  background: linear-gradient(90.85deg, #6CBF00 -19.66%, #AFD803 128.7%);
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  margin: 15px 0 15px 0;
  letter-spacing: 0.01em;

  :hover {
    transform: scale(1.04);
    transition-duration: 0.5s;
    box-shadow: 0px 5px 12px rgba(170, 131, 0, 0.46);
  }

`

export default function BuyButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <span>Buy</span>
      </Button>
      <PriceProvider>
        <BuyModal open={isOpen} onClose={() => setIsOpen(false)} />
      </PriceProvider>
    </>
  );
}

