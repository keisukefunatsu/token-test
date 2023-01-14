import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("Exchange", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const TestTokenFactory = await ethers.getContractFactory('ERC20')
    const TestToken = await TestTokenFactory.deploy('Token', 'TK')
    const ExchangeFactory = await ethers.getContractFactory('Exchange')
    const Exchange = await ExchangeFactory.deploy(TestToken.address)
    const [deployer, signers] = await ethers.getSigners()
    return { Exchange, deployer, signers }
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { Exchange } = await loadFixture(deployFixture)
      const a = await Exchange.getReserve()
      console.log(a)
    })
  })
})
