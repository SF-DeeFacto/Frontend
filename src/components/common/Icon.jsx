import React from 'react';

const Icon = ({ children, size = "20px", className = "", ...props }) => {
  return (
    <div 
      className={`flex-shrink-0 aspect-square ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Icon; 