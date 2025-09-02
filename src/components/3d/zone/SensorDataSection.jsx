import React, { useCallback } from 'react';
import SensorDataCard from '../../common/SensorDataCard';
import ConnectionIndicator from '../../common/ConnectionIndicator';
import { SENSOR_TYPES } from '../../../config/sensorConfig';

const SensorDataSection = ({ sensorData, connectionState, zoneId }) => {
  // 실제 센서 데이터 사용
  const displayData = sensorData || {};

  /**
   * 센서 ID에서 숫자 부분을 추출하는 함수
   */
  const extractSensorNumber = (sensorId) => {
    const match = sensorId.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  /**
   * 센서들을 센서 ID 순서대로 정렬하는 함수
   */
  const sortSensorsById = (sensors) => {
    if (!Array.isArray(sensors)) return [];
    
    return [...sensors].sort((a, b) => {
      const aNumber = extractSensorNumber(a.sensorId);
      const bNumber = extractSensorNumber(b.sensorId);
      return aNumber - bNumber;
    });
  };

  /**
   * 센서 타입별 센서 목록을 렌더링하는 함수
   */
  const renderSensorColumn = useCallback(({ type, icon, name }) => {
    const sensors = displayData[type];
    
    // 센서들을 ID 순서대로 정렬
    const sortedSensors = sortSensorsById(sensors);
    
    return (
      <div key={type} className="flex flex-col gap-4">
        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
          <span>{icon}</span>
          {name}
          {sortedSensors && sortedSensors.length > 0 && (
            <span className="text-xs text-gray-400">({sortedSensors.length}개)</span>
          )}
        </h4>
        
        {sortedSensors && sortedSensors.length > 0 && (
          <div className="space-y-2">
            {sortedSensors.map((sensor, index) => (
              <div key={`${sensor.sensorId}-${index}`} className="w-full">
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
  }, [displayData, zoneId]);

  return (
    <aside className="w-[60%] h-full">
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">실시간 센서 데이터</h2>
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
