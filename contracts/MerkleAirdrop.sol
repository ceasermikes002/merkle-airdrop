// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MerkleAirdrop is Ownable {
    bytes32 public merkleRoot;  // The Merkle root of the addresses eligible for the airdrop
    IERC20 public token;  // The ERC20 token that will be distributed in the airdrop
    mapping(address => bool) public claimed;  // Keeps track of whether an address has already claimed the airdrop

    // Event that is emitted when an address successfully claims their tokens
    event Claimed(address indexed account, uint256 amount);

    // Constructor that initializes the contract with the token address and Merkle root
    constructor(address _token, bytes32 _merkleRoot) Ownable(msg.sender) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    // Function that allows an address to claim their tokens using a Merkle proof
    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
        require(!claimed[msg.sender], "Airdrop already claimed.");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof.");

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Token transfer failed.");

        emit Claimed(msg.sender, amount);
    }

    // Function that allows the owner to update the Merkle root if necessary
    function updateMerkleRoot(bytes32 newMerkleRoot) external onlyOwner {
        merkleRoot = newMerkleRoot;
    }

    // Function that allows the owner to withdraw remaining tokens after the airdrop is over
    function withdrawTokens(address recipient) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(recipient, balance), "Token transfer failed.");
    }
}
// Airdrop contract address:0xaE729E16dc70d9931e5587e2A7c4Ec23B13697B5