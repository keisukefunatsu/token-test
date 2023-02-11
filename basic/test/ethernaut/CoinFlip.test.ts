import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('CoinFlip', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const CoinFlipFactory = await ethers.getContractFactory('EthernautCoinFlip')
    const CoinFlip = await CoinFlipFactory.connect(deployer).deploy()
    await CoinFlip.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautCoinFlipAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy()
    await Attack.deployed()
    return { CoinFlip, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('take ownership', async () => {
      const { CoinFlip, Attack, deployer, signers } = await loadFixture(deployFixture)
    })
  })
})
