import React from 'react'

const VARIANTS = {
  primary: 'neon-btn',
  success: 'neon-btn secondary',
  neutral: 'neon-outline',
  ghost: 'neon-outline',
};

const CustomButton = ({ 
  btnType = 'button', 
  title, 
  handleClick, 
  styles = '',
  className = '',
  variant = 'primary'
}) => {
  const base = 'font-inter font-semibold text-[14px] leading-[22px] min-h-[45px] px-4 rounded-[10px]';
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const finalClass = `${base} ${variantClass} ${className}`.trim();

  return (
    <button type={btnType} className={finalClass} onClick={handleClick}>
      {title}
    </button>
  )
}

export default CustomButton