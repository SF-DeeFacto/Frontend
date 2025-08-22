import React from 'react';

const LoadingSpinner = ({ size = 'h-12 w-12', color = 'border-blue-600' }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${color}`}></div>
    </div>
  );
};

export default LoadingSpinner;
