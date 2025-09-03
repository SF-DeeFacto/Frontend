import React from 'react';

const ChartSection = ({ 
  title, 
  zone, 
  icon, 
  description,
  height = 'h-96', // 기본값 h-96 (384px)
  width = 'w-full', // 기본값 w-full
  backgroundColor = '#f0f8ff',
  borderColor = '#4a90e2',
  showZone = false, // zone 표시 여부
  className = '' // 추가 클래스
}) => {
  return (
    <div 
      className={`bg-blue-50 dark:bg-neutral-800 border-2 border-blue-400 dark:border-neutral-600 rounded-lg p-4 relative transition-colors duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-neutral-100 transition-colors duration-300">{title}</h3>
        {showZone && <div className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">{zone}</div>}
      </div>
      <div className={`${height} ${width} bg-gray-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-600 transition-colors duration-300`}>
        <div className="text-gray-400 dark:text-neutral-400 text-center transition-colors duration-300">
          <div className="text-4xl mb-2">{icon}</div>
          <div>{description}</div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection; 