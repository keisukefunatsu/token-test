// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Erc1155Sample is ERC1155, Ownable {
    uint public constant ZERO = 0;
    uint public constant FIRST = 1;
    uint public constant SECOND = 2;
    uint public constant THIRD = 3;

    mapping(uint256 => string) private _uris;

    constructor() public ERC1155("IPFS_ADDRESS") {
        _mint(msg.sender, ZERO, 100, "");
        _mint(msg.sender, FIRST, 100, "");
        _mint(msg.sender, SECOND, 100, "");
        _mint(msg.sender, THIRD, 100, "");
    }

    function mint(uint256 id, uint256 amount) public onlyOwner {
        _mint(msg.sender, id, amount, "");
    }

    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return _uris[_tokenId];
    }

    function setTokenUri(uint256 _tokenId, string memory uri) public onlyOwner {
        require(bytes(_uris[_tokenId]).length == 0, "Cannot set uri twice");
        _uris[_tokenId] = uri;
    }
}
