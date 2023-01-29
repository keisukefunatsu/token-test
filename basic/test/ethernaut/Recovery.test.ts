import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import simpleTokenABI from "../../abi/json/contracts/ethernaut/Recovery.sol/SimpleToken.json"

describe('Proxy', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const RecoveryFactory = await ethers.getContractFactory('Recovery')
    const Recovery = await RecoveryFactory.connect(deployer).deploy()
    await Recovery.deployed()
    const MyRecoveryFactory = await ethers.getContractFactory('MyRecovery')
    const MyRecovery = await MyRecoveryFactory.connect(deployer).deploy()
    await MyRecovery.deployed()
    return { Recovery, MyRecovery, deployer }
  }

  describe('Recovery', function () {
    it('assume its token contract address and call it correctly', async () => {
      const { Recovery, MyRecovery, deployer } = await loadFixture(deployFixture)
      await Recovery.connect(deployer).generateToken("Test Token", 10000)
      const assuemedSimpleTokenAddress = await MyRecovery.connect(deployer).callStatic.recoverAddress(Recovery.address)

      // The code below will work if simpleToken address is correct.
      await deployer.sendTransaction({ to: assuemedSimpleTokenAddress, value: parseEther("1.0"), gasLimit: 5000000 })
      let contractBalance = await ethers.provider.getBalance(assuemedSimpleTokenAddress)
      expect(contractBalance).to.equal(parseEther("1.0"))
      expect(await deployer.getBalance()).to.greaterThan(BigNumber.from("9997"))

      await new Contract(assuemedSimpleTokenAddress, simpleTokenABI, deployer).destroy(deployer.address)
      contractBalance = await ethers.provider.getBalance(assuemedSimpleTokenAddress)
      expect(contractBalance).to.equal(parseEther("0"))

      expect(await deployer.getBalance()).to.greaterThan(BigNumber.from("9998"))
    })
  })
})
