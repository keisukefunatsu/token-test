// // SPDX-License-Identifier: SEE LICENSE IN LICENSE
// pragma solidity ^0.8;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "./ICompound.sol";

// contract TestCompoundErc20 {
//     IERC20 public token;
//     CErc20 public cToken;

//     constructor(address _token, address _cToken) {
//         token = IERC20(token);
//         cToken = CErc20(cToken);
//     }

//     function supply(uint _amount) external {
//         token.transferfFrom(msg.sender, address(this), _amount);
//         token.approve(address(cToken), _amount);
//         require(cToken.mint(_amount) == 0, "mint failed");
//     }

//     function getTokenBalance() external view returns (uint) {}
// }
