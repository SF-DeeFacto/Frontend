import React from 'react';

const Icon = ({ children, size = "20px", className = "", ...props }) => {
  return (
    <div 
      className={`w-[${size}] h-[${size}] flex-shrink-0 aspect-square ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Icon; 