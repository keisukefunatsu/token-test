import detectEthereumProvider from '@metamask/detect-provider'
import { createContext, ReactComponentElement, ReactElement, ReactNode, useEffect, useState } from 'react';
import Web3 from 'web3';
import { Ethereum, walletProvider } from '../domains/type';

let ethereum: Ethereum
if (typeof window !== "undefined") {
  ethereum = (window as any)?.ethereum
}

const defaultState: walletProvider = {
  type: '',
  connectMetamask: async () => {},
  account: '',
  walletConnected: false
}

export const WalletContext = createContext(defaultState)

export function WalletAuthenticationProvider({ children }: { children: ReactNode }): ReactElement {

  const [_account, setAccount] = useState<string>('')
  const [_walletConnected, setWalletConnected] = useState<boolean>(false)
  const connectMetamask = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider && ethereum.isMetaMask) {
      const web3 = new Web3(Web3.givenProvider);
      // web3.eth.defaultChain = "kovan";
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      setWalletConnected(true)
    }
  }
  return (
    <>
      <WalletContext.Provider
        value={{
          type: 'metamask',
          connectMetamask,
          account: _account,
          walletConnected: _walletConnected
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  )
}

