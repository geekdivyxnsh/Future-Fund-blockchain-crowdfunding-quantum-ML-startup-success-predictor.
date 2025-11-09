import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4 className="font-inter font-bold text-[24px] text-gray-900 p-3 bg-white border border-gray-200 rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-inter font-normal text-[14px] text-gray-600 bg-gray-50 border border-t-0 border-gray-200 px-3 py-2 w-full rounded-b-[10px] text-center">{title}</p>
    </div>
  )
}

export default CountBox