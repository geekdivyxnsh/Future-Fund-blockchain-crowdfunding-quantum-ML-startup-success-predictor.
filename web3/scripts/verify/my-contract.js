const hre = require("hardhat");

// To run this script:
// npx hardhat run scripts/verify/my-contract.js --network zkSyncSepoliaTestnet

async function main() {
  // ✅ Deployed contract address
  const contractAddress = "0xE7C9B0B87FF553823ae6efa459452ebbf4f2b8e6";

  // ✅ Constructor arguments (empty for your contract)
  const constructorArgs = [];

  console.log("Verifying contract...");

  await verify(
    contractAddress,
    "contracts/CrowdFunding.sol:CrowdFunding",
    constructorArgs
  );
}

async function verify(address, contract, args) {
  try {
    await hre.run("verify:verify", {
      address: address,
      contract: contract,
      constructorArguments: args,
    });
    console.log("✅ Verification successful!");
  } catch (e) {
    console.error("❌ Verification failed:", e);
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
