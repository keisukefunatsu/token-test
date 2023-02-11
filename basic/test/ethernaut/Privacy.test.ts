import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, utils } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Privacy', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const PrivacyFactory = await ethers.getContractFactory('EthernautPrivacy')
    const passwords = ["Password", "is", "this"].map(p => ethers.utils.formatBytes32String(p))
    const Privacy = await PrivacyFactory.connect(deployer).deploy(["Password", "is", "this"])
    await Privacy.deployed()
    // const AttackFactory = await ethers.getContractFactory('EthernautPrivacyAttack')
    // const Attack = await AttackFactory.connect(signers[0]).deploy()
    // await Attack.deployed()
    return { Privacy, deployer, signers }
  }

  describe('Solution', function () {
    it('take ownership', async () => {
      const { Privacy, deployer, signers } = await loadFixture(deployFixture)
      console.log(await ethers.provider.getStorageAt(Privacy.address, 6))
    })
  })
})



