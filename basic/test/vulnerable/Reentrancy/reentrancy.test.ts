import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"

describe("reentrancy attack", function () {
  const deployVulunerableFixture = async () => {
    const VictimContractFactory = await ethers.getContractFactory('Victim')
    const VictimContract = await VictimContractFactory.deploy()
    const AttackerContractFactory = await ethers.getContractFactory('Attacker')
    const AttackerContract = await AttackerContractFactory.deploy(VictimContract.address)
    return { VictimContract, AttackerContract }
  }
  const deploySecureFixture = async () => {
    const VictimContractFactory = await ethers.getContractFactory('ProtectedVictim')
    const VictimContract = await VictimContractFactory.deploy()
    const AttackerContractFactory = await ethers.getContractFactory('InvalidAttacker')
    const AttackerContract = await AttackerContractFactory.deploy(VictimContract.address)
    return { VictimContract, AttackerContract }
  }
  describe("attack", function () {
    it("Should withdraw many times", async () => {
      const { VictimContract, AttackerContract } = await loadFixture(deployVulunerableFixture)
      const [attackerSigner] = await ethers.getSigners()
      let tx = await VictimContract.connect(attackerSigner).addBalance({
        value: parseEther("10")
      })
      // const s = await addBalanceTx.wait()
      // s.events?.filter((x) => {
      //   x.event == "CurrentBalance" ? console.log(x) : "test"
      // })
      const balance = await VictimContract.getBalance(attackerSigner.address)
      expect(balance).to.equal(BigNumber.from("10000000000000000000"))

      let contractBalance = await ethers.provider.getBalance(VictimContract.address)
      expect(contractBalance).to.equal(parseEther("10"))

      // Attack
      tx = await AttackerContract.connect(attackerSigner).attack({
        value: parseEther("1")
      })
      await tx.wait()
      contractBalance = await ethers.provider.getBalance(VictimContract.address)
      expect(contractBalance).to.equal(BigNumber.from("0"))
      contractBalance = await ethers.provider.getBalance(AttackerContract.address)
      expect(contractBalance).to.equal(parseEther("11"))
    })

    it("Should not withdraw many times", async () => {
      const { VictimContract, AttackerContract } = await loadFixture(deploySecureFixture)
      const [attackerSigner] = await ethers.getSigners()
      let tx = await VictimContract.connect(attackerSigner).addBalance({
        value: parseEther("10")
      })
      const balance = await VictimContract.getBalance(attackerSigner.address)
      expect(balance).to.equal(BigNumber.from("10000000000000000000"))

      let contractBalance = await ethers.provider.getBalance(VictimContract.address)
      expect(contractBalance).to.equal(parseEther("10"))

      // Attack will fail, withdrawal will be reverted.

      await expect(AttackerContract.connect(attackerSigner).attack({
        value: parseEther("1")
      })).to.be.revertedWith("Failed to send ether")

      contractBalance = await ethers.provider.getBalance(VictimContract.address)
      expect(contractBalance).to.equal(BigNumber.from("10000000000000000000"))
      contractBalance = await ethers.provider.getBalance(AttackerContract.address)
      expect(contractBalance).to.equal(parseEther("0"))
    })
  })
})


