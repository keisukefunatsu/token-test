import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import { config as dotenvConfig } from 'dotenv'
import 'hardhat-abi-exporter'
import 'hardhat-watcher'



dotenvConfig({ path: __dirname + '/.env' })

const LOCAL_PRIVATE_KEY = process.env['LOCAL_PRIVATE_KEY'] ?? ''
if (LOCAL_PRIVATE_KEY === '') {
  throw Error('LOCAL_PRIVATE_KEY is not set')
}

const ALCHEMY_API_KEY_URL = process.env['ALCHEMY_API_KEY_URL'] ?? ''

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    local: {
      url: `http://localhost:8545`,
      accounts: [LOCAL_PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000
    },
    // hardhat: {
    //   forking: {
    //     url: ALCHEMY_API_KEY_URL,
    //     blockNumber: 16362363
    //   },
    // },
  },
  abiExporter: [
    {
      path: './abi/json',
      format: 'json'
    }
  ],
}

export default config
