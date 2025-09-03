import React, { useCallback } from 'react';
import SensorDataCard from '../../common/SensorDataCard';
import ConnectionIndicator from '../../common/ConnectionIndicator';
import { SENSOR_TYPES } from '../../../config/sensorConfig';

const SensorDataSection = ({ sensorData, connectionState, zoneId }) => {
  /**
   * 센서 타입별 센서 목록을 렌더링하는 함수
   */
  const renderSensorColumn = useCallback(({ type, icon, name }) => {
    const sensors = sensorData[type];
    
    return (
      <div key={type} className="flex flex-col gap-4">
        <h4 className="text-base font-semibold text-gray-600 dark:text-neutral-300 flex items-center gap-2 mb-2 transition-colors duration-300">
          <span>{icon}</span>
          {name}
          {sensors && sensors.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-neutral-500">({sensors.length}개)</span>
          )}
        </h4>
        
        {sensors && sensors.length > 0 && (
          <div className="space-y-2">
            {sensors.map((sensor, index) => (
              <div key={`${sensor.sensor_id}-${index}`} className="w-full">
                <SensorDataCard 
                  sensorData={sensor}
                  zoneId={zoneId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [sensorData, zoneId]);

  return (
    <aside className="flex-shrink-0 w-[60%] h-full">
      <div className="modern-card p-6 h-full flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-4 transition-colors duration-300">실시간 센서 데이터</h2>
          <div className="flex items-center gap-2">
            <ConnectionIndicator connectionState={connectionState} />
          </div>
        </div>
        
        {/* 센서 타입별 그리드 레이아웃 */}
        <div className="grid grid-cols-5 gap-[15px]">
          {SENSOR_TYPES.map(renderSensorColumn)}
        </div>
      </div>
    </aside>
  );
};

export default SensorDataSection;
