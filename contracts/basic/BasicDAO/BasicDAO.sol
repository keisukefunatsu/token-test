// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ITestMarketPlace {
    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);

    function purchase(uint _tokenId) external payable;
}

interface IDevProposalNFT {
    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint index
    ) external view returns (uint256);
}

contract DevsDAO is Ownable {
    ITestMarketPlace testMarketPlace;
    IDevProposalNFT devProposalNFT;

    struct Proposal {
        uint256 nftTokenId;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(uint256 => bool) voters;
    }
    enum Vote {
        Yes,
        No
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public numProposals;

    modifier nftHolderOnly() {
        require(devProposalNFT.balanceOf(msg.sender) > 0, "Not_A_DAO_Member");
        _;
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );

        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    constructor(address _testMarketPlace, address _devProposalNFT) {
        testMarketPlace = ITestMarketPlace(_testMarketPlace);
        devProposalNFT = IDevProposalNFT(_devProposalNFT);
    }

    fallback() external payable {}

    function getProposal(uint proposalIndex) external view returns (uint256) {
        Proposal storage proposal = proposals[numProposals];
        return proposal.nftTokenId;
    }

    function createProposal(
        uint _nftTokenId
    ) external nftHolderOnly returns (uint256) {
        require(testMarketPlace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        proposal.deadline = block.timestamp + 5 minutes;
        numProposals++;
        return numProposals - 1;
    }

    function voteOnProposal(
        uint256 proposalIndex,
        Vote vote
    ) external nftHolderOnly activeProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        uint256 voterNFTBalance = devProposalNFT.balanceOf(msg.sender);
        uint256 numVotes = 0;

        for (uint256 i = 0; i < voterNFTBalance; i++) {
            uint256 tokenId = devProposalNFT.tokenOfOwnerByIndex(msg.sender, i);
            if (proposal.voters[tokenId] == false) {
                numVotes++;
                proposal.voters[tokenId] = true;
            }
        }

        require(numVotes > 0, "ALREADY_VOTED");
        if (vote == Vote.Yes) {
            proposal.yesVotes += numVotes;
        } else {
            proposal.noVotes += numVotes;
        }
    }

    function executeProposal(
        uint256 proposalIndex
    ) external nftHolderOnly inactiveProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];

        if (proposal.yesVotes > proposal.noVotes) {
            uint256 nftPrice = testMarketPlace.getPrice();
            require(address(this).balance >= nftPrice, "NOT_ENOUGH_FUNDS");
            testMarketPlace.purchase{value: nftPrice}(proposal.nftTokenId);
        }
        proposal.executed = true;
    }

    function withdrawalEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
