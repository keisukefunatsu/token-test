import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { utils } from 'ethers'
import { ethers } from 'hardhat'

const ADMIN = "0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42"
const USER = "0x2db9fd3d099848027c2383d0a083396f6c41510d7acfd92adc99b6cffcf31e96"
describe('Proxy', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const AccessControlFactory = await ethers.getContractFactory('BasicAccessControl')
    const AccessControl = await AccessControlFactory.connect(deployer).deploy()
    await AccessControl.deployed()
    return { AccessControl, deployer, signers }
  }
  describe('AccessControl', function () {
    it('Should be deployer as admin', async () => {
      const { AccessControl, deployer } = await loadFixture(deployFixture)
      const isAdmin = await AccessControl.connect(deployer).roles(ADMIN, deployer.address)
      expect(isAdmin).to.equal(true)
    })
    it('deployer can add user', async () => {
      const { AccessControl, deployer, signers } = await loadFixture(deployFixture)
      let isUser = await AccessControl.connect(deployer).roles(USER, signers[0].address)
      expect(isUser).to.equal(false)
      await AccessControl.connect(deployer).grantRole(USER, signers[0].address)
      expect(await AccessControl.connect(deployer).roles(USER, signers[0].address)).to.equal(true)
    })
    it('deployer can remove user', async () => {
      const { AccessControl, deployer, signers } = await loadFixture(deployFixture)
      await AccessControl.connect(deployer).grantRole(USER, signers[0].address)
      expect(await AccessControl.connect(deployer).roles(USER, signers[0].address)).to.equal(true)
      await AccessControl.connect(deployer).revokeRole(USER, signers[0].address)
      expect(await AccessControl.connect(deployer).roles(USER, signers[0].address)).to.equal(false)
    })
    it('user can not add user', async () => {
      const { AccessControl, deployer, signers } = await loadFixture(deployFixture)
      await AccessControl.connect(deployer).grantRole(USER, signers[0].address)
      expect(await AccessControl.connect(deployer).roles(USER, signers[0].address)).to.equal(true)
      await expect(AccessControl.connect(signers[0]).grantRole(USER, signers[0].address)).to.be.revertedWith("Not authorized")
    })
  })
})



