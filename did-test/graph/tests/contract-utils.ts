import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ContractApproval,
  ContractTransfer
} from "../generated/Contract/Contract"

export function createContractApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): ContractApproval {
  let contractApprovalEvent = changetype<ContractApproval>(newMockEvent())

  contractApprovalEvent.parameters = new Array()

  contractApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  contractApprovalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  contractApprovalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return contractApprovalEvent
}

export function createContractTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): ContractTransfer {
  let contractTransferEvent = changetype<ContractTransfer>(newMockEvent())

  contractTransferEvent.parameters = new Array()

  contractTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  contractTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  contractTransferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return contractTransferEvent
}
