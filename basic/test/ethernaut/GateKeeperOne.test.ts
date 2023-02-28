import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, utils } from 'ethers'
import { hexValue, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('EthernautGatekeeperOne', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const EthernautGatekeeperOneFactory = await ethers.getContractFactory('EthernautGatekeeperOne')
    const EthernautGatekeeperOne = await EthernautGatekeeperOneFactory.connect(deployer).deploy()
    await EthernautGatekeeperOne.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautGatekeeperOneAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy(EthernautGatekeeperOne.address)
    await Attack.deployed()
    return { EthernautGatekeeperOne, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('should be entrant', async () => {
      const { EthernautGatekeeperOne, Attack, deployer, signers } = await loadFixture(deployFixture)
      expect(await EthernautGatekeeperOne.entrant()).to.equal(ethers.constants.AddressZero)
      // await Attack.connect(signers[0]).attack()
      //  Not solved yet
      // expect(await EthernautGatekeeperOne.entrant()).to.equal(signers[0].address)
    })
  })
})
