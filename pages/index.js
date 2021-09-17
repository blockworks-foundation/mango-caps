import Head from 'next/head'

import Logo from '../components/Logo'
import ShipmentButton from  '../components/ShipmentButton'
import StatsButton from  '../components/StatsButton'
import WalletButton from  '../components/WalletButton'
import BuyButton from  '../components/BuyButton'
import SellButton from  '../components/SellButton'
import Redeem from  '../components/Redeem'
import CapCount from  '../components/CapCount'
import Disclaimer from  '../components/Disclaimer'




import Card from '../components/Card'
import InfoCard from '../components/InfoCard'
import styled from 'styled-components'

const Page = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  background: linear-gradient(0.34deg, #141026 -4.01%, #9490A6 264.75%);
`

const Content = styled.div`
  width: calc(100vw - 32px);
  max-width: 375px;
  margin-top: 50px
`

const BottomBar = styled.div`
  width: 100%;
  height: 10px;
  bottom: 0;
  background: linear-gradient(84deg, #E4642C 1.84%, #FECA1A 43.54%, #AFD803 83.07%, #AFD803 103.65%);
`





export default function Home() {
  return (
    <Page>
      <Head>
        <title>Mango Market Caps</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato:100,200,300,400,500,600,700,800"
        />
      </Head>

      <div className="p-4 flex space-x-3 items-center">
        <div className="flex-initial">
          <Logo />
        </div>
        <div className="flex-grow" />
        <div className="flex-initial">
          <CapCount />
        </div>
        { /*
        <div className="flex-initial">
          <ShipmentButton />
        </div>
        */ }
        <div className="flex-initial">
          <StatsButton />
        </div>
        <div className="flex-initial">
          <WalletButton />
        </div>
      </div>
  
      <div className="flex justify-center">
        <Content>
          <Card />
          <InfoCard />       
          <BuyButton />
          <div className="flex">
            <SellButton />
            <Redeem />
          </div>
          <Disclaimer />
        </Content>
      </div>
      <BottomBar />
    </Page>
  )
}
