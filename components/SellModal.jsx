import React, { useState } from 'react'
import styled from 'styled-components'

import IncrementToken from './IncrementToken'
import Gallery from './Gallery'
import { bgConnected, bgDisconnected } from './WalletButton'
import { useAccounts } from '../providers/accounts'
import { useConnection } from '../providers/connection'
import { usePrice } from '../providers/price'
import { usePool } from '../providers/pool'
import { useWallet } from '../providers/wallet'
import { cache, swap } from '../lib/pool'


import {
  PublicKey,
} from "@solana/web3.js";


export default function SellModal({open, onClose}) {

  if (!open) return null

  const { connection, config } = useConnection();
  const { wallet, connected } = useWallet();
  const { walletCapAccount, walletUsdAccount, refreshWalletAccounts } = useAccounts();
  const { pool } = usePool();
  const {
    amountToSell,
    setAmountToSell,
    amountAvailable,
    price,
    formattedPrice
  } = usePrice();

  const [selling, setSelling] = useState(false);


  const handleClick = async function() {

    if (!connected) {
      wallet.connect();
      return
    }

    try {
      setSelling(true);
      // TODO set slippage back after fixing rounding issue
      const slippage = 1.05;
      const components = [
        {mintAddress: config.capMint, account: walletCapAccount, amount: amountToSell},
        {mintAddress: config.usdMint, account: walletUsdAccount, amount: price * Math.pow(10, config.usdDecimals) / slippage}]
      const programIds = {
        token: new PublicKey(config.tokenProgramId),
        swap: new PublicKey(config.swapProgramId) };

      console.log({connection, wallet, components, slippage, programIds, undefined, pool});

      await swap(connection, wallet, components, programIds, undefined, pool);

      await refreshWalletAccounts()

      setAmountToSell(0)
    } catch (e) {
      console.error(e);
    } finally {
      setSelling(false);
    }
  };

  return (
    <>
        <OVERLAY_STYLES> </OVERLAY_STYLES>
        <SellWrapper>
        <CardWrapper>
        <Title>Mango Market Caps Edition 0</Title>
          <SubTitle>$MCAPS</SubTitle>
          <Gallery />
          <FullWidth>
          <MarketData>
            <span>
                            { /*
              <CurrentPrice>
                ${formattedPrice} USDT &thinsp;
                <img
                  height="17px"
                  width="17px"
                  src="/tether_logo.svg"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginTop:"-6px",
                  }}/>
              </CurrentPrice>
              */}

            <CapCount>
                {`You own ${amountAvailable}`}
            </CapCount>
          </span>
          <Increment>
             <IncrementToken amount={amountToSell} setAmount={setAmountToSell} min={1} max={amountAvailable} />
          </Increment>
        </MarketData>
          </FullWidth>
        </CardWrapper>
        <InfoCard>
          <TitleSub>Here's what you'll receive:</TitleSub>
          <Price>${formattedPrice}&thinsp;<img
      height="30px"
      width="30px"
      src="/tether_logo.svg"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginTop:"-9px",
      }}
    /></Price>
          <Button disabled={selling || !walletUsdAccount} onClick={handleClick} style={{
            background: connected ? bgConnected : bgDisconnected,
            opacity: selling || !walletUsdAccount ? "50%" : "100%"}}>
          {selling && "⏳ (confirm in wallet) "}
          {!selling && !(wallet && connected) && "Connect Wallet"}
          {!selling && wallet && connected && !walletUsdAccount && "You need USDC in your wallet"}
          {!selling && wallet && connected && walletUsdAccount && "Sell"}
          </Button>  
          <br />  
          <button onClick={onClose}>Close</button>
        </InfoCard>
        </SellWrapper>
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
const FullWidth = styled.div`
  width: 100%;
`
const SellWrapper = styled.div`
  display: flex;
  position: absolute;
  width: auto;
  height: auto;
  z-index: 1000;
  border-radius: 20px;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CardWrapper = styled.div`
  background: #000000;
  background: radial-gradient(132.71% 110% at 1.86% 1.91%, #E54033 0%, #FECA1A 51.79%, #AFD803 83.48%);
  box-shadow: 0px 5px 15px rgba(229, 64, 51, 0.19);
  position: fixed;
  width: 370px;
  top: 300px;
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
  width: 370px;
  height: auto;
  top: 600px;
  left: 50%;
  transform: translate(-50%, -50%);
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
const MarketData = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-end;
width: 100%;
margin-top: 1rem;
`
const CurrentPrice = styled.p`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  margin-bottom: 0.5rem;
  font-feature-settings: 'tnum' on, 'onum' on;
`
const CapCount = styled.p`
  color: #605a77;
  font-weight: 400;
  margin: 0px;
  font-size: 13px;
  font-feature-settings: 'tnum' on, 'onum' on;
`
const Increment = styled.div`
  /* margin-bottom: -2px; */
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

const SubTitle = styled.p`
  color: #524646;
  font-weight: 700;
  font-size: 18px;
  line-height: 156.7%;
  width: 100%;
  margin: 0;
  font-feature-settings: 'tnum' on, 'onum' on;
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
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  margin: 15px 0 0 0;
  letter-spacing: 0.01em;
  align-items: center;

  :hover {
    transform: scale(1.04);
    transition-duration: 0.5s;
    box-shadow: 0px 5px 12px rgba(170, 131, 0, 0.46);
  }

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

