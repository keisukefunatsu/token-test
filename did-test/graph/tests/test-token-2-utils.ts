import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  TestToken2Approval,
  TestToken2Transfer
} from "../generated/TestToken2/TestToken2"

export function createTestToken2ApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): TestToken2Approval {
  let testToken2ApprovalEvent = changetype<TestToken2Approval>(newMockEvent())

  testToken2ApprovalEvent.parameters = new Array()

  testToken2ApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  testToken2ApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  testToken2ApprovalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return testToken2ApprovalEvent
}

export function createTestToken2TransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): TestToken2Transfer {
  let testToken2TransferEvent = changetype<TestToken2Transfer>(newMockEvent())

  testToken2TransferEvent.parameters = new Array()

  testToken2TransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  testToken2TransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  testToken2TransferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return testToken2TransferEvent
}
