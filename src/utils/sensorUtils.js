import { SENSOR_STATUS } from '../types/sensor';
import { 
  getStatusColor as getStatusColorFromConfig,
  getStatusEmoji as getStatusEmojiFromConfig,
  getStatusText as getStatusTextFromConfig
} from '../config/sensorConfig';

// 센서 상태별 색상 매핑 (기존 호환성 유지)
export const SENSOR_STATUS_COLORS = {
  [SENSOR_STATUS.GREEN]: 'bg-green-500',
  [SENSOR_STATUS.YELLOW]: 'bg-yellow-500',
  [SENSOR_STATUS.RED]: 'bg-red-500',
  [SENSOR_STATUS.CONNECTING]: 'bg-blue-500',
  [SENSOR_STATUS.DISCONNECTED]: 'bg-gray-500',
  default: 'bg-gray-500'
};

// 센서 상태별 이모지 매핑 (기존 호환성 유지)
export const SENSOR_STATUS_EMOJIS = {
  [SENSOR_STATUS.GREEN]: '🟢',
  [SENSOR_STATUS.YELLOW]: '🟡',
  [SENSOR_STATUS.RED]: '🔴',
  [SENSOR_STATUS.CONNECTING]: '🔵',
  [SENSOR_STATUS.DISCONNECTED]: '⚪',
  default: '⚪'
};

// 센서 상태별 텍스트 매핑 (기존 호환성 유지)
export const SENSOR_STATUS_TEXT = {
  [SENSOR_STATUS.GREEN]: '정상',
  [SENSOR_STATUS.YELLOW]: '주의',
  [SENSOR_STATUS.RED]: '경고',
  [SENSOR_STATUS.CONNECTING]: '연결중',
  [SENSOR_STATUS.DISCONNECTED]: '연결끊김',
  default: '알 수 없음'
};

/**
 * 센서 상태에 따른 색상 반환 (새로운 통합 설정 사용)
 */
export const getStatusColor = (status) => {
  return getStatusColorFromConfig(status);
};

/**
 * 센서 상태에 따른 이모지 반환 (새로운 통합 설정 사용)
 */
export const getStatusEmoji = (status) => {
  return getStatusEmojiFromConfig(status);
};

/**
 * 센서 상태에 따른 텍스트 반환 (새로운 통합 설정 사용)
 */
export const getStatusText = (status) => {
  return getStatusTextFromConfig(status);
};

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
