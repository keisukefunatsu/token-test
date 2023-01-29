import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("TestNFT", function () {
  const deployFixture = async () => {
    const TestNFTFactory = await ethers.getContractFactory('TestNFT')
    const TestNFT = await TestNFTFactory.deploy()
    await TestNFT.deployed()
    return { TestNFT }
  }
  describe("Deployment", function () {
    it("Should set token uri", async () => {
      const { TestNFT } = await loadFixture(deployFixture)
      const tokenUri = "http://example.com/image.png"
      const res = await TestNFT.mintNFT(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        tokenUri
      )
      const actualTokenUri = await TestNFT.tokenURI(1)
      expect(actualTokenUri).to.equals(tokenUri)
    })
  })
})
