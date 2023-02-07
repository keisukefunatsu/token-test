// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EthernautDelegate {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function pwn() public {
        // console.log("pwn called!");
        // console.log(owner);
        owner = msg.sender;
        // console.log(owner);
    }
}

contract EthernautDelegation {
    address public owner;
    EthernautDelegate delegate;

    constructor(address _delegateAddress) {
        delegate = EthernautDelegate(_delegateAddress);
        owner = msg.sender;
    }

    fallback() external {
        // console.log("fallback in EthernautDelegation called!");
        (bool result, ) = address(delegate).delegatecall(msg.data);
        if (result) {
            this;
        }
    }
}
