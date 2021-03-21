import React from 'react'
import styled from 'styled-components'

import Gallery from './Gallery'

export default function Card() {

  return (
      <CardWrapper>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed. do eiusmod</Text>
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
  padding: 24px;
  margin-top: -10px;
  z-index: -2;
`

const Text = styled.p`
  font-weight: 500;
  font-size: 18px;
  width: 100%;
  margin: 0;
`




