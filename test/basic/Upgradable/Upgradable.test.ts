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
    const ProxyAdminFactory = await ethers.getContractFactory('ProxyAdmin')
    const ProxyAdmin = await ProxyAdminFactory.connect(deployer).deploy()
    await ProxyAdmin.deployed()
    const TestSlotFactory = await ethers.getContractFactory('TestSlot')
    const TestSlot = await TestSlotFactory.connect(deployer).deploy()
    await TestSlot.deployed()
    const CounterV1Factory = await ethers.getContractFactory('CounterV1')
    const CounterV1 = await CounterV1Factory.connect(deployer).deploy()
    await CounterV1.deployed()
    const CounterV2Factory = await ethers.getContractFactory('CounterV2')
    const CounterV2 = await CounterV2Factory.connect(deployer).deploy()
    await CounterV2.deployed()
    return { Proxy, ProxyAdmin, TestSlot, CounterV1, CounterV2, deployer, signers }
  }

  describe('Slot Library', function () {
    it('should write slot', async () => {
      const { Proxy, TestSlot, deployer } = await loadFixture(deployFixture)
      expect(await TestSlot.connect(deployer).getSlot()).to.equal(ethers.constants.AddressZero)
      await TestSlot.connect(deployer).writeSlot(deployer.address)
      expect(await TestSlot.connect(deployer).getSlot()).to.equal(deployer.address)
    })
  })
  describe('Proxy', function () {
    it('Should increment', async () => {
      const { Proxy, CounterV1, CounterV2, deployer } = await loadFixture(deployFixture)
      await Proxy.connect(deployer).upgradeTo(CounterV1.address)
      // modifierをつけつつstateを変更しないようなものはcallStaticを使う
      expect(await Proxy.connect(deployer).callStatic.implementation()).to.equal(CounterV1.address)

      // https://ethereum.stackexchange.com/questions/120787/testing-proxies-with-hardhat
      let proxied = CounterV1.attach(Proxy.address)
      await proxied.increment()
      // incremented
      expect(await proxied.connect(deployer).count()).to.equal(1)

      // CounterV2へのアップグレード
      await Proxy.connect(deployer).upgradeTo(CounterV2.address)
      proxied = CounterV2.attach(Proxy.address)
      await proxied.connect(deployer).increment()
      expect(await proxied.connect(deployer).count()).to.equal(11)
      // proxy先のcontractのcountは0のまま
      expect(await CounterV1.connect(deployer).count()).to.equal(0)
    })
  })
  describe('ProxyAdmin', function () {
    it('Change Proxy contract admin', async () => {
      const { Proxy, ProxyAdmin, CounterV1, deployer, signers } = await loadFixture(deployFixture)
      await Proxy.connect(deployer).upgradeTo(CounterV1.address)
      // ProxyAdmin contractをProxy contractのadminにする
      await Proxy.connect(deployer).changeAdmin(ProxyAdmin.address)
      expect(await ProxyAdmin.connect(deployer).getProxyAdmin(Proxy.address)).to.equal(ProxyAdmin.address)
      expect(await ProxyAdmin.connect(deployer).getProxyImplementation(Proxy.address)).to.equal(CounterV1.address)
      ProxyAdmin.connect(deployer).changeProxyAdmin(Proxy.address, signers[0].address)
      // 変更前のadminだと失敗する
      await expect(Proxy.connect(deployer).callStatic.implementation()).to.be.reverted
      // 変更後のadminだと成功する
      expect(await Proxy.connect(signers[0]).callStatic.implementation()).to.equal(CounterV1.address)


      let proxied = CounterV1.attach(Proxy.address)
      await proxied.connect(deployer).increment()
      // incremented
      expect(await proxied.connect(deployer).count()).to.equal(1)
    })

  })
})



