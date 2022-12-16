import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import { config as dotenvConfig } from "dotenv"

dotenvConfig({ path: __dirname + '/.env' })

const LOCAL_PRIVATE_KEY = process.env["LOCAL_PRIVATE_KEY"] ?? ''
if (LOCAL_PRIVATE_KEY === '') {
  throw Error('LOCAL_PRIVATE_KEY is not set')
}

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    local: {
      url: `http://localhost:8545`,
      accounts: [LOCAL_PRIVATE_KEY]
    }
  }
}

export default config
