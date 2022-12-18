// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DevProposalNFT is ERC721Enumerable, Ownable {
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mint(address recipient) public onlyOwner returns (uint256) {
        uint256 tokenId = totalSupply();
        _mint(recipient, tokenId);
    }
}
