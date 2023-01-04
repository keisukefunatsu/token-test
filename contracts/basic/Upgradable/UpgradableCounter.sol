// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract CounterV1 {
    uint public count;

    function increment() external {
        count += 1;
    }
}

contract CounterV2 {
    uint public count;

    function increment() external {
        count += 1;
    }

    function decrement() external {
        count -= 1;
    }
}

contract Proxy {
    bytes32 private constant IMPLEMENTATION_SLOT =
        bytes32(uint(keccak256("eip1967.proxy.implementation")) - 1);
    bytes32 private constant ADMIN_SLOT =
        bytes32(uint(keccak256("eip1967.proxy.admin")) - 1);

    constructor() {
        _setAdmin(msg.sender);
    }

    function _delegate(address _implementation) private {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(
                gas(),
                _implementation,
                0,
                calldatasize(),
                0,
                0
            )

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function _fallback() private {
        _delegate(_getImplementation());
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }

    modifier adminOnly() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }

    function changeAdmin(address _admin) external adminOnly {
        _setAdmin(_admin);
    }

    function upgradeTo(address _implementation) external adminOnly {
        _setImplementation(_implementation);
    }

    function _getAdmin() private view returns (address) {
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    function _setAdmin(address _admin) private {
        require(_admin != address(0), "zero addess");
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = _admin;
    }

    function _getImplementation() private view returns (address) {
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address _implementation) private {
        require(_implementation.code.length > 0, "not a contract");
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = _implementation;
    }

    function admin() external adminOnly returns (address) {
        return _getAdmin();
    }

    function implementation() external adminOnly returns (address) {
        return _getImplementation();
    }
}

contract ProxyAdmin {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authrized");
        _;
    }

    function getProxyAdmin(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(
            abi.encodeCall(Proxy.admin, ())
        );
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    function getProxyImplementation(
        address proxy
    ) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(
            abi.encodeCall(Proxy.implementation, ())
        );
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    function changeProxyAdmin(
        address payable proxy,
        address _admin
    ) external onlyOwner {
        Proxy(proxy).changeAdmin(_admin);
    }

    function upgrade(
        address payable proxy,
        address implementation
    ) external onlyOwner {
        Proxy(proxy).upgradeTo(implementation);
    }
}

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(
        bytes32 slot
    ) internal view returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }
}

contract TestSlot {
    bytes32 public constant SLOT = keccak256("TEST SLOT");

    function getSlot() external view returns (address) {
        return StorageSlot.getAddressSlot(SLOT).value;
    }

    function writeSlot(address _addr) external {
        StorageSlot.getAddressSlot(SLOT).value = _addr;
    }

    constructor() {}
}

// contract BuggyProxy {
//     address public implementation;
//     address public admin;

//     constructor() {
//         admin = msg.sender;
//     }

//     function _delegate() private {
//         (bool ok, bytes memory res) = implementation.delegatecall(msg.data);
//         require(ok, "deletegatecall failed");
//     }

//     fallback() external payable {
//         _delegate();
//     }

//     receive() external payable {}

//     function upgradeTo(address _implementation) external {
//         require(msg.sender == admin, "not authorized");
//         implementation = _implementation;
//     }
// }
