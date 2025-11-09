import React, { useState } from 'react';
import { useEthers } from '../context/EthersContext';

const InvestModal = ({ startup, onClose, onSuccess }) => {
  const prediction = startup.prediction;
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Enter amount, 2: Preview, 3: Confirmation
  
  const { connect, address, contract, isConnected } = useEthers();
  
  // Calculate estimated shares (simplified)
  const estimatedShares = amount ? parseFloat(amount) : 0;
  
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', error);
    }
  };
  
  const handlePreview = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setStep(2);
  };
  
  const handleInvest = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      
      // Simulate contract interaction for demo
      setTimeout(() => {
        // Generate a mock transaction hash
        const mockTxHash = '0x' + Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        setTxHash(mockTxHash);
        setStep(3);
        setIsProcessing(false);
        
        // Update the startup's raised amount for demo purposes
        startup.raised = parseFloat(startup.raised) + parseFloat(amount);
      }, 2000);
      
    } catch (error) {
      setError('Investment failed. Please try again.');
      console.error('Investment error:', error);
      setIsProcessing(false);
    }
  };
  
  const getExplorerLink = () => {
    // This would be configured based on the network (mainnet, testnet, etc.)
    return `https://polygonscan.com/tx/${txHash}`;
  };
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white border border-gray-200 text-left align-bottom shadow-dropdown transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {step === 1 && 'Invest in ' + startup.title}
                  {step === 2 && 'Preview Investment'}
                  {step === 3 && 'Investment Successful!'}
                </h3>
                
                {step === 1 && (
                  <div>
                    {!isConnected ? (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-4">Connect your wallet to invest in this startup</p>
                        <button
                          className="w-full py-3 bg-brand-blue hover:bg-blue-700 rounded-[10px] font-inter font-semibold text-[14px] text-white"
                          onClick={handleConnect}
                        >
                          Connect Wallet
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (ETH)</label>
                          <input
                            type="number"
                            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-[10px] text-gray-900"
                            placeholder="0.1"
                            value={amount}
                            onChange={handleAmountChange}
                            min="0.001"
                            step="0.001"
                          />
                        </div>
                        
                        <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Current Prediction</span>
                            <span className="text-gray-900">{prediction ? prediction.score + '%' : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Confidence</span>
                            <span className="text-gray-900">{prediction ? prediction.confidence + '%' : 'N/A'}</span>
                          </div>
                        </div>
                        
                        <button
                          className="w-full py-3 bg-brand-green hover:bg-emerald-600 rounded-[10px] font-inter font-semibold text-[14px] text-white"
                          onClick={handlePreview}
                        >
                          Preview Investment
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {step === 2 && (
                  <div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                      <h4 className="text-gray-900 text-sm mb-3">Investment Summary</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-gray-900">{amount} ETH</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Estimated Shares</span>
                        <span className="text-gray-900">{estimatedShares}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Success Prediction</span>
                        <span className="text-gray-900">{prediction ? prediction.score + '%' : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <button
                      className="w-full py-3 bg-brand-green hover:bg-emerald-600 rounded-[10px] font-inter font-semibold text-[14px] text-white mb-2"
                      onClick={handleInvest}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Confirm Investment'}
                    </button>
                    
                    <button
                      className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-[10px] font-inter font-semibold text-[14px] text-gray-700"
                      onClick={() => setStep(1)}
                      disabled={isProcessing}
                    >
                      Back
                    </button>
                  </div>
                )}
                
                {step === 3 && (
                  <div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <h4 className="text-gray-900 text-center text-lg mb-3">Investment Successful!</h4>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-gray-900">{amount} ETH</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Shares</span>
                        <span className="text-gray-900">{estimatedShares}</span>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <a 
                          href={getExplorerLink()} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-green hover:underline"
                        >
                          View transaction on explorer
                        </a>
                      </div>
                    </div>
                    
                    <button
                      className="w-full py-3 bg-brand-blue hover:bg-blue-700 rounded-[10px] font-inter font-semibold text-[14px] text-white"
                      onClick={() => {
                        if (onSuccess) onSuccess();
                        else onClose();
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {step === 1 && (
            <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => onClose('close')}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestModal;