import { SENSOR_STATUS, SENSOR_STATUS_TEXT } from '../config/sensorConfig';
import { SENSOR_STATUS_COLORS } from '../config/colorConfig';

// 센서 상태 HEX 색상 가져오기
export const getStatusHexColor = (status) => {
  const statusMap = {
    'normal': 'GREEN',
    'warning': 'YELLOW', 
    'error': 'RED',
    'GREEN': 'GREEN',
    'YELLOW': 'YELLOW',
    'RED': 'RED',
    'CONNECTING': 'DISCONNECTED',
    'CONNECTED': 'DISCONNECTED',
    'DISCONNECTED': 'DISCONNECTED',
    'unknown': 'UNKNOWN'
  };
  
  const mappedStatus = statusMap[status] || status;
  return SENSOR_STATUS_COLORS[mappedStatus] || SENSOR_STATUS_COLORS.DEFAULT;
};

// 센서 상태 텍스트 가져오기
export const getStatusText = (status) => {
  return SENSOR_STATUS_TEXT[status] || SENSOR_STATUS_TEXT.default;
};

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
      return 'bg-gray-500';
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
      return '⚫';
    case SENSOR_STATUS.DISCONNECTED:
      return '⚫';
    default:
      return '⚪';
  }
};

/**
 * 백엔드 센서 데이터를 센서 타입별로 그룹화하고 정렬
 */
export const groupSensorData = (backendData) => {
  if (!backendData?.data || !Array.isArray(backendData.data)) {
    return {};
  }

  const grouped = {};
  const sensorMap = new Map();
  
  backendData.data.forEach(dataPoint => {
    if (dataPoint.sensors && Array.isArray(dataPoint.sensors)) {
      dataPoint.sensors.forEach(sensor => {
        const sensorType = sensor.sensorType;
        const sensorId = sensor.sensorId;
        const sensorKey = `${sensorType}_${sensorId}`;
        
        const existingSensor = sensorMap.get(sensorKey);
        const currentTimestamp = new Date(sensor.timestamp).getTime();
        
        if (!existingSensor || 
            new Date(existingSensor.timestamp).getTime() <= currentTimestamp) {
          
          const sensorData = {
            sensorId: sensor.sensorId,
            sensorType: sensor.sensorType,
            status: sensor.sensorStatus,
            timestamp: sensor.timestamp,
            values: sensor.values,
            val: sensor.values?.value,
            val_0_1: sensor.values?.['0.1'],
            val_0_3: sensor.values?.['0.3'],
            val_0_5: sensor.values?.['0.5']
          };
          
          sensorMap.set(sensorKey, sensorData);
        }
      });
    }
  });
  
  sensorMap.forEach((sensorData) => {
    const sensorType = sensorData.sensorType;
    if (!grouped[sensorType]) {
      grouped[sensorType] = [];
    }
    grouped[sensorType].push(sensorData);
  });
  
  // 센서 ID 순서대로 정렬
  Object.keys(grouped).forEach(sensorType => {
    grouped[sensorType].sort((a, b) => {
      const extractNumber = (sensorId) => {
        const match = sensorId.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return extractNumber(a.sensorId) - extractNumber(b.sensorId);
    });
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
    return (sensorData.val_0_1 !== undefined && sensorData.val_0_1 !== null) ||
           (sensorData.val_0_3 !== undefined && sensorData.val_0_3 !== null) ||
           (sensorData.val_0_5 !== undefined && sensorData.val_0_5 !== null);
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

/**
 * 센서 값이 실제로 변경되었는지 확인하는 함수
 */
export const hasSensorValueChanged = (oldSensor, newSensor) => {
  if (!oldSensor || !newSensor) return true;
  
  // 센서 상태 변경 확인
  if (oldSensor.sensorStatus !== newSensor.sensorStatus) {
    return true;
  }
  
  // 센서 값 변경 확인
  if (oldSensor.sensorType === 'particle') {
    // 먼지 센서는 3개 값 모두 확인
    const oldValues = oldSensor.values || {};
    const newValues = newSensor.values || {};
    
    return (
      oldValues['0.1'] !== newValues['0.1'] ||
      oldValues['0.3'] !== newValues['0.3'] ||
      oldValues['0.5'] !== newValues['0.5']
    );
  } else {
    // 다른 센서들은 value 값 확인
    const oldValue = oldSensor.values?.value;
    const newValue = newSensor.values?.value;
    
    return oldValue !== newValue;
  }
};

/**
 * 센서 데이터 디바운싱을 위한 유틸리티
 */
export class SensorDataDebouncer {
  constructor(delay = 300) {
    this.delay = delay;
    this.timeoutId = null;
    this.callback = null;
  }

  addCallback(callback) {
    this.callback = callback;
  }

  update(data) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      if (this.callback) {
        this.callback(data);
      }
    }, this.delay);
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.callback = null;
  }
}
