import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { utils } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"

describe("Exchange", function () {
  async function deployFixture() {
    const [deployer, ...signers] = await ethers.getSigners()
    const TestTokenFactory = await ethers.getContractFactory('TestToken')
    const TestToken = await TestTokenFactory.connect(deployer).deploy()
    const ExchangeFactory = await ethers.getContractFactory('Exchange')
    const Exchange = await ExchangeFactory.connect(deployer).deploy(TestToken.address)
    const decimals = await TestToken.decimals()
    const addAmount = utils.parseUnits('10', decimals)
    await TestToken.connect(deployer).transfer(signers[0].address, addAmount)
    await TestToken.connect(deployer).transfer(signers[1].address, addAmount)

    return { Exchange, TestToken, deployer, signers }
  }

  describe("Deployment", function () {
    it("Should not reserve dev LP token", async function () {
      const { Exchange } = await loadFixture(deployFixture)
      expect(await Exchange.getReserve()).to.equal(0)
    })
  })
  describe("Add liquidity", function () {
    it("Should add liquidity", async function () {
      const { Exchange, TestToken, signers } = await loadFixture(deployFixture)
      const decimals = await TestToken.decimals()
      const addAmount = utils.parseUnits('1', decimals)
      const addAmount2 = utils.parseUnits('0.5', decimals)
      await TestToken.connect(signers[0]).approve(Exchange.address, addAmount)
      await Exchange.connect(signers[0]).addLiquidity(addAmount, {
        value: parseEther('1.0')
      })
      expect(await Exchange.getReserve()).to.equal(utils.parseUnits('1', decimals))
      await TestToken.connect(signers[0]).approve(Exchange.address, addAmount)
      await Exchange.connect(signers[0]).addLiquidity(addAmount, {
        value: parseEther('1.0')
      })
      expect(await Exchange.getReserve()).to.equal(utils.parseUnits('2', decimals))
      expect(await Exchange.balanceOf(signers[0].address)).to.equal(utils.parseUnits('2', decimals))

      // await TestToken.connect(signers[1]).approve(Exchange.address, addAmount2)
      // await Exchange.connect(signers[1]).addLiquidity(addAmount2, {
      //   value: parseEther('0.5')
      // })

      console.log('liquidity:', await Exchange.balanceOf(signers[2].address))
    })
  })
})

