import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../constants';

const EthersContext = createContext();

export const EthersProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    try {
      setIsLoading(true);
      
      if (!window.ethereum) throw new Error("Please install MetaMask");
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        const quantumCrowdContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        setContract(quantumCrowdContract);
      }
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnect = () => {
    setAddress('');
    setIsConnected(false);
    setContract(null);
  };
  
  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          disconnect();
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);
  
  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            connect();
          }
        } catch (error) {
          console.error("Failed to check connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  return (
    <EthersContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        isConnected,
        isLoading
      }}
    >
      {children}
    </EthersContext.Provider>
  );
};

export const useEthers = () => useContext(EthersContext);