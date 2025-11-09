import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount); 

    navigate('/')
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-gray-200 mt-2 rounded-[10px]">
            <div className="absolute h-full bg-brand-green rounded-[10px]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[24px]">
          <div>
            <h4 className="font-inter font-semibold text-[18px] text-gray-900 uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-inter font-semibold text-[14px] text-gray-900 break-all">{state.owner}</h4>
                <p className="mt-[4px] font-inter font-normal text-[12px] text-gray-500">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-inter font-semibold text-[18px] text-gray-900 uppercase">Story</h4>

              <div className="mt-[20px]">
                <p className="font-inter font-normal text-[16px] text-gray-600 leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-inter font-semibold text-[18px] text-gray-900 uppercase">Donators</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-inter font-normal text-[16px] text-gray-700 leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-inter font-normal text-[16px] text-gray-500 leading-[26px] break-ll">{item.donation}</p>
                  </div>
                )) : (
                  <p className="font-inter font-normal text-[16px] text-gray-500 leading-[26px] text-justify">No donators yet. Be the first one!</p>
                )}
              </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-inter font-semibold text-[18px] text-gray-900 uppercase">Fund</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-white border border-gray-200 rounded-[10px] shadow-card">
            <p className="font-inter font-medium text-[16px] leading-[24px] text-center text-gray-600">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border border-gray-300 bg-white font-inter text-gray-900 text-[16px] leading-[24px] placeholder:text-gray-400 rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-gray-50 border border-gray-200 rounded-[10px]">
                <h4 className="font-inter font-semibold text-[14px] leading-[22px] text-gray-900">Back it because you believe in it.</h4>
                <p className="mt-[12px] font-inter font-normal leading-[22px] text-gray-600">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton 
                btnType="button"
                title="Fund Campaign"
                className="w-full"
                variant="primary"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails