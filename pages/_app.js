import '../styles/globals.css'
import { ConnectionProvider } from '../providers/connection'
import { WalletProvider } from '../providers/wallet'
import { AccountsProvider } from '../providers/accounts'

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider>
      <WalletProvider>
        <AccountsProvider>
          <Component {...pageProps} />
        </AccountsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp
