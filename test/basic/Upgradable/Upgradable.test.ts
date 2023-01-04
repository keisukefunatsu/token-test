import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, Signer } from 'ethers'
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { beforeEach } from 'node:test'

describe('Proxy', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const BuggyProxyFactory = await ethers.getContractFactory('BuggyProxy')
    const BuggyProxy = await BuggyProxyFactory.connect(deployer).deploy()
    await BuggyProxy.deployed()
    const GoodProxyFactory = await ethers.getContractFactory('GoodProxy')
    const GoodProxy = await GoodProxyFactory.connect(deployer).deploy()
    await GoodProxy.deployed()
    const CounterV1Factory = await ethers.getContractFactory('CounterV1')
    const CounterV1 = await CounterV1Factory.connect(deployer).deploy()
    await CounterV1.deployed()
    const CounterV2Factory = await ethers.getContractFactory('CounterV2')
    const CounterV2 = await CounterV2Factory.connect(deployer).deploy()
    await CounterV2.deployed()
    return { BuggyProxy, GoodProxy, CounterV1, CounterV2, deployer, signers }
  }
  describe('Buggy Proxy', function () {
    it('Should not increment', async () => {
      const { BuggyProxy, CounterV1, deployer } = await loadFixture(deployFixture)
      await BuggyProxy.connect(deployer).upgradeTo(CounterV1.address)
      // https://ethereum.stackexchange.com/questions/120787/testing-proxies-with-hardhat
      await CounterV1.connect(deployer).attach(BuggyProxy.address).increment()
      // Nto incremented
      expect(await CounterV1.count()).to.equal(0)
    })
  })
  describe('Good Proxy', function () {
    it('Should increment', async () => {
      const { GoodProxy, CounterV1, deployer } = await loadFixture(deployFixture)
      await GoodProxy.connect(deployer).upgradeTo(CounterV1.address)

      // https://ethereum.stackexchange.com/questions/120787/testing-proxies-with-hardhat
      await CounterV1.connect(deployer).attach(GoodProxy.address).increment()
      // incremented
      expect(await CounterV1.count()).to.equal(1)
    })
  })
})



