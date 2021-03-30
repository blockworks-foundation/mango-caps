import '../styles/globals.css'
import { ConnectionProvider } from '../providers/connection'
import { WalletProvider } from '../providers/wallet'
import { AccountsProvider } from '../providers/accounts'
import { PoolProvider } from '../providers/pool'
import { PriceProvider } from '../providers/price'

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider>
      <PoolProvider>
        <WalletProvider>
          <AccountsProvider>
            <PriceProvider>
              <Component {...pageProps} />
            </PriceProvider>
          </AccountsProvider>
        </WalletProvider>
      </PoolProvider>
    </ConnectionProvider>
  );
}

export default MyApp
