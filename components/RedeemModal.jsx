import React, { useState } from 'react'
import styled from 'styled-components'
import CapCount from '../components/CapCount'
import ColorPicker from '../components/ColorPicker'
import IncrementToken from './IncrementToken'
import GalleryRedeem from './GalleryRedeem'
import { bgConnected, bgDisconnected } from './WalletButton'
import { useAccounts } from '../providers/accounts'
import { useConnection } from '../providers/connection'
import { usePrice } from '../providers/price'
import { usePool } from '../providers/pool'
import { useWallet } from '../providers/wallet'
import { cache, redeem } from '../lib/pool'


import {
  PublicKey,
} from "@solana/web3.js";


export default function RedeemModal({open, onClose}) {

  if (!open) return null

  const { connection, config } = useConnection();
  const { wallet, connected } = useWallet();
  const { walletCapAccount, walletUsdAccount } = useAccounts();
  const { pool } = usePool();
  const {
    amountToSell,
    setAmountToSell,
    amountAvailable,
    price,
    formattedPrice
  } = usePrice();

  const [redeeming, setRedeeming] = useState(false);
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');


  const [style, setStyle] = useState('black');


  const handleClick = async function() {

    if (!connected) {
      wallet.connect();
      return
    }

    try {
      setRedeeming(true);
      const programIds = {
        token: new PublicKey(config.tokenProgramId),
        swap: new PublicKey(config.swapProgramId) };

      const createOrderRes = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, style }),
      });

      const order = await createOrderRes.json();

      const txHash = await redeem(connection, wallet, walletCapAccount, amountToSell, order.id.toString(), programIds);

      await fetch(`/api/order/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      });

    } catch (e) {
      console.error(e);
    } finally {
      setRedeeming(false);
    }
  };

  const loadingAccounts = connected && !(walletUsdAccount && walletCapAccount && pool && !redeeming)
  // TODO: add google autocomplete?: https://www.tracylum.com/blog/2017-05-20-autocomplete-an-address-with-a-react-form/

  return (
    <>
        <OVERLAY_STYLES> </OVERLAY_STYLES>
        <RedeemWrapper>
          <CardWrapper>
            <Title>Redeem your $MCAPS</Title>
            <SubTitle>Mango Market Caps are redeemable worldwide, please give 1-2 weeks shipping based on location.</SubTitle>
            <GalleryRedeem />
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

              <CapCount></CapCount>
            </span>
            <Increment>
              <IncrementToken amount={amountToSell} setAmount={setAmountToSell} min={1} max={amountAvailable} />
            </Increment>
          </MarketData>
            </FullWidth>
          </CardWrapper>
          <InfoCard>
          <FormTitle>Full Name:</FormTitle>
            <div className="flex">
            <Input  autocomplete="firstname-line-1" onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="Jane" />
            <Input  autocomplete="lastname-line-1" onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="Dow" />
            </div>
            <FormTitle>E-mail:</FormTitle>
            <Input  autocomplete="email-line-1" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="E-mail" />
            <FormTitle>Address:</FormTitle>
            <Input  autocomplete="address-line-1" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Address" />
            <Input  autocomplete="address-line-1" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Secondary (e.g. apartment 2B, Suite 123)" />
            <div className="flex">
            <Input  autocomplete="address-line-1" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="City" />
            <Input type=""  autocomplete="address-line-1" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="State" />
            <Input  autocomplete="address-line-1" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Zipcode" />
            </div>
            <div className="flex">
            <Input  autocomplete="address-line-1" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Country" />
            </div>
            <FormTitle>Choose your color:</FormTitle>
            <ColorPicker />  

            <Button disabled={loadingAccounts} onClick={handleClick} style={{
              background: connected ? bgConnected : bgDisconnected,
              opacity: loadingAccounts ? "50%" : "100%"}}>
              { loadingAccounts && "⏳ (loading) " }
              { wallet && connected ? "Redeem" : "Connect Wallet" }
            </Button>  
            <br />  
            <button onClick={onClose}>Close</button>
          </InfoCard>
        </RedeemWrapper>
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

const RedeemWrapper = styled.div `
display: flex;
position: absolute;
width: auto;
height: auto;
z-index: 1000;
border-radius: 20px; 
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`
const CardWrapper = styled.div`
background: #000000;
background: radial-gradient(132.71% 110% at 1.86% 1.91%, #E54033 0%, #FECA1A 51.79%, #AFD803 83.48%);
box-shadow: 0px 5px 15px rgba(229, 64, 51, 0.19);
width: 100%;
border-radius: 20px; 
color: #fff;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
cursor: default;
padding: 24px;
z-index: 1000;
`
const InfoCard = styled.div`
width: auto;
height: auto;
background: #EFEDF9;
border-radius: 0 20px 20px 0;
color: #000;
display: flex;
flex-direction: column;
flex-wrap: wrap;
cursor: default;
padding: 18px;
padding-left: 45px;
padding-right:33px;
margin-left: -25px;
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

const Increment = styled.div`
  /* margin-bottom: -2px; */
`

const Title = styled.p`
  font-weight: 800;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
`
const SubTitle = styled.p`
  color: #382323;
  font-weight: 400;
  font-size: 14px;
  line-height: 156.7%;
  width: 100%;
  margin: 0;
  font-feature-settings: 'tnum' on, 'onum' on;
`
const FormTitle = styled.p`
  font-weight: 800;
  font-size: 14px;
  width: 100%;
  margin: 0;
  color: #696969;
  text-align: left;
  margin-top: 20px;

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
  margin: 30px 0 0 0;
  letter-spacing: 0.01em;
  align-items: center;


  :hover {
    transform: scale(1.04);
    transition-duration: 0.5s;
    box-shadow: 0px 5px 12px rgba(170, 131, 0, 0.46);
  }

`


const Input = styled.input`
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);
  transform: scale(1);
  transition: transform 0.3s ease 0s;
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  margin: 15px 15px 0 0;
  letter-spacing: 0.01em;
  align-items: center;


  :hover {
    opacity: .8;
  }

  :focus {
    border: solid 2px #F2C94C;
    border-radius: 10px;
    outline: 0;
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

