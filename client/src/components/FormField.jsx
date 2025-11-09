import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange }) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-inter font-medium text-[14px] leading-[22px] text-gray-700 mb-[10px]">{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border border-gray-300 bg-white font-inter text-gray-900 text-[14px] placeholder:text-gray-400 rounded-[10px] sm:min-w-[300px]"
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border border-gray-300 bg-white font-inter text-gray-900 text-[14px] placeholder:text-gray-400 rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  )
}

export default FormField