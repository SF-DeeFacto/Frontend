import React from 'react';
import B01ModelViewer from './A01ModelViewer';

const ZoneModelViewer = ({ zoneId }) => {
  const getZoneModel = (zoneId) => {
    const zoneIdUpper = zoneId?.toUpperCase();
    
    switch (zoneIdUpper) {
      case 'B01':
        return <B01ModelViewer />;
      // 다른 Zone들 추가 예정
      // case 'A01':
      //   return <A01ModelViewer />;
      // case 'C01':
      //   return <C01ModelViewer />;
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h2 className="text-xl font-semibold text-gray-600">
                Zone {zoneIdUpper} 3D 모델
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                해당 Zone의 3D 모델이 준비 중입니다.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {getZoneModel(zoneId)}
    </div>
  );
};

export default ZoneModelViewer; 