import '../styles/globals.css'
import { ConnectionProvider } from '../providers/connection'
import { WalletProvider } from '../providers/wallet'

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp
