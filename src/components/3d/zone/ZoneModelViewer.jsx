import React from 'react';
import { ZoneCanvas } from '../common/CanvasWrapper';
import ZoneModel from './ZoneModel';

// 범용 존 뷰어 컴포넌트
function GenericZoneViewer({ zoneId, sensorData, selectedObject, onObjectClick }) {
  const modelPath = `/models/${zoneId.toUpperCase()}-meshopt.glb`;
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <ZoneCanvas>
        <ZoneModel 
          modelPath={modelPath} 
          zoneId={zoneId} 
          sensorData={sensorData}
          selectedObject={selectedObject}
          onObjectClick={onObjectClick}
        />
      </ZoneCanvas>
    </div>
  );
}

const ZoneModelViewer = ({ zoneId, sensorData, selectedObject, onObjectClick }) => {
  // 모든 존을 범용 뷰어로 처리
  return (
    <div className="w-full h-full">
      <GenericZoneViewer 
        zoneId={zoneId} 
        sensorData={sensorData}
        selectedObject={selectedObject}
        onObjectClick={onObjectClick} 
      />
    </div>
  );
};

export default ZoneModelViewer; 