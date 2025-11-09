import React from 'react'

import { loader } from '../assets';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.35)] flex items-center justify-center px-4">
      <div className="bg-white rounded-[12px] shadow-dropdown border border-gray-200 p-6 w-full max-w-sm text-center">
        <img src={loader} alt="loader" className="w-[64px] h-[64px] object-contain mx-auto"/>
        <p className="mt-4 font-inter font-semibold text-[16px] text-gray-900">Transaction is in progress</p>
        <p className="font-inter text-[14px] text-gray-600">Please wait...</p>
      </div>
    </div>
  )
}

export default Loader