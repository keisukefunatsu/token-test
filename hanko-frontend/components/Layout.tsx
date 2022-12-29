import { ReactNode } from "react";
import WalletAuthenticationProvider from "../contexts/wallet";

export default function Layout({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <WalletAuthenticationProvider>
      {children}
    </WalletAuthenticationProvider>
  )
}

