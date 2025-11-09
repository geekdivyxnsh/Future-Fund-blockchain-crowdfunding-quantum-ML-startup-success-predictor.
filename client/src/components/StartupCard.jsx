import React from 'react';
import { tagType, thirdweb, sun } from '../assets';
import { daysLeft } from '../utils';
import startup1 from '../assets/startup-1.svg';
import startup2 from '../assets/startup-2.svg';
import startup3 from '../assets/startup-3.svg';
import successGraph from '../assets/success-graph.svg';

const StartupCard = ({ owner, title, sector, goal, raised, metadataHash, prediction, handleClick }) => {
  const percentRaised = (raised / goal) * 100;
  
  const pickLogo = (text) => {
    const t = (text || '').toLowerCase();
    if (/(eco|green|clean|energy|solar|env)/.test(t)) return sun; // eco/energy domain
    if (/(med|health|bio|chain)/.test(t)) return startup2; // healthcare/blockchain domain
    if (/(learn|edu|school|teach|decentr)/.test(t)) return startup3; // education/decentralized learning
    if (/(fin|pay|money|invest|fund)/.test(t)) return successGraph; // finance/investing domain
    return startup1; // generic tech/startup
  };
  const imgSrc = pickLogo(title);

  return (
    <div className="sm:w-[288px] w-full rounded-[12px] bg-white border border-gray-200 shadow-card cursor-pointer" onClick={handleClick}>
      <img src={imgSrc} alt="startup" className="w-full h-[158px] object-cover rounded-t-[12px]" />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[12px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          <p className="ml-[12px] mt-[2px] font-inter font-medium text-[12px] text-gray-500">{sector}</p>
        </div>

        <div className="block">
          <h3 className="font-inter font-semibold text-[16px] text-gray-900 text-left leading-[26px] truncate">{title}</h3>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-inter font-semibold text-[14px] text-gray-600 leading-[22px]">Raised</h4>
            <p className="mt-[3px] font-inter font-normal text-[12px] leading-[18px] text-gray-600 sm:max-w-[120px] truncate">{raised} ETH</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-inter font-semibold text-[14px] text-gray-600 leading-[22px]">Goal</h4>
            <p className="mt-[3px] font-inter font-normal text-[12px] leading-[18px] text-gray-600 sm:max-w-[120px] truncate">{goal} ETH</p>
          </div>
        </div>

        <div className="mt-[20px]">
          <div className="w-full bg-gray-200 h-[5px] rounded-[10px]">
            <div className="bg-brand-green h-full rounded-[10px]" style={{ width: `${percentRaised > 100 ? 100 : percentRaised}%` }}></div>
          </div>
        </div>

        {prediction && (
          <div className="mt-[15px] py-2 px-4 bg-green-50 rounded-[10px] flex items-center justify-center">
            <p className="font-inter font-bold text-[14px] text-green-700">Predicted Success: {prediction.score}%</p>
          </div>
        )}

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-gray-100">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
          </div>
          <p className="flex-1 font-inter font-normal text-[12px] text-gray-600 truncate">by <span className="text-gray-900">{owner}</span></p>
        </div>

        <div className="flex justify-between mt-[15px]">
          <button 
            className="py-[10px] px-[15px] bg-brand-blue hover:bg-blue-700 rounded-[10px] font-inter font-semibold text-[14px] text-white min-h-[45px]"
            onClick={(e) => {
              e.stopPropagation();
              handleClick('view-prediction');
            }}
          >
            View Prediction
          </button>
          <button 
            className="py-[10px] px-[15px] bg-brand-green hover:bg-emerald-600 rounded-[10px] font-inter font-semibold text-[14px] text-white min-h-[45px]"
            onClick={(e) => {
              e.stopPropagation();
              handleClick('invest');
            }}
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartupCard;