import '../styles/globals.css'
import { ConnectionProvider } from '../providers/connection'
import { WalletProvider } from '../providers/wallet'
import { AccountsProvider } from '../providers/accounts'
import { PoolProvider } from '../providers/pool'

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider>
      <WalletProvider>
        <AccountsProvider>
          <PoolProvider>
            <Component {...pageProps} />
          </PoolProvider>
        </AccountsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp
