import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"
import { beforeEach } from "node:test"

describe("BasicTicketNFT", function () {
  const NFT_NAME = 'BasicTicketNFT'
  const NFT_SYMBOL = 'BTN'
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const BasicTicketNFTFactory = await ethers.getContractFactory('BasicTicketNFT')
    const BasicTicketNFT = await BasicTicketNFTFactory.connect(deployer).deploy("BasicTicketNFT", "BTN")
    await BasicTicketNFT.deployed()
    return { BasicTicketNFT, deployer, signers }
  }
  describe("Deployment", function () {
    it("Should get basic info", async () => {
      const { BasicTicketNFT, deployer } = await loadFixture(deployFixture)
      expect(await BasicTicketNFT.owner()).to.equal(deployer.address)
      expect(await BasicTicketNFT.name()).to.equal(NFT_NAME)
      expect(await BasicTicketNFT.symbol()).to.equal(NFT_SYMBOL)
    })
    it("Should mint ticket with expected cost", async () => {
      const { BasicTicketNFT, signers } = await loadFixture(deployFixture)
      expect(await BasicTicketNFT.connect(signers[1]).mint(1, {
        value: parseEther("0.01")
      }))
    })
    it("Should mint ticket with not expected cost", async () => {

    })
  })
  describe("Mint", function () {
    it("Should mint ticket with expected cost", async () => {
      const { BasicTicketNFT, signers } = await loadFixture(deployFixture)
      await expect(BasicTicketNFT.connect(signers[1]).mint(1, {
        value: parseEther("0.01")
      }))
    })
    it("Should mint ticket with not expected cost", async () => {
      const { BasicTicketNFT, signers } = await loadFixture(deployFixture)
      await expect(BasicTicketNFT.connect(signers[1]).mint(1, {
        value: parseEther("0.02")
      })).to.be.revertedWith('Not exactly ETH sent')
    })
  })
})



