import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("KFNFT", function () {
  const deployFixture = async () => {
    const KFNFTFactory = await ethers.getContractFactory('KFNFT')
    const KFNFT = await KFNFTFactory.deploy()
    await KFNFT.deployed()
    return { KFNFT }
  }
  describe("Deployment", function () {
    it("Should set token uri", async () => {
      const { KFNFT } = await loadFixture(deployFixture)
      const tokenUri = "http://example.com/image.png"
      const res = await KFNFT.mintNFT(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        tokenUri
      )
      const actualTokenUri = await KFNFT.tokenURI(1)
      expect(actualTokenUri).to.equals(tokenUri)
    })
  })
})
