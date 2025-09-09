import React from 'react';
import { BaseModel } from '../common/BaseModel';

// 호버 오버레이용 간단한 3D 모델
function SimpleModel({ modelPath, onLoad, sensorData, zoneId, onSensorClick }) {
  return (
    <BaseModel
      modelPath={modelPath}
      onLoad={onLoad}
      sensorData={sensorData}
      zoneId={zoneId}
      onSensorClick={onSensorClick}
      lighting="soft"
      scale={[0.002, 0.002, 0.002]}
    />
  );
}

export default SimpleModel;
