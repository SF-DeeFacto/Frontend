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
      style={{
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '16px',
        position: 'relative'
      }}
      className={className}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#001d6c]">{title}</h3>
        {showZone && <div className="text-sm text-gray-500">{zone}</div>}
      </div>
      <div className={`${height} ${width} bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">{icon}</div>
          <div>{description}</div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection; 