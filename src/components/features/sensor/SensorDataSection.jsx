import React, { useCallback } from 'react';
import SensorDataCard from '../sensor/SensorDataCard';
import ConnectionIndicator from '../../ui/ConnectionIndicator';
import Icon from '../../ui/Icon';
import { SectionLoading } from '../../ui';
import { SENSOR_TYPES } from '../../../config/sensorConfig';

/**
 * 센서 데이터 섹션 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.sensorData - 센서 데이터 객체
 * @param {string} props.connectionState - 연결 상태
 * @param {string} props.zoneId - Zone ID
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {string} props.error - 에러 메시지
 */
const SensorDataSection = ({ sensorData, connectionState, zoneId, isLoading = false, error = null }) => {
  /**
   * 센서 타입별 센서 목록을 렌더링하는 함수
   */
  const renderSensorColumn = useCallback(({ type, icon: IconComponent, name }) => {
    const sensors = sensorData[type] || [];
    
    return (
      <div key={type} className="flex flex-col gap-4">
        {/* 센서 카드 목록만 렌더링 */}
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
      </div>
    );
  }, [sensorData, zoneId]);

  // 센서 데이터가 비어있는지 확인
  const hasSensorData = Object.values(sensorData).some(sensors => sensors && sensors.length > 0);
  const isEmpty = !isLoading && !error && !hasSensorData;

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
        <div className="flex-1">
          {/* 센서 타입별 헤더 - 고정 */}
          <div className="grid grid-cols-5 gap-[15px] mb-4">
            {SENSOR_TYPES.map(({ type, icon: IconComponent, name }) => (
              <div key={type} className="flex flex-col gap-4">
                <h4 className="text-base font-semibold text-gray-600 dark:text-neutral-300 flex items-center gap-2 mb-2 transition-colors duration-300">
                  <Icon>{React.createElement(IconComponent)}</Icon>
                  {name}
                </h4>
              </div>
            ))}
          </div>
          
          {/* 센서 카드들 - 로딩/에러 처리 적용 */}
          <SectionLoading
            loading={isLoading}
            loadingText="센서 데이터를 불러오는 중..."
            error={error}
            errorText="센서 데이터를 불러올 수 없습니다."
            empty={isEmpty}
            emptyText="센서 데이터가 없습니다."
            showHeader={false}
            size="lg"
            className="flex-1"
          >
            <div className="grid grid-cols-5 gap-[15px] flex-1">
              {SENSOR_TYPES.map(renderSensorColumn)}
            </div>
          </SectionLoading>
        </div>
      </div>
    </aside>
  );
};

export default SensorDataSection;
