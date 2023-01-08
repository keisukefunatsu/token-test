// SPDX-License-Identifier: MIT
// https://blog.chain.link/smart-contract-call-another-smart-contract/

pragma solidity 0.8.17;

contract Counter {
    uint public number;
    function increment() external {
        number += 1;
    }
    function currentNumber() public view returns (uint) {
      return number;
    }
}


contract CounterCaller {
    Counter public myCounter;
    constructor(address counterAddress) {
        myCounter = Counter(counterAddress);
    }
    function counterIncrement() external {
        myCounter.increment();
    }
}
