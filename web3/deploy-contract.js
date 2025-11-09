const { execSync } = require("child_process");
const fs = require("fs");

console.log("🚀 Starting thirdweb deployment...");

try {
  // Run thirdweb deployment
  const result = execSync(
    "npx thirdweb@latest deploy -k 19C7dDli1K2M1AcwgWc9TeFV2yjyBFCSXDkAI5pkbOFC6DgNuufTClXZrtyJh_b4oduQl69T0LAFQvwJlE5k7Q --yes",
    {
      stdio: "pipe",
      encoding: "utf8",
    }
  );

  console.log("✅ Deployment result:", result);

  // Try to extract contract address from the output
  const addressMatch = result.match(/0x[a-fA-F0-9]{40}/);
  if (addressMatch) {
    const contractAddress = addressMatch[0];
    console.log("📋 Contract deployed at:", contractAddress);

    // Save deployment info
    const deploymentInfo = {
      contractAddress: contractAddress,
      network: "thirdweb",
      timestamp: new Date().toISOString(),
      deployer: "thirdweb",
    };

    fs.writeFileSync(
      "./deployment-info.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("💾 Deployment info saved");
  }
} catch (error) {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
}
