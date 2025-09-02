import React from 'react';

const ModelCard = ({ zoneId, children, className = '' }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${className}`} style={{ background: '#ffffff' }}>
      {children || (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Zone {zoneId?.toUpperCase()} 3D 모델 준비 중
          </h2>
        </div>
      )}
    </div>
  );
};

export default ModelCard;
