import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletAuthenticationProvider } from '../contexts/wallet'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletAuthenticationProvider>
      <Component {...pageProps} />
    </WalletAuthenticationProvider>
  )
}
