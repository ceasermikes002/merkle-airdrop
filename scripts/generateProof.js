import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

// (1)
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")));

// (2)
for (const [i, v] of tree.entries()) {
  if (v[0] === '0xdBc19e414E53A96ca3770FD3F0bdF97526e681e7') {
    // (3)
    const proof = tree.getProof(i);
    console.log('Value:', v);
    console.log('Proof:', proof);
  }
}