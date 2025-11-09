import { Buffer } from "buffer";
window.Buffer = Buffer;  // ✅ Polyfill for Vite (fixes buffer issues)

import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

// Use your API key from .env
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider 
    activeChain="sepolia"        // ✅ Use Sepolia testnet
    clientId={clientId}          // ✅ Thirdweb API key (required)
  > 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
);
