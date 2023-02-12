import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, providers } from 'ethers'
import { hexlify, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Elevator', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const ElevatorFactory = await ethers.getContractFactory('EthernautElevator')
    const Elevator = await ElevatorFactory.connect(deployer).deploy()
    await Elevator.deployed()
    const AttackFactory = await ethers.getContractFactory('Building')
    const Attack = await AttackFactory.connect(signers[0]).deploy(Elevator.address)
    await Attack.deployed()
    return { Elevator, Attack, deployer, signers }
  }

  describe('Solution', function () {
    it('go to top and top should be true.', async () => {
      const { Elevator, Attack, deployer, signers } = await loadFixture(deployFixture)
      expect(await Elevator.top()).to.equal(false)
      await Attack.connect(signers[0]).attack(1)
      expect(await Elevator.top()).to.equal(true)
    })
  })
})
