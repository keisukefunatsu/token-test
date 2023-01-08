import { BlockForkEvent } from "@ethersproject/abstract-provider"
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"

const sixMinutes = 60 * 6

describe("Intergration", function () {
  const deployFixture = async () => {
    const [owner, user1, user2] = await ethers.getSigners()
    const testMarketPlaceFactory = await ethers.getContractFactory('TestMarketPlace')
    const testMarketPlace = await testMarketPlaceFactory.connect(owner).deploy()
    const devProposalNFTPlaceFactory = await ethers.getContractFactory('DevProposalNFT')
    const devProposalNFT = await devProposalNFTPlaceFactory.connect(owner).deploy("DevDAOTest", "DDT")
    const devsDAOFactory = await ethers.getContractFactory('DevsDAO')
    const devsDAO = await devsDAOFactory.connect(owner).deploy(testMarketPlace.address, devProposalNFT.address)
    return { testMarketPlace, devProposalNFT, devsDAO, signers: { owner, user1, user2 } }
  }

  describe("Proposal", function () {
    it("Should create proposal", async () => {
      const { devsDAO, testMarketPlace, devProposalNFT, signers } = await loadFixture(deployFixture)
      await (await devProposalNFT.connect(signers.owner).mint(signers.user1.address)).wait()
      await devsDAO.connect(signers.user1).createProposal(0)
      const proposalId = await devsDAO.getProposal(0)
      await (await devsDAO.connect(signers.user1).voteOnProposal(proposalId, BigNumber.from("0"))).wait()

      await time.increase(sixMinutes)

      await signers.owner.sendTransaction({ to: devsDAO.address, value: parseEther("1.0"), gasLimit: 5000000 })
      await devsDAO.connect(signers.user1).executeProposal(0)


    })
  })
})



