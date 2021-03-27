import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Tilt from 'react-tilt'

import Gallery from './Gallery'
import { usePrice } from '../providers/price'


export default function Card() {

  const {
    amountToBuy,
    setAmountToBuy,
    amountAvailable,
    totalSupply,
    price,
    formattedPrice
  } = usePrice();

  return (
    <Tilt
      style={{ background: '#000', borderRadius: '20px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <Title>Mango Market Caps Edition 0</Title>
        <SubTitle>$MCAPS</SubTitle>
        <Gallery />
        <MarketData>
          <span>
            <CurrentPrice>${formattedPrice} USD</CurrentPrice>
            <SockCount>
              {`${amountAvailable}/${totalSupply} available`}
            </SockCount>
          </span>
          <Info>
            <InfoButton>?</InfoButton>
            <Dynamic>Dynamic Pricing Stats</Dynamic>
          </Info>
        </MarketData>
      </CardWrapper>
    </Tilt>
  )
}

const CardWrapper = styled.div`
  background: #FFFFFF;
  background: radial-gradient(132.71% 110% at 1.86% 1.91%, #E54033 0%, #FECA1A 51.79%, #AFD803 83.48%);
  box-shadow: 0px 5px 15px rgba(229, 64, 51, 0.19);
  border-radius: 18px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 24px;
  z-index: 2;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
`

const Title = styled.p`
  font-weight: 800;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
`

const SubTitle = styled.p`
  color: #524646;
  font-weight: 700;
  font-size: 18px;
  line-height: 156.7%;
  width: 100%;
  margin: 0;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const SockCount = styled.p`
  color: #605a77;
  font-weight: 400;
  margin: 0px;
  font-size: 13px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const CurrentPrice = styled.p`
  font-weight: 600;
  font-size: 24px;
  margin: 0px;
  margin-bottom: 0.2rem;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const Info = styled.div`
  /* margin-bottom: -2px; */
`

const Dynamic = styled.p`
  color: #605a77;
  font-style: italic;
  font-weight: 400;
  margin: 0px;
  margin-top: 1px;
  font-size: 13px;
  float: left;
`

const InfoButton = styled.span`
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: white;
  text-decoration: none;
  text-align: center;
  border-radius: 50%;
  margin-left: 8px;
  float: right;
  background-color: #f49524;
`

const MarketData = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: 1rem;
`

