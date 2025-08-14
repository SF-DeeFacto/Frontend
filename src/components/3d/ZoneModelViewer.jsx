import React from 'react';
import B01ModelViewer from './B01ModelViewer';
import A01ModelViewer from './A01ModelViewer';

const ZoneModelViewer = ({ zoneId }) => {
  const getZoneModel = (zoneId) => {
    const zoneIdUpper = zoneId?.toUpperCase();
    
    switch (zoneIdUpper) {
      case 'A01':
        return <A01ModelViewer />;
      case 'B01':
        return <B01ModelViewer />;
      // 다른 Zone들 추가 예정
      // case 'C01':
      //   return <C01ModelViewer />;
      default:
        return (
          <div className="w-full h-full">
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