import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('TestToken', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const TestTokenFactory = await ethers.getContractFactory('TestToken')
    const TestToken = await TestTokenFactory.connect(deployer).deploy("Testtoken", "TT")
    await TestToken.deployed()

    return { TestToken, deployer, signers }
  }

  describe('deploy', function () {
    it('can deploy', async () => {
      const { TestToken, deployer, signers } = await loadFixture(deployFixture)
      console.log(await TestToken.name())
      console.log(await TestToken.connect(deployer).totalSupply())
    })
  })
})
