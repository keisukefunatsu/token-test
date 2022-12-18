// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract TestMarketPlace {
  mapping(uint256 => address) public tokens;

  uint256 nftPrice = 0.1 ether;

  function purchase(uint256 _tokenId) external payable {
    require(msg.value == nftPrice, "This NFT costs 0.1 ether");
    tokens[_tokenId] = msg.sender;
  }

  function available(uint256 _tokenId) external view returns (bool) {
    if (tokens[_tokenId] == address(0)) {
      return true;
    } 
    return false;
  }

  function getPrice() external view returns (uint256) {
    return nftPrice;
  }
}

