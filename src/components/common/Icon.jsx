import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Icon = memo(({ children, size = "24px", className = "", ...props }) => {
  const sizeClasses = {
    "16px": "w-4 h-4",
    "20px": "w-5 h-5", 
    "24px": "w-6 h-6",
    "32px": "w-8 h-8",
    "40px": "w-10 h-10",
    "48px": "w-12 h-12",
  };

  const sizeClass = sizeClasses[size] || `w-[${size}] h-[${size}]`;

  return (
    <div 
      className={`${sizeClass} flex-shrink-0 aspect-square flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Icon.displayName = 'Icon';

Icon.propTypes = {
  children: PropTypes.node,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default Icon; 