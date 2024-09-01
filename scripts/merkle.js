import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";

// Path to your CSV file
const csvFilePath = "./data/data.csv";

// Function to parse CSV and return values
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Assuming the CSV columns are "address" and "amount"
        results.push([row.address, row.amount]);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Main function to read data from CSV, create Merkle tree, and save the tree
const main = async () => {
  try {
    const values = await parseCSV(csvFilePath);

    // Create the Merkle tree
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

    // Output the Merkle Root
    console.log('Merkle Root:', tree.root);

    // Save the Merkle tree to a JSON file
    fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the main function
main();
