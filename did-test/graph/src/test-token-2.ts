import {
  TestToken2Approval as TestToken2ApprovalEvent,
  TestToken2Transfer as TestToken2TransferEvent
} from "../generated/TestToken2/TestToken2"
import { TestToken2Approval, TestToken2Transfer } from "../generated/schema"

export function handleTestToken2Approval(event: TestToken2ApprovalEvent): void {
  let entity = new TestToken2Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTestToken2Transfer(event: TestToken2TransferEvent): void {
  let entity = new TestToken2Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
