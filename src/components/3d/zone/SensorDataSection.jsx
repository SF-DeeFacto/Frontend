import React, { useCallback } from 'react';
import SensorDataCard from '../../common/SensorDataCard';
import ConnectionIndicator from '../../common/ConnectionIndicator';
import { SENSOR_TYPES } from '../../../config/sensorConfig';

const SensorDataSection = ({ sensorData, connectionState, zoneId }) => {
  // 디버깅용 로그 추가
  console.log('🔍 SensorDataSection 렌더링:', {
    zoneId,
    connectionState,
    sensorData,
    sensorDataKeys: Object.keys(sensorData || {}),
    sensorDataLength: Object.keys(sensorData || {}).length,
    SENSOR_TYPES: SENSOR_TYPES.map(type => type.type),
    timestamp: new Date().toLocaleTimeString()
  });

  // 실제 센서 데이터 사용
  const displayData = sensorData || {};
  
  console.log('📊 센서 데이터:', {
    displayData,
    displayDataKeys: Object.keys(displayData),
    timestamp: new Date().toLocaleTimeString()
  });

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
    
    console.log(`🔍 ${type} 센서 렌더링:`, {
      type,
      sensors,
      sortedSensors,
      sensorsLength: sensors?.length || 0,
      timestamp: new Date().toLocaleTimeString()
    });
    
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
