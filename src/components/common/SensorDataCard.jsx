import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSensorTypeConfig, getStatusHexColor } from '../../config/sensorConfig';
import { isSensorValueValid } from '../../utils/sensorUtils';

const SensorDataCard = ({ sensorData, zoneConfig, zoneId }) => {
  const navigate = useNavigate();
  const [displayValues, setDisplayValues] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValuesRef = useRef({});

  // 센서 값 변경 애니메이션 처리
  useEffect(() => {
    if (!sensorData || !isSensorValueValid(sensorData)) {
      setDisplayValues({});
      return;
    }

    const currentValues = sensorData.values || {};
    const prevValues = prevValuesRef.current;

    // 값이 변경되었는지 확인
    const hasChanged = sensorData.sensorType === 'particle' 
      ? (
          currentValues['0.1'] !== prevValues['0.1'] ||
          currentValues['0.3'] !== prevValues['0.3'] ||
          currentValues['0.5'] !== prevValues['0.5']
        )
      : currentValues.value !== prevValues.value;

    if (hasChanged) {
      setIsAnimating(true);
      
      // 부드러운 값 변경 애니메이션
      const animationTimer = setTimeout(() => {
        setDisplayValues(currentValues);
        prevValuesRef.current = currentValues;
        
        const resetTimer = setTimeout(() => {
          setIsAnimating(false);
        }, 300);
        
        return () => clearTimeout(resetTimer);
      }, 150);
      
      return () => clearTimeout(animationTimer);
    } else if (Object.keys(displayValues).length === 0) {
      // 초기 값 설정
      setDisplayValues(currentValues);
      prevValuesRef.current = currentValues;
    }
  }, [sensorData]);

  const handleCardClick = () => {
    if (zoneId) {
      // Graph 페이지로 이동하면서 zone 파라미터 전달
      navigate(`/home/graph?zone=${zoneId}`);
    }
  };

  // 센서 타입 설정 가져오기
  const sensorConfig = getSensorTypeConfig(sensorData.sensorType);
  
  // 센서 아이콘
  const sensorIcon = sensorConfig?.icon || '📊';
  
  // 센서 단위
  const sensorUnit = sensorConfig?.unit || '';
  
  // 센서 이름
  const sensorName = sensorConfig?.name || sensorData.sensorType;

  /**
   * 센서 값 렌더링 (애니메이션 포함)
   */
  const renderSensorValue = () => {
    // 센서 값이 유효하지 않은 경우 "데이터 준비 중" 표시
    if (!isSensorValueValid(sensorData) || Object.keys(displayValues).length === 0) {
      return (
        <div className="text-center text-gray-500">
          <div className="text-sm">데이터 준비 중</div>
        </div>
      );
    }

    if (sensorData.sensorType === 'particle') {
      // 먼지 센서는 3개 값 (0.1, 0.3, 0.5)
      return (
        <div className="particle-values">
          <div className="particle-labels">
            <span className="particle-label">0.1μm</span>
            <span className="particle-label">0.3μm</span>
            <span className="particle-label">0.5μm</span>
          </div>
          <div className="particle-values-column">
            <span 
              className={`particle-value ${isAnimating ? 'value-changing' : ''}`}
              style={{
                transition: 'all 0.3s ease-in-out',
                transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
                color: isAnimating ? '#3b82f6' : '#1e293b'
              }}
            >
              {displayValues['0.1']?.toFixed(2) || 0}
            </span>
            <span 
              className={`particle-value ${isAnimating ? 'value-changing' : ''}`}
              style={{
                transition: 'all 0.3s ease-in-out',
                transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
                color: isAnimating ? '#3b82f6' : '#1e293b'
              }}
            >
              {displayValues['0.3']?.toFixed(2) || 0}
            </span>
            <span 
              className={`particle-value ${isAnimating ? 'value-changing' : ''}`}
              style={{
                transition: 'all 0.3s ease-in-out',
                transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
                color: isAnimating ? '#3b82f6' : '#1e293b'
              }}
            >
              {displayValues['0.5']?.toFixed(2) || 0}
            </span>
            <span className="sensor-unit">{sensorUnit}</span>
          </div>
        </div>
      );
    }
    
    // 다른 센서들은 단일 값
    return (
      <span 
        className={`sensor-single-value ${isAnimating ? 'value-changing' : ''}`}
        style={{
          transition: 'all 0.3s ease-in-out',
          transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
          color: isAnimating ? '#3b82f6' : '#1e293b'
        }}
      >
        {displayValues.value?.toFixed(1) || 0}
      </span>
    );
  };

  // 센서 상태 색상 (상태 표시점에만 사용)
  const statusColor = getStatusHexColor(sensorData.sensorStatus);

  return (
    <div 
      className={`sensor-card ${sensorData.sensorType} w-full max-w-[280px]`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      title="클릭하여 그래프 페이지로 이동"
    >
      <div className="sensor-card-content">
        <div className="sensor-header">
          <h3 className="sensor-title">
            {sensorName}
          </h3>
          <span className="sensor-id-badge">
            {sensorData.sensorId}
          </span>
        </div>
      
        <div className="sensor-value-section">
          <div className="sensor-value-container">
            <div 
              className="status-indicator" 
              style={{ 
                backgroundColor: statusColor,
                minWidth: '16px',
                minHeight: '16px'
              }}
              title={`상태: ${sensorData.sensorStatus}`}
            ></div>
            <div className="sensor-value" style={{ color: '#1e293b' }}>
              {renderSensorValue()}
              {sensorData.sensorType !== 'particle' && (
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
