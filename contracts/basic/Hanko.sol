pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Hanko is ERC721Enumerable, Ownable {
    struct TokenURIData {
        string hankoTime;
    }

    mapping(uint256 => TokenURIData) public tokenURIDatas;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     *
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) external onlyOwner {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _burn(tokenId);
    }

    function listNFT() external view returns (uint256[] memory, string[] memory ) {
        uint256[] memory ids = new uint256[](totalSupply());
        string[] memory TokenURIDataArr = new string[](totalSupply());
        for (uint256 i=0; i < totalSupply(); i++) {
            ids[i] = i;
            TokenURIDataArr[i] = tokenURIDatas[i].hankoTime;
        }
        return (ids, TokenURIDataArr);
    }

    fallback() external payable{
    }
    
    receive() external payable{
    }

    /**
     * @dev Mint NFT to input address.
     * @param to is mint address.
     */
    function mint(address to, string memory hankoTime) external onlyOwner {        
        _mint(to, totalSupply());
        tokenURIDatas[totalSupply()] = TokenURIData(hankoTime);
    }

    /**
     * @dev ERC20s should not be sent to this contract, but if someone does, it's nice to be able to recover them.
     *      Copied from ForgottenRunesWarriorsGuild. Thank you dotta ;)
     * @param token IERC20 the token address
     * @param amount uint256 the amount to send
     */
    function forwardERC20s(IERC20 token, uint256 amount) public onlyOwner {
        token.transfer(msg.sender, amount);
    }

    /**
     * @dev return hankoTime of tokenId.
     * @param _tokenId is tokenId.
     */
    function getHankoTime(uint256 _tokenId) external view returns (string memory) {
        return tokenURIDatas[_tokenId].hankoTime;
    }
}
