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

      Fallback.connect(signers[0]).contribute({ value: parseEther("0.0009") })
      console.log(await Fallback.connect(signers[0]).getContribution())
    })
  })
})
