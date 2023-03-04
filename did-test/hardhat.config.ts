import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv"
import 'hardhat-abi-exporter'
import "@nomiclabs/hardhat-etherscan"
dotenvConfig({ path: __dirname + '/.env' })

const LOCAL_PRIVATE_KEY = process.env["LOCAL_PRIVATE_KEY"] ?? ''
if (LOCAL_PRIVATE_KEY === '') {
  throw Error('LOCAL_PRIVATE_KEY is not set')
}

const POLYSCAN_API_KEY = process.env["POLYSCAN_API_KEY"] ?? ''
if (POLYSCAN_API_KEY === '') {
  throw Error("POLYSCAN_API_KEY is not set")
}

const ALCHEMY_API_KEY = process.env['ALCHEMY_API_KEY'] ?? ''
if (ALCHEMY_API_KEY === '') {
  throw Error("ALCHEMY_API_KEY is not set")
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.17" },
    ]
  },
  networks: {
    local: {
      url: `http://localhost:8545`,
      accounts: [LOCAL_PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      accounts: [LOCAL_PRIVATE_KEY],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [LOCAL_PRIVATE_KEY],
    },
  },
  abiExporter: [
    {
      path: './abi/json',
      format: "json",
    }
  ],
  etherscan: {
    apiKey: POLYSCAN_API_KEY,
  },
};

export default config;
