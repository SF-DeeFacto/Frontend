import React, { useCallback, useMemo } from 'react';
import SensorDataCard from '../../common/SensorDataCard';
import ConnectionIndicator from '../../common/ConnectionIndicator';
import { SENSOR_TYPES } from '../../../config/sensorConfig';

/**
 * 센서 데이터 섹션 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.sensorData - 센서 데이터 객체
 * @param {string} props.connectionState - 연결 상태
 * @param {string} props.zoneId - Zone ID
 */
const SensorDataSection = ({ sensorData, connectionState, zoneId }) => {
  /**
   * 센서 타입별 센서 목록을 렌더링하는 함수
   */
  const renderSensorColumn = useCallback(({ type, icon, name }) => {
    const sensors = sensorData[type] || [];
    
    return (
      <div key={type} className="flex flex-col gap-4">
        {/* 센서 타입 헤더 */}
        <h4 className="text-base font-semibold text-gray-600 dark:text-neutral-300 flex items-center gap-2 mb-2 transition-colors duration-300">
          <span aria-hidden="true">{icon}</span>
          {name}
          {sensors.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-neutral-500">
              ({sensors.length}개)
            </span>
          )}
        </h4>
        
        {/* 센서 카드 목록 */}
        {sensors.length > 0 ? (
          <div className="space-y-2">
            {sensors.map((sensor, index) => (
              <div key={`${sensor.sensorId}-${index}`} className="w-full">
                <SensorDataCard 
                  sensorData={sensor}
                  zoneId={zoneId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 dark:text-neutral-500 py-4">
            <span className="text-sm">센서 데이터가 없습니다</span>
          </div>
        )}
      </div>
    );
  }, [sensorData, zoneId]);

  // 센서 데이터가 있는지 확인
  const hasSensorData = useMemo(() => {
    return Object.values(sensorData || {}).some(sensors => sensors && sensors.length > 0);
  }, [sensorData]);

  return (
    <aside className="flex-shrink-0 w-[60%] h-full">
      <div className="modern-card p-6 h-full flex flex-col overflow-y-auto overflow-x-hidden">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 transition-colors duration-300">
            실시간 센서 데이터
          </h2>
          <div className="flex items-center gap-2">
            <ConnectionIndicator connectionState={connectionState} />
          </div>
        </div>
        
        {/* 센서 데이터 컨텐츠 */}
        {hasSensorData ? (
          <div className="grid grid-cols-5 gap-[15px] flex-1">
            {SENSOR_TYPES.map(renderSensorColumn)}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400 dark:text-neutral-500">
              <div className="text-lg mb-2">📊</div>
              <div className="text-sm">센서 데이터를 불러오는 중...</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SensorDataSection;
