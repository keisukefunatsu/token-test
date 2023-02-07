import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, providers } from 'ethers'
import { hexlify, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Force', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const ForceFactory = await ethers.getContractFactory('EthernautForce')
    const Force = await ForceFactory.connect(deployer).deploy()
    await Force.deployed()
    const AttackFactory = await ethers.getContractFactory('EthernautForceAttack')
    const Attack = await AttackFactory.connect(signers[0]).deploy(Force.address)
    await Attack.deployed()
    return { Force, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('make contract balance greater than 0', async () => {
      const { Force, Attack, deployer, signers } = await loadFixture(deployFixture)
      await signers[0].sendTransaction({ value: parseEther("1"), to: Attack.address, gasLimit: 5000000 })
      await Attack.connect(signers[0]).withdraw()
      const balance = await ethers.provider.getBalance(Force.address)
      expect(balance).gt(BigNumber.from("0"))
      // console.log(balance)
    })
  })
})
