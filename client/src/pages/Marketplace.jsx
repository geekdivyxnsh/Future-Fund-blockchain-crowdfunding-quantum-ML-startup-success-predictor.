import React, { useState, useEffect } from 'react';
import { StartupList, PredictionPanel, InvestModal } from '../components';
import { sectors } from '../constants';
import { useEthers } from '../context/EthersContext';
import { useStateContext } from '../context';

const Marketplace = () => {
  const { connect, isConnected, address } = useEthers();
  const { getCampaigns, contract } = useStateContext();
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showPredictionPanel, setShowPredictionPanel] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState(5); // ETH

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        // Pull on-chain campaigns and map into startup-like objects
        const campaigns = (await getCampaigns()) || [];
        const mapped = campaigns.map((c, idx) => {
          const goal = parseFloat(c.target || '0');
          const raised = parseFloat(c.amountCollected || '0');
          const ratio = goal > 0 ? Math.min(1, raised / goal) : 0;
          const daysRemaining = Math.max(0, Math.floor((c.deadline - Date.now()) / (1000 * 60 * 60 * 24)));
          const urgencyBoost = daysRemaining < 14 ? 0.05 : 0;
          const score = Math.round(Math.max(5, Math.min(95, 25 + 50 * ratio + 20 * urgencyBoost)));
          const confidence = Math.round(Math.max(40, Math.min(95, 60 + 30 * ratio)));
          return {
            id: c.pId ?? idx,
            owner: c.owner,
            title: c.title,
            tagline: c.description,
            sector: 'General',
            goal: +goal,
            raised: +raised,
            metadataHash: c.image,
            prediction: {
              score,
              confidence,
              breakdown: {
                team: +(0.20 + 0.20 * ratio).toFixed(2),
                traction: +(0.15 + 0.35 * ratio).toFixed(2),
                market: 0.15,
                innovation: 0.20,
                financials: +(0.10 + 0.10 * ratio).toFixed(2),
                execution: 0.10,
              },
              time: Date.now(),
              version: 'Heuristic-1.0',
              ipfsHash: (c.image || '').toString(),
            },
          };
        });
        setStartups(mapped);
      } catch (error) {
        console.error('Error fetching startups from campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (contract) fetchStartups();
  }, [contract]);

  const handleViewPrediction = (startup) => {
    setSelectedStartup(startup);
    setShowPredictionPanel(true);
  };

  const handleInvest = (startup) => {
    if (!isConnected) {
      connect();
      return;
    }
    setSelectedStartup(startup);
    setShowInvestModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4 min-h-screen bg-gray-50">
      {/* Left Column - Startup List (65%) */}
      <div className="w-full md:w-2/3 bg-white border border-gray-200 rounded-[12px] p-4 shadow-card">
        <h1 className="font-inter font-bold text-gray-900 text-2xl mb-4">
          Quantum ML Startup Marketplace
        </h1>
        
        <StartupList 
          startups={startups} 
          isLoading={isLoading}
          handleCardClick={(startup) => setSelectedStartup(startup)}
          onViewPrediction={handleViewPrediction}
          onInvest={handleInvest}
        />
      </div>
      
      {/* Right Column - Details (35%) */}
      <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-[12px] p-4 shadow-card">
        <h2 className="font-inter font-bold text-gray-900 text-xl mb-4">
          {selectedStartup ? selectedStartup.title : 'Select a Startup'}
        </h2>
        
        {selectedStartup ? (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-[12px] shadow-card">
              <p className="font-inter text-gray-700">{selectedStartup.tagline}</p>
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="font-inter text-gray-500">Sector</p>
                  <p className="font-inter font-semibold text-gray-900">{selectedStartup.sector}</p>
                </div>
                <div>
                  <p className="font-inter text-gray-500">Prediction</p>
                  <p className="font-inter font-semibold text-gray-900">{selectedStartup.prediction?.score ?? selectedStartup.prediction?.prediction ?? 0}%</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-inter text-gray-500">Progress</p>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-brand-green rounded-full" 
                    style={{ width: `${(selectedStartup.raised / selectedStartup.goal) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="font-inter font-semibold text-gray-900">{selectedStartup.raised} ETH</p>
                  <p className="font-inter text-gray-500">of {selectedStartup.goal} ETH</p>
                </div>
              </div>

              {/* Investment Insights */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-inter text-gray-900 text-sm">Investment Insights</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Amount</label>
                    <input
                      type="number"
                      className="w-24 py-1 px-2 border border-gray-300 rounded-[8px] text-gray-900"
                      value={investAmount}
                      min={0}
                      step={0.1}
                      onChange={(e) => setInvestAmount(parseFloat(e.target.value || '0'))}
                    />
                    <span className="text-sm text-gray-500">ETH</span>
                  </div>
                </div>

                {(() => {
                  const prob = (selectedStartup.prediction?.score ?? selectedStartup.prediction?.prediction ?? 0) / 100;
                  const roiLow = 0.2; // 20% annual
                  const roiAvg = 0.5; // 50% annual
                  const roiHigh = 1.0; // 100% annual
                  const low = +(investAmount * roiLow * prob).toFixed(2);
                  const avg = +(investAmount * roiAvg * prob).toFixed(2);
                  const high = +(investAmount * roiHigh * prob).toFixed(2);
                  const expectedValue = +(investAmount * roiAvg * prob).toFixed(2);
                  return (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-inter text-gray-500">12-month projected profit</span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-2 text-center">
                          <div className="text-xs text-gray-500">Low</div>
                          <div className="font-inter font-semibold text-gray-900">{low} ETH</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-2 text-center">
                          <div className="text-xs text-gray-500">Average</div>
                          <div className="font-inter font-semibold text-gray-900">{avg} ETH</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-2 text-center">
                          <div className="text-xs text-gray-500">High</div>
                          <div className="font-inter font-semibold text-gray-900">{high} ETH</div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600">
                        Expected value (avg scenario × success prob): <span className="font-semibold text-gray-900">{expectedValue} ETH</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="mt-6 flex gap-4">
                <button 
                  className="px-4 py-2 bg-brand-blue hover:bg-blue-700 rounded-[10px] text-white font-inter font-semibold"
                  onClick={() => handleViewPrediction(selectedStartup)}
                >
                  View Prediction
                </button>
                <button 
                  className="px-4 py-2 bg-brand-green hover:bg-emerald-600 rounded-[10px] text-white font-inter font-semibold"
                  onClick={() => handleInvest(selectedStartup)}
                >
                  Invest Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white border border-gray-200 rounded-[12px] shadow-card">
            <p className="font-inter text-gray-500">Select a startup to view details</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showPredictionPanel && selectedStartup && (
        <PredictionPanel 
          startup={selectedStartup}
          onClose={() => setShowPredictionPanel(false)}
          onInvest={() => {
            setShowPredictionPanel(false);
            setShowInvestModal(true);
          }}
          isAdmin={address === "0xAdminAddress"} // Replace with actual admin check
        />
      )}
      
      {showInvestModal && selectedStartup && (
        <InvestModal 
          startup={selectedStartup}
          onClose={() => setShowInvestModal(false)}
          onSuccess={() => {
            setShowInvestModal(false);
            // Refresh startups data after successful investment
            // Re-fetch campaigns to refresh prediction inputs and amounts
            // Note: use a micro task to avoid stale closure
            (async () => {
              try {
                const campaigns = (await getCampaigns()) || [];
                const mapped = campaigns.map((c, idx) => {
                  const goal = parseFloat(c.target || '0');
                  const raised = parseFloat(c.amountCollected || '0');
                  const ratio = goal > 0 ? Math.min(1, raised / goal) : 0;
                  const daysRemaining = Math.max(0, Math.floor((c.deadline - Date.now()) / (1000 * 60 * 60 * 24)));
                  const urgencyBoost = daysRemaining < 14 ? 0.05 : 0;
                  const score = Math.round(Math.max(5, Math.min(95, 25 + 50 * ratio + 20 * urgencyBoost)));
                  const confidence = Math.round(Math.max(40, Math.min(95, 60 + 30 * ratio)));
                  return {
                    id: c.pId ?? idx,
                    owner: c.owner,
                    title: c.title,
                    tagline: c.description,
                    sector: 'General',
                    goal: +goal,
                    raised: +raised,
                    metadataHash: c.image,
                    prediction: {
                      score,
                      confidence,
                      breakdown: {
                        team: +(0.20 + 0.20 * ratio).toFixed(2),
                        traction: +(0.15 + 0.35 * ratio).toFixed(2),
                        market: 0.15,
                        innovation: 0.20,
                        financials: +(0.10 + 0.10 * ratio).toFixed(2),
                        execution: 0.10,
                      },
                      time: Date.now(),
                      version: 'Heuristic-1.0',
                      ipfsHash: (c.image || '').toString(),
                    },
                  };
                });
                setStartups(mapped);
              } catch (e) {
                console.warn('Refresh campaigns failed', e);
              }
            })();
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;