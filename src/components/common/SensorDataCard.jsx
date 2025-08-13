import React from 'react';
import { useNavigate } from 'react-router-dom';

const SensorDataCard = ({ sensorData, zoneConfig, zoneId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (zoneId) {
      // Graph 페이지로 이동하면서 zone 파라미터 전달
      navigate(`/home/graph?zone=${zoneId}`);
    }
  };

  const getSensorIcon = (sensorType) => {
    switch (sensorType) {
      case 'temperature':
        return '🌡️';
      case 'humidity':
        return '💧';
      case 'esd':
        return '⚡';
      case 'particle':
        return '🌫️';
      case 'windDir':
        return '🌪️';
      default:
        return '📊';
    }
  };

  const getSensorUnit = (sensorType) => {
    switch (sensorType) {
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      case 'esd':
        return 'V';
      case 'particle':
        return 'μg/m³';
      case 'windDir':
        return '°';
      default:
        return '';
    }
  };

  const getSensorValue = (sensorData) => {
    // 모든 센서에서 값이 없거나 0인 경우 "데이터 준비 중" 표시
    if (sensorData.sensor_type === 'particle') {
      // 먼지 센서는 3개 값이 모두 0인 경우
      if ((!sensorData.val_0_1 || sensorData.val_0_1 === 0) && 
          (!sensorData.val_0_3 || sensorData.val_0_3 === 0) && 
          (!sensorData.val_0_5 || sensorData.val_0_5 === 0)) {
        return (
          <div className="text-center text-gray-500">
            <div className="text-sm">데이터 준비 중</div>
          </div>
        );
      }
      
      // 값이 있는 경우 정상 표시
      return (
        <div className="particle-values">
          <div className="particle-labels">
            <span className="particle-label">0.1μm</span>
            <span className="particle-label">0.3μm</span>
            <span className="particle-label">0.5μm</span>
          </div>
          <div className="particle-values-column">
            <span className="particle-value">{sensorData.val_0_1?.toFixed(2) || 0}</span>
            <span className="particle-value">{sensorData.val_0_3?.toFixed(2) || 0}</span>
            <span className="particle-value">{sensorData.val_0_5?.toFixed(2) || 0}</span>
            <span className="sensor-unit">{getSensorUnit(sensorData.sensor_type)}</span>
          </div>
        </div>
      );
    }
    
    // 다른 모든 센서들도 값이 0인 경우 "데이터 준비 중" 표시
    if (!sensorData.val || sensorData.val === 0) {
      return (
        <div className="text-center text-gray-500">
          <div className="text-sm">데이터 준비 중</div>
        </div>
      );
    }
    
    return `${sensorData.val?.toFixed(1) || 0}`;
  };

  const getStatusColor = (sensorData) => {
    // 백엔드에서 받은 상태 사용
    if (sensorData.status === 'RED') return 'text-red-600';
    if (sensorData.status === 'YELLOW') return 'text-yellow-600';
    if (sensorData.status === 'GREEN') return 'text-green-600';
    
    // 기본값
    return 'text-blue-600';
  };

  const getStatusBgColor = (sensorData) => {
    // 백엔드에서 받은 상태 사용
    if (sensorData.status === 'RED') return '#ef4444'; // red-500
    if (sensorData.status === 'YELLOW') return '#eab308'; // yellow-500
    if (sensorData.status === 'GREEN') return '#22c55e'; // green-500
    
    // 기본값
    return '#22c55e'; // green-500
  };

  return (
    <div 
      className={`sensor-card ${sensorData.sensor_type} w-full max-w-[280px]`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      title="클릭하여 그래프 페이지로 이동"
    >
      <div className="sensor-card-content">
        <div className="sensor-header">
          <h3 className="sensor-title">
            {sensorData.sensor_type === 'esd' ? '정전기' : 
             sensorData.sensor_type === 'particle' ? '먼지' :
             sensorData.sensor_type === 'windDir' ? '풍향' :
             sensorData.sensor_type === 'temperature' ? '온도' :
             sensorData.sensor_type === 'humidity' ? '습도' : sensorData.sensor_type}
          </h3>
          <span className="sensor-id-badge">
            {sensorData.sensor_id}
          </span>
        </div>
      
        <div className="sensor-value-section">
          <div className="sensor-value-container">
            <div 
              className="status-indicator" 
              style={{ 
                backgroundColor: getStatusBgColor(sensorData),
                minWidth: '16px',
                minHeight: '16px'
              }}
              title={`상태: ${sensorData.val || sensorData.val_0_5}`}
            ></div>
            <div className={`sensor-value ${getStatusColor(sensorData)}`}>
              {getSensorValue(sensorData)}
              {sensorData.sensor_type !== 'particle' && (
                <span className="sensor-unit">{getSensorUnit(sensorData.sensor_type)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataCard;
