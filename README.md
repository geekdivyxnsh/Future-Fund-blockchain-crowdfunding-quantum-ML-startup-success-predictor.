# 🚀 Web3 Crowdfunding Platform

A decentralized crowdfunding platform built with React, Solidity, and Web3 technologies.

## ✨ Features

- 🎯 **Create Campaigns**: Launch crowdfunding campaigns with custom goals and deadlines
- 💰 **Donate**: Support campaigns with cryptocurrency donations
- 📊 **Track Progress**: Monitor campaign funding progress in real-time
- 👤 **User Profiles**: Manage your campaigns and donation history
- 🔗 **Web3 Integration**: Built on Ethereum Sepolia testnet
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** - User interface framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **Thirdweb** - Web3 SDK for blockchain interactions

### Smart Contracts
- **Solidity** - Smart contract programming language
- **Hardhat** - Development environment
- **Ethereum Sepolia** - Testnet deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask wallet
- Sepolia testnet ETH
 - Thirdweb client ID for the frontend (`VITE_THIRDWEB_CLIENT_ID`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crowdfunding-platform.git
   cd crowdfunding-platform
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install smart contract dependencies
   cd ../web3
   npm install
   ```

3. **Start development server**
   ```bash
   cd client
   npm run dev
   ```

4. **Connect your wallet**
   - Install MetaMask browser extension
   - Switch to Sepolia testnet
   - Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

## 📋 Smart Contract

- **Contract Address**: `0x40b6de6eCB78ef8fFc599d5FA215596386339c29`
- **Network**: Ethereum Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x40b6de6eCB78ef8fFc599d5FA215596386339c29)

## 🔧 Development

### Smart Contract Deployment
```bash
cd web3
npx thirdweb deploy -k YOUR_SECRET_KEY
```

### Frontend Development
```bash
cd client
npm run dev
```

### Environment Variables (Frontend)

Create a `.env` file inside `client/` and set:

```bash
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

The contract address for the dApp is currently hardcoded in `client/src/context/index.jsx`. If you redeploy the contract, update the `CONTRACT_ADDRESS` constant there.

## 📁 Project Structure

```
project_crowdfunding/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for Web3
│   │   └── assets/        # Images and icons
│   └── package.json
├── web3/                  # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/          # Deployment scripts
│   └── hardhat.config.js
└── README.md
```

## 🌐 Deployment

### Vercel Deployment
This repository is a monorepo. The frontend lives in `client/`. To deploy the frontend on Vercel:

1. Push your code to GitHub.
2. In Vercel, create a new project and select this repository.
3. Set Root Directory to `client` in Vercel project settings.
4. Add the environment variable `VITE_THIRDWEB_CLIENT_ID` in the Vercel dashboard.
5. Keep the default build and output settings for Vite (`npm run build`, output: `dist`).
6. A `vercel.json` is included in `client/` to route SPA paths to `index.html`.

If you want to deploy the backend (FastAPI + Qiskit), use a separate host (Render, Railway, Fly.io, etc.) or a container platform using the provided `Dockerfile` and `docker-compose.yml`.

### Smart Contract Deployment
The smart contract is already deployed on Sepolia testnet. To deploy to mainnet or other networks, update the configuration in `web3/hardhat.config.js`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Thirdweb](https://thirdweb.com/) for Web3 SDK
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Crowdfunding! 🎉**
