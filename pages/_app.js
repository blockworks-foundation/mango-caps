import '../styles/globals.css'
import { ConnectionProvider } from '../providers/connection'
import { WalletProvider } from '../providers/wallet'
import { AccountsProvider } from '../providers/accounts'
import { PoolProvider } from '../providers/pool'
import { PriceProvider } from '../providers/price'

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider>
      <WalletProvider>
        <AccountsProvider>
          <PoolProvider>
            <PriceProvider>
              <Component {...pageProps} />
            </PriceProvider>
          </PoolProvider>
        </AccountsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp
