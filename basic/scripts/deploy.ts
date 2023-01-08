import { ethers } from "hardhat"

async function main() {
  const hankoTokenFactory = await ethers.getContractFactory('Hanko')
  const hankoToken = await hankoTokenFactory.deploy('Hanko', 'HNK')
  await hankoToken.deployed()
  console.log(hankoToken.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
