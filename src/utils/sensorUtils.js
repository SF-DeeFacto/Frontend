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
    // 백엔드에서 오는 원본 센서 타입 사용
    const sensorType = sensor.sensorType || sensor.sensor_type;
    if (!grouped[sensorType]) {
      grouped[sensorType] = [];
    }
    
    // 백엔드 데이터를 그대로 사용
    const convertedSensor = {
      sensor_id: sensor.sensorId || sensor.sensor_id,
      sensor_type: sensorType,
      timestamp: sensor.timestamp,
      status: sensor.sensorStatus || sensor.status || 'normal'
    };

    // 백엔드 values 객체를 그대로 사용
    if (sensor.values) {
      if (sensorType === 'particle') {
        // 먼지 센서: 백엔드에서 오는 값 그대로 사용
        convertedSensor.val_0_1 = parseFloat(sensor.values['0.1']) || 0;
        convertedSensor.val_0_3 = parseFloat(sensor.values['0.3']) || 0;
        convertedSensor.val_0_5 = parseFloat(sensor.values['0.5']) || 0;
      } else {
        // 다른 센서: 백엔드에서 오는 값 그대로 사용
        convertedSensor.val = parseFloat(sensor.values.value || sensor.values) || 0;
      }
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
    // 먼지 센서는 3개 값 중 하나라도 존재하면 유효
    return sensorData.val_0_1 !== undefined && sensorData.val_0_1 !== null ||
           sensorData.val_0_3 !== undefined && sensorData.val_0_3 !== null ||
           sensorData.val_0_5 !== undefined && sensorData.val_0_5 !== null;
  }
  
  // 다른 센서들은 값이 존재하면 유효 (0도 유효한 값)
  return sensorData.val !== undefined && sensorData.val !== null;
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
