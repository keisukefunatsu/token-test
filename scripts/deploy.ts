import { ethers } from "hardhat"

async function main() {
  const TestTokenFactory = await ethers.getContractFactory('TestToken')
  const TestToken = await TestTokenFactory.deploy(10000)
  await TestToken.deployed()

  const TestNFTFactory = await ethers.getContractFactory('TestNFT')
  const TestNFT = await TestNFTFactory.deploy()
  await TestNFT.deployed()

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
