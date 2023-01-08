// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicTicketNFT is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _ticketIds;
  address public owner;

  struct Seller {
    string itemName;
    uint ticketId;
  }
  
  struct Ticket {
    string name;
    uint price;
    bool isOwned;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  mapping (uint => Ticket) tickets;

  constructor(string memory _name, string memory _symbol)  ERC721(_name, _symbol) {
    owner = msg.sender;
  }

  function mint(uint _sellerId) public payable {
    require(msg.value == 0.01 ether, 'Not exactly ETH sent');
    _safeMint(msg.sender, _sellerId);
  }
}
