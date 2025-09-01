import { SENSOR_STATUS } from '../types/sensor';
import { getStatusHexColor, getStatusText } from '../config/sensorConfig';

// getStatusText와 getStatusHexColor를 재-export
export { getStatusText, getStatusHexColor };

/**
 * 센서 상태에 따른 Tailwind CSS 색상 클래스 반환
 */
export const getStatusColor = (status) => {
  switch (status) {
    case SENSOR_STATUS.GREEN:
      return 'bg-green-500';
    case SENSOR_STATUS.YELLOW:
      return 'bg-yellow-500';
    case SENSOR_STATUS.RED:
      return 'bg-red-500';
    case SENSOR_STATUS.CONNECTING:
      return 'bg-blue-500';
    case SENSOR_STATUS.DISCONNECTED:
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * 센서 상태에 따른 이모지 반환
 */
export const getStatusEmoji = (status) => {
  switch (status) {
    case SENSOR_STATUS.GREEN:
      return '🟢';
    case SENSOR_STATUS.YELLOW:
      return '🟡';
    case SENSOR_STATUS.RED:
      return '🔴';
    case SENSOR_STATUS.CONNECTING:
      return '🔵';
    case SENSOR_STATUS.DISCONNECTED:
      return '⚫';
    default:
      return '⚪';
  }
};

/**
 * 백엔드 센서 데이터를 센서 타입별로 그룹화
 * 백엔드 데이터 구조: { timestamp, sensors: [{ sensorId, sensorType, sensorStatus, timestamp, values }] }
 */
export const groupSensorData = (backendData) => {
  if (!backendData?.data || !Array.isArray(backendData.data)) {
    return {};
  }

  const grouped = {};
  
  // 모든 데이터 포인트의 센서들을 처리
  backendData.data.forEach(dataPoint => {
    if (dataPoint.sensors && Array.isArray(dataPoint.sensors)) {
      dataPoint.sensors.forEach(sensor => {
        // 백엔드 데이터 구조 그대로 사용
        const sensorType = sensor.sensorType;
        if (!grouped[sensorType]) {
          grouped[sensorType] = [];
        }
        
        // 센서 데이터를 그대로 추가 (변환 없음)
        grouped[sensorType].push({
          sensorId: sensor.sensorId,
          sensorType: sensor.sensorType,
          sensorStatus: sensor.sensorStatus,
          timestamp: sensor.timestamp,
          values: sensor.values
        });
      });
    }
  });
  
  console.log('센서 데이터 그룹화 결과:', {
    데이터포인트개수: backendData.data.length,
    그룹화결과: Object.keys(grouped).map(type => ({
      타입: type,
      개수: grouped[type].length
    })),
    timestamp: new Date().toLocaleTimeString()
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
  if (sensorData.sensorType === 'particle') {
    // 먼지 센서는 3개 값 중 하나라도 존재하면 유효
    return sensorData.values?.['0.1'] !== undefined && sensorData.values?.['0.1'] !== null ||
           sensorData.values?.['0.3'] !== undefined && sensorData.values?.['0.3'] !== null ||
           sensorData.values?.['0.5'] !== undefined && sensorData.values?.['0.5'] !== null;
  }
  
  // 다른 센서들은 값이 존재하면 유효 (0도 유효한 값)
  return sensorData.values?.value !== undefined && sensorData.values?.value !== null;
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
