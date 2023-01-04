// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract CounterV1 {
  address public implementation;
  address public admin;
  uint public count;
  
  function increment() external{
    count += 1;
  }
}

contract CounterV2 {
  address public implementation;
  address public admin;
  uint public count;
  
  function increment() external {
    count += 1;
  }

  function decrement() external {
    count -= 1;
  }
}

contract GoodProxy {
  address public implementation;
  address public admin;

  constructor() {
    admin = msg.sender;
  }

  function _delegate(address _implementation) private {
    assembly {
      // Copy msg.data. We take full control of memory in this inline assembly
      // block because it will not return to Solidity code. We overwrite the
      // Solidity scratch pad at memory position 0.
      calldatacopy(0, 0, calldatasize())

      // Call the implementation.
      // out and outsize are 0 because we don't know the size yet.
      let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

      // Copy the returned data.
      returndatacopy(0, 0, returndatasize())

      switch result
      // delegatecall returns 0 on error.
      case 0 {
          revert(0, returndatasize())
      }
      default {
          return(0, returndatasize())
      }
    }
  }
  
  fallback() external payable {
    _delegate(implementation);
  }

  receive() external payable {
    _delegate(implementation);
  }

  function upgradeTo(address _implementation) external {
    require(msg.sender == admin, "not authorized");
    implementation = _implementation;
  }
}

contract BuggyProxy {
  address public implementation;
  address public admin;

  constructor() {
    admin = msg.sender;
  }

  function _delegate() private {
    (bool ok, bytes memory res) = implementation.delegatecall(msg.data);
    require(ok, "deletegatecall failed");
  }
  
  fallback() external payable {
    _delegate();
  }

  receive() external payable {}

  function upgradeTo(address _implementation) external {
    require(msg.sender == admin, "not authorized");
    implementation = _implementation;
  }
}
