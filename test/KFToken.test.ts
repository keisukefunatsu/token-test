import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("KFToken", function () {
  const deployFixture = async () => {
    const INITIAL_SUPPLY = 1000000
    const KFTokenFactory = await ethers.getContractFactory('KFToken')
    const KFToken = await KFTokenFactory.deploy(INITIAL_SUPPLY)
    await KFToken.deployed()
    return { KFToken }
  }
  describe("Deployment", function () {
    it("Should set Initial Supply", async () => {
      const { KFToken } = await loadFixture(deployFixture)
      const initialSupplyOfCommunity = 200000
      expect(await KFToken.initialSupplyOfCommunity()).to.equal(initialSupplyOfCommunity)
    })
  })
})
