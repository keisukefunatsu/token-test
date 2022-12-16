import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

describe("Deploy", function () {
  const deployFixture = async () => {
    const CounterFactory = await ethers.getContractFactory('Counter')
    const Counter = await CounterFactory.deploy()
    await Counter.deployed()
    const CounterCallerFactory = await ethers.getContractFactory('CounterCaller')
    const CounterCaller = await CounterCallerFactory.deploy(Counter.address)
    await CounterCaller.deployed()
    return { Counter, CounterCaller }
  }
  describe("Call another contract", function () {
    it("Should increment", async () => {
      const { Counter, CounterCaller } = await loadFixture(deployFixture)
      await CounterCaller.counterIncrement()
      await CounterCaller.counterIncrement()
      await CounterCaller.counterIncrement()
      const res = await Counter.currentNumber()
      expect(res).to.equals(BigNumber.from(3))
    })
  })
})



