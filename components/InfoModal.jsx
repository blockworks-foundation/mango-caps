import React from 'react'
import styled from 'styled-components'

export default function InfoModal({open, onClose}) {
if (!open) return null

  return (

        <>
        <OVERLAY_STYLES> </OVERLAY_STYLES>
        <CardWrapper>
        <div className="TitleCard">
          <Title><img
        height="24px"
        width="24px"
        src="/mango.svg"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      /> $MCAPS</Title>
                </div>
                <br />
          <Text>
          Here’s how it works:
          <br /> 
          <br /> 
          $MCAPS is a token that entitles you to 1 real 
          limited edition cap, shipped globally. You can sell the token back 
          at any time. To get a real pair, redeem a $MCAP token.
          </Text>
          <br />
          <Text>
          How it’s priced: 
          <br /> 
          <br /> 
          $MCAPS tokens are listed starting at $20 USD. E
          ach buy/sell will move the price. The increase or decrease follows a bonding 
          curve. Enjoying $MCAPS will be a fleeting moment. Mangoes can only be left out for so after all.🥭 
          </Text>
          <br />
          <button onClick={onClose}>Close</button>
        </CardWrapper>
        </>
  )
}

const CardWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: auto;
  background: #EFEDF9;
  border-radius: 20px; 
  color: #000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  cursor: default;
  padding: 24px;
  z-index: 1000;
`

const Text = styled.p`
  font-weight: 500;
  font-size: 18px;
  width: 100%;
  margin: 0;
`
const OVERLAY_STYLES = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: .8;
  z-index:998;
`
const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
`

