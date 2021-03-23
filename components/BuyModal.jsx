import React from 'react'
import styled from 'styled-components'

import Gallery from './Gallery'


export default function BuyModal({open, onClose}) {
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
      /> Buy $MCAP</Title>
                </div>
          <Gallery />

          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed. do eiusmod</Text>
        </CardWrapper>
        <InfoCard>
          <TitleSub>Here's what you owe:</TitleSub>
          <Price>$14.00</Price>
          <Button>Buy</Button>    
          <button onClick={onClose}>Close</button>
        </InfoCard>
        </>
  )
}

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

const CardWrapper = styled.div`
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 400px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px; 
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 24px;
  z-index: 1000;
`
const InfoCard = styled.div`
    position: fixed;
      width: 400px;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
    width: 400px;
    height: auto;
    background: #EFEDF9;
    border-radius: 0 0 20px 20px;
  color: #000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  cursor: default;
  padding: 24px;
  z-index: 999;
`
const Text = styled.p`
  font-weight: 500;
  font-size: 18px;
  width: 100%;
  margin: 0;
`

const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
`
const TitleSub = styled.p`
  font-weight: 800;
  font-size: 18px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
  color: #696969;
  padding-left: 10px;
  text-align: center;
  margin-top: 80px;

`
const Price = styled.p`
  font-weight: 800;
  font-size: 44px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
  padding-left: 10px;
  text-align: center;
`

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
  margin: 15px 0 0 0;
  letter-spacing: 0.01em;
  align-items: center;

`

/*  
These are styles for error button and
disconnected button if it helps!
*/

/*const ButtonDiconnected = styled.button`
  color: #FFFFFF;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  transform: scale(1);
  transition: transform 0.3s ease 0s;
  background: linear-gradient(90.85deg, #E54033 -19.66%, #FECA1A 128.7%);
  box-shadow: 0px 5px 11px rgba(170, 131, 0, 0.29);
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  margin: 15px 0 0 0;
  letter-spacing: 0.01em;
  align-items: center;

`
const ButtonError = styled.button`
  color: #E54033;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  transform: scale(1);
  transition: transform 0.3s ease 0s;
  background: #E4E1F3;
  border: solid 2px #E54033;
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  margin: 15px 0 0 0;
  letter-spacing: 0.01em;
  align-items: center;

`*/
