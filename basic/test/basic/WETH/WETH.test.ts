import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { beforeEach } from 'node:test'

describe('WETH', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const WETHFactory = await ethers.getContractFactory('WETH')
    const WETH = await WETHFactory.connect(deployer).deploy()
    await WETH.deployed()
    return { WETH, deployer, signers }
  }
  describe('deposit', function () {
    it('Should mint 1:1 WETH', async () => {
      const { WETH, signers } = await loadFixture(deployFixture)
      expect(await WETH.connect(signers[0]).balanceOf(signers[0].address))
        .to.equal('0')
      await WETH.connect(signers[0]).deposit({
        value: parseEther('10')
      })
      const balance = await WETH.connect(signers[0]).balanceOf(signers[0].address)
      expect(formatUnits(balance.toString(), 18))
        .to.equal('10.0')
    })
  })
  describe('withdraw', function () {
    it('Should withdraw', async () => {
      const { WETH, signers } = await loadFixture(deployFixture)
      await WETH.connect(signers[0]).deposit({
        value: parseEther('10')
      })
      await WETH.connect(signers[0]).withdraw(parseUnits('5.0', 18))
      const wethBalance = await WETH.connect(signers[0]).balanceOf(signers[0].address)
      expect(formatUnits(wethBalance.toString(), 18)).to.equal('5.0')
    })
  })
})



