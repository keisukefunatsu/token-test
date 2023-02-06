import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Telephone', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const TelephoneFactory = await ethers.getContractFactory('EthernautTelephone')
    const Telephone = await TelephoneFactory.connect(deployer).deploy()
    await Telephone.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautTelephoneAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy(Telephone.address)
    await Attack.deployed()
    return { Telephone, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('take ownership', async () => {
      const { Telephone, Attack, deployer, signers } = await loadFixture(deployFixture)
      expect(await Telephone.connect(signers[0]).owner()).to.equal(deployer.address)
      await Telephone.connect(signers[0]).changeOwner(signers[0].address)
      expect(await Telephone.connect(signers[0]).owner()).to.equal(deployer.address)
      await Attack.connect(signers[0]).attack(signers[0].address)
      expect(await Telephone.connect(signers[0]).owner()).to.equal(signers[0].address)
    })
  })
})
