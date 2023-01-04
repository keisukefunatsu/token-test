import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Signer } from 'ethers'
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { beforeEach } from 'node:test'

describe('Proxy', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const ProxyFactory = await ethers.getContractFactory('Proxy')
    const Proxy = await ProxyFactory.connect(deployer).deploy()
    await Proxy.deployed()
    const TestSlotFactory = await ethers.getContractFactory('TestSlot')
    const TestSlot = await TestSlotFactory.connect(deployer).deploy()
    await TestSlot.deployed()
    const CounterV1Factory = await ethers.getContractFactory('CounterV1')
    const CounterV1 = await CounterV1Factory.connect(deployer).deploy()
    await CounterV1.deployed()
    const CounterV2Factory = await ethers.getContractFactory('CounterV2')
    const CounterV2 = await CounterV2Factory.connect(deployer).deploy()
    await CounterV2.deployed()
    return { Proxy, TestSlot, CounterV1, CounterV2, deployer, signers }
  }
  describe('Proxy', function () {
    it('Should increment', async () => {
      const { Proxy, CounterV1, deployer } = await loadFixture(deployFixture)
      await Proxy.connect(deployer).upgradeTo(CounterV1.address)
      expect(await Proxy.implementation()).to.equal(CounterV1.address)

      // https://ethereum.stackexchange.com/questions/120787/testing-proxies-with-hardhat
      const proxied = CounterV1.attach(Proxy.address)
      await proxied.increment()
      // incremented
      expect(await proxied.connect(deployer).count()).to.equal(1)
    })
  })

  describe('Slot', function () {
    it('should write slot', async () => {
      const { TestSlot, deployer } = await loadFixture(deployFixture)
      expect(await TestSlot.connect(deployer).getSlot()).to.equal(ethers.constants.AddressZero)
      await TestSlot.connect(deployer).writeSlot(deployer.address)
      expect(await TestSlot.connect(deployer).getSlot()).to.equal(deployer.address)

    })
  })
})



