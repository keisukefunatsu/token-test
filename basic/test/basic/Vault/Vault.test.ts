import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { utils } from 'ethers'
import { ethers } from 'hardhat'

const PASSWORD = '123456789'
describe('Vault', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const VaultFactory = await ethers.getContractFactory('Vault')
    const Vault = await VaultFactory.connect(deployer).deploy(utils.formatBytes32String(PASSWORD))
    await Vault.deployed()
    return { Vault, deployer, signers }
  }
  describe('unlock', function () {
    it('Should unlock with password', async () => {
      const { Vault, signers } = await loadFixture(deployFixture)
      expect(await Vault.locked()).to.equal(true)
      await Vault.unlock(utils.formatBytes32String(PASSWORD))
      expect(await Vault.locked()).to.equal(false)
    })
  })
})



