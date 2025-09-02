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
 * 백엔드 센서 데이터를 센서 타입별로 그룹화하고 정렬
 * 백엔드 데이터 구조: { timestamp, sensors: [{ sensorId, sensorType, sensorStatus, timestamp, values }] }
 */
export const groupSensorData = (backendData) => {
  if (!backendData?.data || !Array.isArray(backendData.data)) {
    return {};
  }

  const grouped = {};
  const sensorMap = new Map(); // 센서별 최신 데이터 추적용
  
  // 모든 데이터 포인트의 센서들을 처리
  backendData.data.forEach(dataPoint => {
    if (dataPoint.sensors && Array.isArray(dataPoint.sensors)) {
      dataPoint.sensors.forEach(sensor => {
        const sensorType = sensor.sensorType;
        const sensorId = sensor.sensorId;
        const sensorKey = `${sensorType}_${sensorId}`;
        
        // 센서별 최신 데이터만 유지 (타임스탬프 비교)
        const existingSensor = sensorMap.get(sensorKey);
        const currentTimestamp = new Date(sensor.timestamp).getTime();
        
        if (!existingSensor || new Date(existingSensor.timestamp).getTime() < currentTimestamp) {
          const sensorData = {
            sensorId: sensor.sensorId,
            sensorType: sensor.sensorType,
            sensorStatus: sensor.sensorStatus,
            timestamp: sensor.timestamp,
            values: sensor.values
          };
          
          sensorMap.set(sensorKey, sensorData);
        }
      });
    }
  });
  
  // 센서 타입별로 그룹화하고 타임스탬프 순으로 정렬
  sensorMap.forEach((sensorData, sensorKey) => {
    const sensorType = sensorData.sensorType;
    if (!grouped[sensorType]) {
      grouped[sensorType] = [];
    }
    grouped[sensorType].push(sensorData);
  });
  
  // 각 센서 타입별로 센서 ID 순서대로 정렬 (LPM-001, LPM-002, TEMP-001, TEMP-002...)
  Object.keys(grouped).forEach(sensorType => {
    grouped[sensorType].sort((a, b) => {
      // 센서 ID에서 숫자 부분 추출
      const extractNumber = (sensorId) => {
        const match = sensorId.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      
      const aNumber = extractNumber(a.sensorId);
      const bNumber = extractNumber(b.sensorId);
      
      // 숫자 순서대로 정렬
      return aNumber - bNumber;
    });
  });
  
  console.log('센서 데이터 그룹화 및 정렬 결과:', {
    데이터포인트개수: backendData.data.length,
    총센서개수: sensorMap.size,
    그룹화결과: Object.keys(grouped).map(type => ({
      타입: type,
      개수: grouped[type].length,
      최신타임스탬프: grouped[type][0]?.timestamp
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
 * 센서 데이터 디바운싱을 위한 유틸리티 (스마트 업데이트 포함)
 */
export class SensorDataDebouncer {
  constructor(delay = 1000) {
    this.delay = delay;
    this.timeoutId = null;
    this.lastData = null;
    this.lastProcessedData = null;
    this.callbacks = new Set();
  }

  addCallback(callback) {
    this.callbacks.add(callback);
  }

  removeCallback(callback) {
    this.callbacks.delete(callback);
  }

  update(data) {
    this.lastData = data;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      // 실제로 변경된 데이터만 처리
      const hasChanges = this.hasSignificantChanges(this.lastData);
      
      if (hasChanges) {
        this.callbacks.forEach(callback => {
          try {
            callback(this.lastData, this.lastProcessedData);
          } catch (error) {
            console.error('센서 데이터 디바운싱 콜백 오류:', error);
          }
        });
        this.lastProcessedData = this.lastData;
      } else {
        console.log('🔄 센서 데이터 변경 없음 - UI 업데이트 건너뜀');
      }
    }, this.delay);
  }

  hasSignificantChanges(newData) {
    if (!this.lastProcessedData || !newData) return true;
    
    try {
      const oldGrouped = groupSensorData(this.lastProcessedData);
      const newGrouped = groupSensorData(newData);
      
      // 센서 타입별로 변경 확인
      for (const sensorType of Object.keys(newGrouped)) {
        const oldSensors = oldGrouped[sensorType] || [];
        const newSensors = newGrouped[sensorType] || [];
        
        // 센서 개수가 다르면 변경
        if (oldSensors.length !== newSensors.length) {
          return true;
        }
        
        // 각 센서의 값 변경 확인
        for (let i = 0; i < newSensors.length; i++) {
          const oldSensor = oldSensors[i];
          const newSensor = newSensors[i];
          
          if (hasSensorValueChanged(oldSensor, newSensor)) {
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('센서 데이터 변경 확인 오류:', error);
      return true; // 오류 시 안전하게 업데이트
    }
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.callbacks.clear();
  }
}
