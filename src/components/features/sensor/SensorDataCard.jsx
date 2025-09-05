import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSensorTypeConfig, isSensorValueValid, getStatusHexColor, getStatusText } from '../../../utils/sensorUtils';
import { CONNECTION_STATE } from '../../../config/sensorConfig';

/**
 * 센서 데이터 카드 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.sensorData - 센서 데이터 객체
 * @param {string} props.zoneId - Zone ID (선택사항)
 */
const SensorDataCard = ({ sensorData, zoneId }) => {
  const navigate = useNavigate();

  // 센서 설정 정보 메모이제이션
  const sensorConfig = useMemo(() => 
    getSensorTypeConfig(sensorData.sensorType), 
    [sensorData.sensorType]
  );

  // 센서 기본 정보 메모이제이션
  const sensorInfo = useMemo(() => ({
    unit: sensorConfig?.unit || ''
  }), [sensorConfig]);

  // 카드 클릭 핸들러
  const handleCardClick = () => {
    if (zoneId) {
      navigate(`/home/graph?zone=${zoneId}`);
    }
  };

  /**
   * 먼지 센서 값 렌더링
   */
  const renderParticleValues = () => {
    const particleData = [
      { label: '0.1μm', value: sensorData.val_0_1 },
      { label: '0.3μm', value: sensorData.val_0_3 },
      { label: '0.5μm', value: sensorData.val_0_5 }
    ];

    return (
      <div className="particle-values-vertical">
        {particleData.map(({ label, value }) => (
          <div key={label} className="particle-item">
            <span className="particle-label">{label}</span>
            <span className="particle-value">
              {typeof value === 'number' ? value.toFixed(2) : (parseFloat(value) || 0).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="particle-unit">
          <span className="sensor-unit">{sensorInfo.unit}</span>
        </div>
      </div>
    );
  };

  /**
   * 센서 값 렌더링 (메인 함수)
   */
  const renderSensorValue = () => {
    // 먼지 센서는 특별한 레이아웃
    if (sensorData.sensorType === 'particle') {
      return renderParticleValues();
    }
    
    // 다른 센서들은 단일 값
    const val = sensorData.val;
    const numericVal = typeof val === 'number' ? val : (parseFloat(val) || 0);
    return `${numericVal.toFixed(1)}`;
  };

  return (
    <div 
      className={`sensor-card clickable ${sensorData.sensorType} w-full max-w-[280px]`}
      onClick={handleCardClick}
      title="클릭하여 그래프 페이지로 이동"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="sensor-card-content">
        {/* 센서 헤더 */}
        <div className="sensor-header">
          <div className="flex items-center justify-between w-full">
            <div className="sensor-id-badge">
              {sensorData.sensorId || 'Unknown'}
            </div>
            {/* 상태 인디케이터 */}
            <div 
              className={`w-4 h-4 rounded-full border-2 border-white shadow-soft transition-all duration-300 flex-shrink-0 ${
                sensorData.connectionState === CONNECTION_STATE.CONNECTING ? 'animate-pulse-soft' : ''
              }`}
              style={{ 
                backgroundColor: getStatusHexColor(sensorData.status || 'CONNECTING'),
                boxShadow: `0 0 15px ${getStatusHexColor(sensorData.status || 'CONNECTING')}30`
              }}
              title={`상태: ${getStatusText(sensorData.status || 'CONNECTING')} | 연결: ${sensorData.connectionState || 'DISCONNECTED'}`}
            ></div>
          </div>
        </div>
      
        {/* 센서 값 섹션 */}
        <div className="sensor-value-section">
          <div className="sensor-value-container">
            <div className="sensor-value">
              {renderSensorValue()}
              {sensorData.sensorType !== 'particle' && (
                <span className="sensor-unit">{sensorInfo.unit}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataCard;
