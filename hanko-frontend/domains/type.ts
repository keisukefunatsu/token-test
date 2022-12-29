

export type walletProvider = {
  type: string
  connectMetamask: () => Promise<void>
  account: string
  walletConnected: boolean
}
export type Ethereum = {
  isMetaMask: boolean
}
