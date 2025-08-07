import React from 'react';

const Button = ({ children, onClick, className = "", variant = "default" }) => {
  const baseClasses = "px-4 py-2 text-center w-[90px] border-none bg-transparent";
  
  const variants = {
    default: "hover:bg-gray-100",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 hover:bg-gray-300"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ border: 'none', backgroundColor: 'transparent' }}
    >
      {children}
    </button>
    );
};

export default Button; 