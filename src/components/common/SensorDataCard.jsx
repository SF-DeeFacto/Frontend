import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSensorTypeConfig, getStatusHexColor } from '../../config/sensorConfig';
import { isSensorValueValid } from '../../utils/sensorUtils';

const SensorDataCard = ({ sensorData, zoneConfig, zoneId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (zoneId) {
      // Graph 페이지로 이동하면서 zone 파라미터 전달
      navigate(`/home/graph?zone=${zoneId}`);
    }
  };

  // 센서 타입 설정 가져오기
  const sensorConfig = getSensorTypeConfig(sensorData.sensor_type);
  
  // 센서 아이콘
  const sensorIcon = sensorConfig?.icon || '📊';
  
  // 센서 단위
  const sensorUnit = sensorConfig?.unit || '';
  
  // 센서 이름
  const sensorName = sensorConfig?.name || sensorData.sensor_type;

  /**
   * 센서 값 렌더링
   */
  const renderSensorValue = () => {
    // 센서 값이 유효하지 않은 경우 "데이터 준비 중" 표시
    if (!isSensorValueValid(sensorData)) {
      return (
        <div className="text-center text-gray-500 dark:text-neutral-400">
          <div className="text-sm">데이터 준비 중</div>
        </div>
      );
    }

    if (sensorData.sensor_type === 'particle') {
      // 먼지 센서는 3개 값 (0.1, 0.3, 0.5) - 세로로 나열
      return (
        <div className="particle-values-vertical">
          <div className="particle-item">
            <span className="particle-label">0.1μm</span>
            <span className="particle-value">{sensorData.val_0_1?.toFixed(2) || 0}</span>
          </div>
          <div className="particle-item">
            <span className="particle-label">0.3μm</span>
            <span className="particle-value">{sensorData.val_0_3?.toFixed(2) || 0}</span>
          </div>
          <div className="particle-item">
            <span className="particle-label">0.5μm</span>
            <span className="particle-value">{sensorData.val_0_5?.toFixed(2) || 0}</span>
          </div>
          <div className="particle-unit">
            <span className="sensor-unit">{sensorUnit}</span>
          </div>
        </div>
      );
    }
    
    // 다른 센서들은 단일 값
    return `${sensorData.val?.toFixed(1) || 0}`;
  };

  // 센서 상태 색상 (상태 표시점에만 사용)
  const statusColor = getStatusHexColor(sensorData.status);

  return (
    <div 
      className={`sensor-card clickable ${sensorData.sensor_type} w-full max-w-[280px]`}
      onClick={handleCardClick}
      title="클릭하여 그래프 페이지로 이동"
    >
      <div className="sensor-card-content">
        <div className="sensor-header">
          <div className="flex items-center justify-center gap-2">
            <span className="sensor-icon text-lg">{sensorIcon}</span>
            <h3 className="sensor-title">
              {sensorData.sensor_id}
            </h3>
          </div>
        </div>
      
        <div className="sensor-value-section">
          <div className="sensor-value-container">
            <div 
              className="sensor-status-indicator" 
              style={{ 
                backgroundColor: statusColor
              }}
              title={`상태: ${sensorData.val || sensorData.val_0_5}`}
            ></div>
            <div className="sensor-value">
              {renderSensorValue()}
              {sensorData.sensor_type !== 'particle' && (
                <span className="sensor-unit">{sensorUnit}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataCard;
