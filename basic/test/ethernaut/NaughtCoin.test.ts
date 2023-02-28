import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, utils } from 'ethers'
import { hexValue, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('EthernautNaughtCoin', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const EthernautNaughtCoinFactory = await ethers.getContractFactory('EthernautNaughtCoin')
    const EthernautNaughtCoin = await EthernautNaughtCoinFactory.connect(deployer).deploy(signers[0].address)
    await EthernautNaughtCoin.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautNaughtCoinAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy(EthernautNaughtCoin.address)
    await Attack.deployed()
    return { EthernautNaughtCoin, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('make player balance 0', async () => {
      const { EthernautNaughtCoin, Attack, deployer, signers } = await loadFixture(deployFixture)
      // expect(await EthernautNaughtCoin.entrant()).to.equal(ethers.constants.AddressZero)
      // await Attack.connect(signers[0]).attack()
      //  Not solved yet
      // expect(await EthernautNaughtCoin.entrant()).to.equal(signers[0].address)
    })
  })
})
