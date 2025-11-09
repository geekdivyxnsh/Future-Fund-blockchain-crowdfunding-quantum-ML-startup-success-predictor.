#!/usr/bin/env node

const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting manual deployment...");

  try {
    // Get the contract factory
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    console.log("📋 Contract factory loaded");

    // Deploy the contract
    console.log("🔄 Deploying contract...");
    const crowdFunding = await CrowdFunding.deploy();

    // Wait for deployment
    console.log("⏳ Waiting for deployment...");
    await crowdFunding.waitForDeployment();

    const contractAddress = await crowdFunding.getAddress();

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🌐 Network:", "Sepolia Testnet");

    // Save deployment info
    const fs = require("fs");
    const deploymentInfo = {
      contractAddress: contractAddress,
      network: "sepolia",
      timestamp: new Date().toISOString(),
      deployer: await crowdFunding.runner.getAddress(),
    };

    fs.writeFileSync(
      "./deployment-info.json",
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("💾 Deployment info saved to deployment-info.json");
    console.log("\n📋 Next Steps:");
    console.log(
      "1. Update the contract address in client/src/context/index.jsx"
    );
    console.log("2. Replace CONTRACT_ADDRESS with:", contractAddress);
    console.log("3. Restart your development server");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure you have Sepolia ETH in your wallet");
    console.log(
      "2. Check your .env file has correct PRIVATE_KEY and SEPOLIA_RPC_URL"
    );
    console.log(
      "3. Try running: npx hardhat run scripts/deploy.js --network sepolia"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
