
# 🚀 Future Fund — Quantum ML + Blockchain Crowdfunding Platform

**Future Fund** is a decentralized crowdfunding platform built on **Ethereum (Sepolia)**, enhanced with **Quantum Machine Learning–driven predictions**.
It combines blockchain transparency with AI foresight — allowing users to **launch campaigns, invest securely, and explore predictive insights** through an interactive marketplace.

---

## 🌟 Key Highlights

* 🪙 **On-Chain Campaigns:** Create, manage, and track decentralized crowdfunding campaigns.
* 💸 **Invest with MetaMask:** Donate or invest using your Ethereum wallet in real time.
* 📈 **Prediction Marketplace:** Explore campaigns enriched with Quantum ML–based success scores and visual insights.
* 📊 **Dynamic Analytics:** Prediction panel includes profit projections (low/avg/high), line charts, doughnut charts, and candlestick views.
* 🧠 **Domain Visuals:** Category icons (eco, health, edu, finance, etc.) personalize campaign cards.
* 💡 **UI Design:** “Grow Your Money” theme using Tailwind CSS for a clean, modern aesthetic.

---

## 🧰 Tech Stack

**Frontend:** `React`, `Vite`, `Tailwind CSS`, `Chart.js`, `thirdweb`
**Smart Contracts:** `Solidity`, `Hardhat`, `thirdweb CLI`
**Optional Backend:** `FastAPI`, `Python 3.9`, `Qiskit` for Quantum ML predictions

---

### 🖼️ UI Preview

<img width="1664" height="822" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/e7d35141-847b-4d4d-aa42-513f46b1aa86" />

<img width="680" height="874" alt="Campaign Details Screenshot" src="https://github.com/user-attachments/assets/c372a692-8812-4430-b300-fe2d2e33ef20" />

---

## 📂 Project Structure

```
CrowdFunding-Platform/
├─ client/                 # Frontend (deploy on Vercel)
│  ├─ src/
│  │  ├─ components/       # Reusable UI components
│  │  ├─ pages/            # Core pages (Home, Marketplace, etc.)
│  │  ├─ context/          # Thirdweb/Ethers provider logic
│  │  ├─ assets/           # Logos & icons
│  │  └─ main.jsx          # Root file with provider setup
│  ├─ vercel.json          # SPA rewrites
│  └─ package.json
├─ web3/                   # Smart contracts
│  ├─ contracts/           # Solidity source
│  └─ scripts/             # Deployment & verification
├─ backend/                # (Optional) FastAPI + Qiskit ML service
└─ README.md
```

---

## ⚙️ Installation Guide

### 🔽 Download Options

**Option 1: ZIP**

1. Visit the GitHub repository.
2. Click **Code → Download ZIP**
3. Extract and open the folder in your IDE.

**Option 2: Clone with Git**

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

---

### 🧩 Prerequisites

* Node.js `>=16`
* MetaMask (browser extension)
* Sepolia testnet ETH
* Thirdweb Client ID
* (Optional) Python 3.9 for backend/QML service

---

### 🖥️ Frontend Setup

```bash
cd client
npm install

# Add your Thirdweb Client ID
echo VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id > .env

npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and connect your wallet.

---

### 💎 Smart Contract Deployment (Sepolia)

```bash
cd web3
npm install
```

Create `.env` inside `web3/`:

```
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
ETHERSCAN_API_KEY=optional
```

Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Then update `CONTRACT_ADDRESS` inside
`client/src/context/index.jsx` → restart `npm run dev`.

> 🔒 **Tip:** Never commit secrets. Store keys in `.env` or CI/CD configs.

---

### 🧠 Optional Backend (Quantum ML)

Run a FastAPI + Qiskit backend for real QML predictions.

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Frontend connects via `VITE_API_URL`.
In Docker Compose, this is configured automatically.

---

## 🪄 Usage Guide

1. **Connect** MetaMask to Sepolia.
2. **Create Campaign:** Set title, goal, deadline, and image.
3. **Explore Marketplace:** Browse campaigns with prediction insights.
4. **View Prediction Panel:** Analyze projected profits and trend charts.
5. **Invest or Donate:** Fund campaigns and monitor progress live.
6. **Profile Page:** Track all campaigns and donations.

---

## 🔐 Environment Variables (Frontend)

| Variable                  | Description                         |
| ------------------------- | ----------------------------------- |
| `VITE_THIRDWEB_CLIENT_ID` | Thirdweb Client ID (safe to expose) |

---

## 🚀 Deploy to Vercel

Deploy only the `client` directory.

**Vercel Settings**

* Root Directory → `client`
* Framework Preset → `Vite`
* Build Command → `npm run build`
* Output Directory → `dist`
* Add Env Var → `VITE_THIRDWEB_CLIENT_ID`

> Backend can be deployed separately on **Render**, **Railway**, or a **Docker VM**.

---

## 🐳 Docker (Optional)

Launch frontend + backend together:

```bash
docker-compose up --build
```

Runs:

* Frontend → `http://localhost:5173`
* Backend → `http://localhost:8000`

---

## 🧩 Troubleshooting

| Issue               | Fix                                      |
| ------------------- | ---------------------------------------- |
| `clientId required` | Check `.env` + Vercel env vars           |
| Chain mismatch      | Switch MetaMask to Sepolia               |
| CORS errors         | Enable frontend origin in backend config |
| Fonts ORB warning   | Safe to ignore                           |

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/<name>`
3. Commit: `git commit -m "feat: <change>"`
4. Push: `git push origin feature/<name>`
5. Open a PR 🎉

---

## 🙏 Acknowledgments

* [Thirdweb](https://thirdweb.com/) — Web3 SDK & infra
* [Tailwind CSS](https://tailwindcss.com/) — Styling
* [Vite](https://vitejs.dev/) — Build tool
* [Chart.js](https://www.chartjs.org/) — Data visualization

---

## 👨‍💻 Developer

**Divyanshu Kumar**
📧 [geekdivyxnsh@gmail.com](mailto:geekdivyxnsh@gmail.com)
💼 [LinkedIn](https://linkedin.com/in/k-divyanshu)
💻 [GitHub](https://github.com/geekdivyxnsh)

---

## 📄 License & Usage

This project is open for **educational and portfolio use**.
For collaboration or commercial licensing, contact the developer directly.

⭐ **Star this repo** if you find it inspiring!
live demo: https://future-fund-blockchain-crowdfunding.vercel.app/
**Happy Building, Happy Investing! 🚀**

