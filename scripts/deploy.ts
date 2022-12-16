import { ethers } from "hardhat"

async function main() {
  const KFTokenFactory = await ethers.getContractFactory('KFToken')
  const KFToken = await KFTokenFactory.deploy(10000)
  await KFToken.deployed()

  const KFNFTFactory = await ethers.getContractFactory('KFNFT')
  const KFNFT = await KFNFTFactory.deploy()
  await KFNFT.deployed()

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
