import React, { useState } from 'react'
import styled from 'styled-components'
import InfoModal from '../components/InfoModal'

export default function InfoCard() {
const [isOpen, setIsOpen] = useState(false)
  return (
      <CardWrapper>
        <Text>
          Buy and sell real mango market caps.
          Choose between fresh mango orange and stylish black
          on redemption. Worldwide free shipping.&ensp;
          <a
          onClick={() => setIsOpen(true)}
          style={{
            color: '#909090',
            fontWeight: 500,
          }}>
            Learn More
          </a>
        </Text>
        <InfoModal open={isOpen} onClose={() => setIsOpen(false)} />
      </CardWrapper>

  )
}

const CardWrapper = styled.div`
  background: #EFEDF9;
  border-radius: 0 0 20px 20px; 
  color: #000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 26px;
  margin-top: -16px;
  z-index: -2;
`

const Text = styled.p`
  font-weight: 500;
  font-size: 16px;
  width: 100%;
  margin: 0;
`




