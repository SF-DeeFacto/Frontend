import React from 'react';
import SensorIndicator from '../zone/SensorIndicator';
import { getSensorStatus, getSensorInfo } from '../../../hooks/useModelLoader';

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
                  type: getSensorType(sensorName),
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

// 센서 타입 분류 함수
const getSensorType = (name) => {
  if (name.includes('ESD')) return 'ESD';
  if (name.includes('Handle')) return 'Handle';
  if (name.includes('HUM')) return 'Humidity';
  if (name.includes('WD')) return 'WaterDetector';
  if (name.includes('TEM')) return 'Temperature';
  if (name.includes('LPM')) return 'Particle';
  return 'Unknown';
};
