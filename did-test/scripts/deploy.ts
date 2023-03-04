import { ethers, run } from "hardhat"

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const TestTokenFactory = await ethers.getContractFactory('TestToken')
  const TestToken = await TestTokenFactory.deploy("Testtoken", "TT")
  await TestToken.deployed()
  // // print the address of the deployed contract
  // console.log("Verify Contract Address:", TestToken.address)

  // console.log("Sleeping.....")
  // // Wait for etherscan to notice that the contract has been deployed
  // await delay(40000)

  // // Verify the contract after deploying  
  // await run("verify:verify", {
  //   address: TestToken.address,
  //   constructorArguments: [],
  // })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
