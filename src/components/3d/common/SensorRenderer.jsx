import React from 'react';
import SensorIndicator from '../zone/SensorIndicator';
import { getSensorStatus, getSensorInfo } from '../../../hooks/useModelLoader';
import { getSensorTypeFromName } from '../../../config/sensorConfig';

// 센서 렌더링 컴포넌트
export const SensorRenderer = ({ 
  sensorPositions, 
  sensorData, 
  onSensorClick,
  zoneId 
}) => {
  if (!sensorPositions || Object.keys(sensorPositions).length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(sensorPositions).map(([sensorName, sensorPositionData]) => {
        const status = getSensorStatus(sensorName, sensorData);
        const sensorInfo = getSensorInfo(sensorName, sensorData);
        
        return (
          <SensorIndicator
            key={sensorName}
            position={sensorPositionData.position}
            status={status}
            sensorName={sensorName}
            sensorData={sensorData}
            onClick={() => {
              if (onSensorClick) {
                onSensorClick({
                  name: sensorName,
                  position: sensorPositionData.position,
                  status,
                  id: sensorName,
                  type: getSensorTypeFromName(sensorName),
                  sensorInfo
                });
              }
            }}
          />
        );
      })}
    </>
  );
};

