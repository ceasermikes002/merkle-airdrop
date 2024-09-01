# Merkle Airdrop Project

This project provides a mechanism for distributing ERC20 tokens using a Merkle Tree to validate claims. The core components include the `MerkleAirdrop` smart contract and a Node.js script to generate Merkle proofs.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup and Running the Script](#setup-and-running-the-script)
3. [Deploying the MerkleAirdrop Contract](#deploying-the-merkleairdrop-contract)
4. [Generating Proofs for Claiming the Airdrop](#generating-proofs-for-claiming-the-airdrop)
5. [Assumptions and Limitations](#assumptions-and-limitations)

## Project Overview

The `MerkleAirdrop` contract facilitates the distribution of ERC20 tokens to a list of eligible addresses. Token distribution is validated using Merkle proofs, which provide an efficient and verifiable way to prove inclusion in a list.

## Setup and Running the Script

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **Hardhat**: This project uses Hardhat for deploying smart contracts.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ceasermikes/merkle-airdrop.git
    cd merkle-airdrop
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

### Running the `merkle.js` Script

1. **Navigate to the script directory**:

    ```bash
    cd scripts
    ```

2. **Run the script**:

    ```bash
    node merkle.js
    ```

   This script generates the Merkle tree and outputs the Merkle root. Make sure to configure the script with the list of addresses and amounts you wish to include in the airdrop.

## Deploying the MerkleAirdrop Contract

### 1. Update Deployment Script

Ensure the deployment script located at `ignition/modules/Airdrop.ts` is configured with the correct ERC20 token address and Merkle root.

### 2. Deploy the Contract

1. **Deploy using Hardhat Ignition**:

    ```bash
    npx hardhat ignition deploy ./ignition/modules/Airdrop.ts --network lisk-sepolia
    ```

   This command deploys the `MerkleAirdrop` contract to the specified network. Confirm the deployment when prompted.

## Generating Proofs for Claiming the Airdrop

1. **Merkle Tree Generation**: Use the `merkle.js` script provided in the `scripts` directory to generate the Merkle tree and proofs. 

2. **Claiming Tokens**: Each user must call the `claim` function of the `MerkleAirdrop` contract, providing their Merkle proof and the amount they wish to claim. 

### Example Usage

1. **Generate Proofs**:

    Modify and run the `merkle.js` script to generate proofs for the addresses that will participate in the airdrop.

2. **Claim Tokens**:

    Users can interact with the contract using tools like Remix, Ethers.js, or web3.js. They need to provide:

    - `amount`: The amount of tokens they wish to claim.
    - `merkleProof`: The proof generated for their address.

## Assumptions and Limitations

### Assumptions

- **ERC20 Token**: The contract assumes that the ERC20 token is already deployed and the address is provided during deployment.
- **Merkle Root**: The Merkle root used for verification is static, so it must be updated if the list of eligible addresses changes.

### Limitations

- **Gas Costs**: Claiming tokens and updating the Merkle root can be expensive in terms of gas costs, particularly on networks with high gas fees.
- **Merkle Tree Size**: The size of the Merkle tree and the number of proofs can affect the performance and complexity of the airdrop.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For further assistance, please reach out via [email](mailto:michealceaser02@gmail.com) or open an issue in the repository.

