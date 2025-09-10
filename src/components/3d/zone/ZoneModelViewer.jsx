import React, { useState } from 'react';
import { ZoneCanvas } from '../common/CanvasWrapper';
import ZoneModel from './ZoneModel';
import { getZoneModelPath } from '../../../config/modelConfig';

// 범용 존 뷰어 컴포넌트
function GenericZoneViewer({ zoneId, sensorData, selectedObject, onObjectClick, onLoadingChange, onErrorChange }) {
  const modelPath = getZoneModelPath(zoneId);
  
  const handleModelLoad = () => {
    if (onLoadingChange) onLoadingChange(false);
    if (onErrorChange) onErrorChange(null);
  };
  
  const handleModelError = (error) => {
    if (onLoadingChange) onLoadingChange(false);
    if (onErrorChange) onErrorChange(error);
  };
  
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
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      </ZoneCanvas>
    </div>
  );
}

const ZoneModelViewer = ({ zoneId, sensorData, selectedObject, onObjectClick, onLoadingChange, onErrorChange }) => {
  // 모든 존을 범용 뷰어로 처리
  return (
    <div className="w-full h-full">
      <GenericZoneViewer 
        zoneId={zoneId} 
        sensorData={sensorData}
        selectedObject={selectedObject}
        onObjectClick={onObjectClick}
        onLoadingChange={onLoadingChange}
        onErrorChange={onErrorChange}
      />
    </div>
  );
};

export default ZoneModelViewer; 