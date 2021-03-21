import Head from 'next/head'

import Logo from '../components/Logo'
import StatsButton from  '../components/StatsButton'
import WalletButton from  '../components/WalletButton'

import Card from '../components/Card'

import styled from 'styled-components'

const Page = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
`

const Content = styled.div`
  width: calc(100vw - 32px);
  max-width: 375px;
  margin-top: 72px;
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
          <StatsButton />
        </div>
        <div className="flex-initial">
          <WalletButton />
        </div>
      </div>
  
      <div className="flex justify-center">
        <Content>
          <Card />
        </Content>
      </div>
    </Page>
  )
}
