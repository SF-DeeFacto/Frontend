import { SENSOR_STATUS } from '../types/sensor';
import { 
  getStatusColor,
  getStatusHexColor,
  getStatusEmoji,
  getStatusText
} from '../config/sensorConfig';

// 통합 설정의 함수들을 재-export (기존 호환성 유지)
export { getStatusColor, getStatusHexColor, getStatusEmoji, getStatusText };

/**
 * 센서 데이터를 그룹화
 */
export const groupSensorData = (sensors) => {
  const grouped = {};
  
  Object.values(sensors).forEach(sensor => {
    const sensorType = sensor.sensorType;
    if (!grouped[sensorType]) {
      grouped[sensorType] = [];
    }
    
    const convertedSensor = {
      sensor_id: sensor.sensorId,
      sensor_type: sensor.sensorType,
      timestamp: sensor.timestamp,
      status: sensor.sensorStatus
    };

    if (sensor.sensorType === 'particle') {
      convertedSensor.val_0_1 = parseFloat(sensor.values?.['0.1']) || 0;
      convertedSensor.val_0_3 = parseFloat(sensor.values?.['0.3']) || 0;
      convertedSensor.val_0_5 = parseFloat(sensor.values?.['0.5']) || 0;
    } else {
      convertedSensor.val = parseFloat(sensor.values?.value) || 0;
    }
    
    grouped[sensorType].push(convertedSensor);
  });
  
  return grouped;
};

/**
 * 시간 포맷팅
 */
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * 센서 값이 유효한지 확인
 */
export const isSensorValueValid = (sensorData) => {
  if (sensorData.sensor_type === 'particle') {
    return (sensorData.val_0_1 && sensorData.val_0_1 > 0) ||
           (sensorData.val_0_3 && sensorData.val_0_3 > 0) ||
           (sensorData.val_0_5 && sensorData.val_0_5 > 0);
  }
  return sensorData.val && sensorData.val > 0;
};

/**
 * 센서 상태에 따른 우선순위 반환 (알림용)
 */
export const getSensorStatusPriority = (status) => {
  switch (status) {
    case SENSOR_STATUS.RED:
      return 3; // 최고 우선순위
    case SENSOR_STATUS.YELLOW:
      return 2; // 중간 우선순위
    case SENSOR_STATUS.GREEN:
      return 1; // 낮은 우선순위
    default:
      return 0; // 알 수 없음
  }
};
