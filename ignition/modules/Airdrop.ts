const { buildModule: buildMerkleAirdropModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MerkleAirdropModule = buildMerkleAirdropModule("MerkleAirdropModule", (m: any) => {
  // Address of my deployed ERC20 token
  const tokenAddress = ("0x4B549c27cB853412a6474BA85352b5c777D0A228");

  //Merkle root
  const merkleRoot = ("0xee8f9c9c2aaeafe5078b130375292aa81a4d4d5953ad0a9173e73178e6266e8e");

  const merkleAirdrop = m.contract("MerkleAirdrop", [tokenAddress, merkleRoot]);

  return { merkleAirdrop };
});

module.exports = MerkleAirdropModule;
