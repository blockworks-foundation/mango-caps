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
        src="/mcap_logo_round.png"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      /> $MCAPS</Title>
                </div>
                <br />
          <Text>
            <b>Here’s how it works:</b>
          <br /> 
          $MCAPS is a token that entitles you to 1 real 
          limited edition cap, shipped globally. You can sell the token back 
          at any time or to redeem a real cap, burn an $MCAPS token.
          </Text>
          <br />
          <Text>
            <b>How it’s priced: </b>
          <br /> 
          $MCAPS tokens are listed starting at $15 USDC.
          Each buy/sell will move the price. 
          The increase or decrease follows a &nbsp;
          <a style={{textDecoration: 'underline'}} href="https://blog.relevant.community/bonding-curves-in-depth-intuition-parametrization-d3905a681e0a">
            bonding curve
          </a>.
          <br />
          <br />
          <b>Disclaimer:</b>
          <br />
          The redeemable token is <b>not connected</b> to our upcoming protocol and governance. This is an unaudited smart contract; the smart contract code can be found <a style={{textDecoration: 'underline'}} href="https://github.com/blockworks-foundation/solana-program-library/tree/caps">here.</a>
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
  font-size: 16px;
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
  vertical-align: middle;
`

