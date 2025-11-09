const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CrowdFunding contract...");

  // Get the contract factory
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");

  // Deploy the contract
  const crowdFunding = await CrowdFunding.deploy();

  // Wait for deployment to complete
  await crowdFunding.waitForDeployment();

  const contractAddress = await crowdFunding.getAddress();

  console.log("✅ CrowdFunding deployed to:", contractAddress);
  console.log("🔗 Contract address:", contractAddress);
  console.log(
    "📋 Update your frontend with this address in src/context/index.jsx"
  );

  // Save the deployment info
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
