import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("Deployment", function () {
  const deployFixture = async () => {
    const SimpleDAOFactory = await ethers.getContractFactory('SimpleDAO')
    const SimpleDAO = await SimpleDAOFactory.deploy()
    const MalloryDAOFactory = await ethers.getContractFactory('Mallory')
    const Mallory = await MalloryDAOFactory.deploy()
    await Mallory.deployed()
    return { SimpleDAO, Mallory }
  }
  describe("reentrancy attack", function () {
    it("Should withdraw many times", async () => {
      const { SimpleDAO, Mallory } = await loadFixture(deployFixture)

    })
  })
})
