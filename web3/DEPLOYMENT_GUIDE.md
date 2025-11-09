# CrowdFunding Contract Deployment Guide

## Quick Deployment Steps

### 1. Deploy Using thirdweb (Recommended)

```bash
# Navigate to the web3 directory
cd web3

# Deploy the contract with secret key
npx thirdweb deploy -k 19C7dDli1K2M1AcwgWc9TeFV2yjyBFCSXDkAI5pkbOFC6DgNuufTClXZrtyJh_b4oduQl69T0LAFQvwJlE5k7Q
```

This will:

- Deploy the contract to Sepolia testnet
- Provide you with a contract address
- Show deployment details in the terminal

### 2. Update Frontend

After deployment, update the contract address in `client/src/context/index.jsx`:

```javascript
const CONTRACT_ADDRESS = "0xYourNewContractAddress"; // Replace with your deployed address
```

### 3. Alternative: Manual Deployment

If thirdweb deployment doesn't work, you can deploy manually:

1. **Set up environment variables** in `web3/.env`:

   ```
   SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
   PRIVATE_KEY=your_wallet_private_key
   ```

2. **Deploy using Hardhat**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### 4. Get Sepolia ETH

Make sure you have Sepolia testnet ETH for deployment:

- Get testnet ETH from: https://sepoliafaucet.com/
- Or use: https://faucets.chain.link/sepolia

## Current Status

✅ App is running without console errors
✅ Error handling is implemented
⏳ Contract deployment needed
⏳ Contract address update needed

## Next Steps

1. Deploy the contract using one of the methods above
2. Update the contract address in the frontend
3. Test the app functionality
4. Connect your wallet to interact with the contract
