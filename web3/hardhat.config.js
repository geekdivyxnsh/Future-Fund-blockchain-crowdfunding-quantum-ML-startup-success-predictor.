require("dotenv").config();
//require("@nomiclabs/hardhat-ethers"); // Required for ethers.js
require("@matterlabs/hardhat-zksync-deploy"); // zkSync deploy plugin
require("@matterlabs/hardhat-zksync-verify"); // zkSync verify plugin

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.ankr.com/eth_sepolia",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    zkSyncSepoliaTestnet: {
      url: process.env.ZKSYNC_SEPOLIA_RPC || "https://testnet.era.zksync.dev",
      ethNetwork: "sepolia", // Ethereum network for deposits
      zksync: true,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // For contract verification on Etherscan if needed
  },
};
