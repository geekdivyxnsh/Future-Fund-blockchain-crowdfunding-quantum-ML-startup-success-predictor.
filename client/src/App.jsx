import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Navbar, Sidebar} from "./components";
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages';
import Marketplace from './pages/Marketplace';
import { EthersProvider } from './context/EthersContext';

const App = () => {
  return (
    <EthersProvider>
      <div className="relative sm:-8 p-4 bg-app min-h-screen flex flex-row font-inter text-primary">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </div>
      </div>
    </EthersProvider>
  )
}

export default App