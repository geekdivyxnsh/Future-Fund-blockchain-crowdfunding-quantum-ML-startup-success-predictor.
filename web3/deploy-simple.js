const { spawn } = require("child_process");

console.log("🚀 Starting thirdweb deployment...");

// Run thirdweb deployment with the secret key
const deployProcess = spawn(
  "npx",
  [
    "thirdweb@latest",
    "deploy",
    "-k",
    "19C7dDli1K2M1AcwgWc9TeFV2yjyBFCSXDkAI5pkbOFC6DgNuufTClXZrtyJh_b4oduQl69T0LAFQvwJlE5k7Q",
  ],
  {
    stdio: "inherit", // This will show the output in real-time
    shell: true,
  }
);

deployProcess.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Deployment completed successfully!");
    console.log(
      "📋 Please copy the contract address and update it in client/src/context/index.jsx"
    );
  } else {
    console.log(`❌ Deployment failed with code ${code}`);
  }
});

deployProcess.on("error", (err) => {
  console.error("❌ Failed to start deployment:", err);
});
