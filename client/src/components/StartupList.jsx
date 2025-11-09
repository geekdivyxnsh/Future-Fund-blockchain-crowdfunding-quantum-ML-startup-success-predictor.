import React, { useState, useEffect } from 'react';
import { StartupCard } from './';

const StartupList = ({ title, isLoading, startups, handleCardClick, onViewPrediction, onInvest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [minSuccess, setMinSuccess] = useState(0);
  
  const sectors = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Entertainment'];
  
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = startup.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === '' || selectedSector === 'All' || startup.sector === selectedSector;
    const predictionScore = startup.prediction ? startup.prediction.score : 0;
    const matchesSuccessRange = predictionScore >= minSuccess;
    
    return matchesSearch && matchesSector && matchesSuccessRange;
  });

  return (
    <div>
      <h1 className="font-inter font-semibold text-[18px] text-gray-900 text-left">{title} ({filteredStartups.length})</h1>

      <div className="mt-[20px] flex flex-col gap-[15px]">
        <div className="flex flex-wrap gap-[10px]">
          <input 
            type="text"
            placeholder="Search startups..."
            className="w-full sm:w-[300px] py-[10px] sm:px-[20px] px-[15px] outline-none border border-gray-200 bg-white font-inter text-gray-900 text-[14px] placeholder:text-gray-400 rounded-[10px] shadow-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="w-full sm:w-[200px] py-[10px] sm:px-[20px] px-[15px] outline-none border border-gray-200 bg-white font-inter text-gray-900 text-[14px] rounded-[10px] shadow-card"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector} className="bg-white text-gray-900">{sector}</option>
            ))}
          </select>

          <div className="w-full sm:w-[300px] flex flex-col">
            <label className="font-inter text-[14px] text-gray-700 mb-[6px]">Minimum Success: {minSuccess}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={minSuccess}
              onChange={(e) => setMinSuccess(parseInt(e.target.value))}
              className="slider w-full"
              style={{ '--progress': `${minSuccess}%` }}
            />
            <div className="mt-[6px] flex justify-between text-[12px] text-gray-500 font-inter">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mt-[20px] gap-[26px]">
          {isLoading && (
            <p className="font-inter font-semibold text-[14px] leading-[30px] text-gray-500">
              Loading startups...
            </p>
          )}

          {!isLoading && filteredStartups.length === 0 && (
            <p className="font-inter font-semibold text-[14px] leading-[30px] text-gray-500">
              No startups found.
            </p>
          )}

          {!isLoading && filteredStartups.length > 0 && filteredStartups.map((startup) => (
            <StartupCard 
              key={startup.id}
              {...startup}
              handleClick={(action) => {
                if (action === 'view-prediction' && onViewPrediction) {
                  onViewPrediction(startup);
                } else if (action === 'invest' && onInvest) {
                  onInvest(startup);
                } else if (handleCardClick) {
                  handleCardClick(startup);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StartupList;