import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("MerkleAirdrop", function () {
    let Token: any, token: any, MerkleAirdrop: any, merkleAirdrop: any;
    let owner: any, addr1: any, addr2: any, addr3: any, addrs: any;
    let merkleTree: MerkleTree;  // Move merkleTree to a higher scope

    beforeEach(async function () {
        // Deploy an ERC20 token for testing
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        Token = await ethers.getContractFactory("ERC20Token");
        token = await Token.deploy("TestToken", "TTK", ethers.parseEther("10000"));
        await token.deployed();

        // Create a Merkle Tree
        const airdropAddresses = [
            { address: addr1.address, amount: ethers.parseEther("100") },
            { address: addr2.address, amount: ethers.parseEther("200") },
        ];

        const leaves = airdropAddresses.map((x) =>
            keccak256(ethers.solidityPacked(["address", "uint256"], [x.address, x.amount]))
        );
        merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });  // Initialize merkleTree
        const merkleRoot = merkleTree.getHexRoot();

        // Deploy the MerkleAirdrop contract
        MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
        merkleAirdrop = await MerkleAirdrop.deploy(token.address, merkleRoot);
        await merkleAirdrop.deployed();

        // Transfer some tokens to the airdrop contract
        await token.transfer(merkleAirdrop.address, ethers.parseEther("300"));
    });

    it("should allow a valid claim", async function () {
        const amount = ethers.parseEther("100");
        const leaf = keccak256(ethers.solidityPacked(["address", "uint256"], [addr1.address, amount]));
        const proof = merkleTree.getHexProof(leaf);  // Use the instance method

        await expect(merkleAirdrop.connect(addr1).claim(amount, proof))
            .to.emit(merkleAirdrop, "Claimed")
            .withArgs(addr1.address, amount);

        expect(await token.balanceOf(addr1.address)).to.equal(amount);
        expect(await merkleAirdrop.claimed(addr1.address)).to.be.true;
    });

    it("should reject an invalid claim", async function () {
        const amount = ethers.parseEther("150"); // Wrong amount
        const leaf = keccak256(ethers.solidityPacked(["address", "uint256"], [addr1.address, amount]));
        const proof = merkleTree.getHexProof(leaf);  // Use the instance method

        await expect(merkleAirdrop.connect(addr1).claim(amount, proof)).to.be.revertedWith("Invalid proof.");
        expect(await token.balanceOf(addr1.address)).to.equal(0);
    });

    it("should prevent double claims", async function () {
        const amount = ethers.parseEther("100");
        const leaf = keccak256(ethers.solidityPacked(["address", "uint256"], [addr1.address, amount]));
        const proof = merkleTree.getHexProof(leaf);  // Use the instance method

        await merkleAirdrop.connect(addr1).claim(amount, proof);
        await expect(merkleAirdrop.connect(addr1).claim(amount, proof)).to.be.revertedWith("Airdrop already claimed.");
    });

    it("should allow the owner to update the Merkle root", async function () {
        const newMerkleRoot = ethers.keccak256("new root");

        await merkleAirdrop.updateMerkleRoot(newMerkleRoot);
        expect(await merkleAirdrop.merkleRoot()).to.equal(newMerkleRoot);
    });

    it("should allow the owner to withdraw remaining tokens", async function () {
        const initialBalance = await token.balanceOf(owner.address);

        await merkleAirdrop.withdrawTokens(owner.address);

        const finalBalance = await token.balanceOf(owner.address);
        expect(finalBalance).to.equal(initialBalance.add(ethers.parseEther("300")));
    });
});
