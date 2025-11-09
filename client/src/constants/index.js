import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'marketplace',
    imgUrl: payment,
    link: '/marketplace',
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];

// QuantumCrowd contract address - replace with actual deployed address
export const contractAddress = "0x0000000000000000000000000000000000000000";

// ABI for the QuantumCrowd contract
export const contractABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "bytes32", "name": "hash", "type": "bytes32"},
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "string", "name": "version", "type": "string"},
      {"internalType": "bytes", "name": "sig", "type": "bytes"}
    ],
    "name": "submitPrediction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Available sectors for filtering
export const sectors = [
  "All Sectors",
  "CleanTech",
  "Healthcare",
  "Education",
  "Finance",
  "AI",
  "Blockchain",
  "IoT",
  "Agriculture",
  "Retail"
];
