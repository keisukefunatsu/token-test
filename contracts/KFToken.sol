//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TestToken is ERC20, ReentrancyGuard {
    uint256 public initialSupplyOfCommunity;
    address public communityAddress = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    constructor(uint256 initialSupply) ERC20("IIM Token", "IIM") {                
        _mint(msg.sender, initialSupply);
        initialSupplyOfCommunity = initialSupply * 1/5;
        transfer(communityAddress, initialSupplyOfCommunity);
    }
}
