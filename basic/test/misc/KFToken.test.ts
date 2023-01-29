import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("TestToken", function () {
  const deployFixture = async () => {
    const INITIAL_SUPPLY = 1000000
    const TestTokenFactory = await ethers.getContractFactory('TestToken')
    const TestToken = await TestTokenFactory.deploy(INITIAL_SUPPLY)
    await TestToken.deployed()
    return { TestToken }
  }
  describe("Deployment", function () {
    it("Should set Initial Supply", async () => {
      const { TestToken } = await loadFixture(deployFixture)
      const initialSupplyOfCommunity = 200000
      expect(await TestToken.initialSupplyOfCommunity()).to.equal(initialSupplyOfCommunity)
    })
  })
})
