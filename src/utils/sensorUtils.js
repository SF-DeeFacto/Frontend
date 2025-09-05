import { SENSOR_STATUS, SENSOR_STATUS_TEXT, SENSOR_TYPE_CONFIG } from '../config/sensorConfig';
import { SENSOR_STATUS_COLORS, SENSOR_STATUS_3D_COLORS } from '../config/colorConfig';

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

// 시간 포맷팅은 dateUtils.js로 이동됨

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

// ==================== 센서 설정 관련 함수들 ====================

// 센서 설정 가져오기
export const getSensorTypeConfig = (type) => {
  return SENSOR_TYPE_CONFIG[type] || null;
};

// 센서 이름으로 센서 타입 분류 (3D 모델용)
export const getSensorTypeFromName = (sensorName) => {
  for (const [type, config] of Object.entries(SENSOR_TYPE_CONFIG)) {
    if (config.patterns) {
      for (const pattern of config.patterns) {
        if (sensorName.includes(pattern)) {
          return type;
        }
      }
    }
  }
  return 'unknown';
};

// 센서 타입으로 표시명 가져오기 (UI용)
export const getSensorTypeDisplayName = (sensorType) => {
  const config = SENSOR_TYPE_CONFIG[sensorType];
  return config ? config.name : '알 수 없음';
};

// 센서 이름으로 센서 타입 표시명 가져오기 (3D 모델용)
export const getSensorTypeDisplayNameFromName = (sensorName) => {
  const sensorType = getSensorTypeFromName(sensorName);
  return getSensorTypeDisplayName(sensorType);
};

// 센서가 유효한 센서인지 확인 (3D 모델용)
export const isValidSensor = (sensorName) => {
  return getSensorTypeFromName(sensorName) !== 'unknown';
};

// 센서 상태 3D 색상 가져오기 (Three.js용)
export const getStatus3DColor = (status) => {
  return SENSOR_STATUS_3D_COLORS[status] || SENSOR_STATUS_3D_COLORS.default;
};

// ==================== Three.js 관련 센서 함수들 ====================

/**
 * 센서 Mesh의 AABB 정보 계산
 * @param {THREE.Object3D} mesh - 대상 메쉬
 * @returns {Object} AABB 정보 (box, size, center, boxMax)
 */
export const calculateMeshBounds = (mesh) => {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  
  box.getSize(size);
  box.getCenter(center);
  
  return {
    box,
    size: [size.x, size.y, size.z],
    center: [center.x, center.y, center.z],
    boxMax: [box.max.x, box.max.y, box.max.z]
  };
};

/**
 * 센서 인디케이터 위치 계산
 * @param {Object} bounds - calculateMeshBounds 결과
 * @param {number} offset - 메쉬 표면에서의 오프셋 (기본값: 0.2)
 * @returns {Array} [x, y, z] 위치 좌표
 */
export const calculateIndicatorPosition = (bounds, offset = 0.2) => {
  const [centerX, centerY, centerZ] = bounds.center;
  const [maxX, maxY, maxZ] = bounds.boxMax;
  
  return [
    centerX,
    maxY + offset, // 메쉬 표면 위에 약간 올림
    centerZ
  ];
};

/**
 * S01부터 S55까지의 센서 ID 배열 생성
 * @returns {Array} 센서 ID 배열
 */
export const generateSensorIds = () => {
  const sensorIds = [];
  for (let i = 1; i <= 55; i++) {
    sensorIds.push(`S${i.toString().padStart(2, '0')}`);
  }
  return sensorIds;
};

/**
 * GLB 모델에서 센서 메쉬들을 찾고 위치 정보 계산
 * @param {THREE.Scene} scene - GLB 모델의 scene
 * @param {string} zoneId - Zone ID (로깅용)
 * @returns {Object} 발견된 센서들의 위치 정보
 */
export const findAndCalculateSensorPositions = (scene, zoneId) => {
  const foundSensors = {};
  const sensorIds = generateSensorIds();
  
  sensorIds.forEach(meshName => {
    const target = scene.getObjectByName(meshName);
    
    if (target) {
      // 메쉬의 AABB 구하기
      const bounds = calculateMeshBounds(target);
      
      // 센서 인디케이터 위치 계산
      const indicatorPosition = calculateIndicatorPosition(bounds);
      
      // 센서 정보 저장
      foundSensors[meshName] = {
        mesh: target,
        position: indicatorPosition,
        center: bounds.center,
        size: bounds.size,
        boxMax: bounds.boxMax
      };
    }
  });
  
  return foundSensors;
};

/**
 * 센서 데이터에서 meshName에 해당하는 센서 찾기
 * @param {string} meshName - 찾을 메쉬 이름
 * @param {Object} sensorData - 센서 데이터 객체
 * @returns {Object|null} 찾은 센서 데이터
 */
export const findSensorDataByMeshName = (meshName, sensorData) => {
  if (!sensorData) return null;
  
  // sensorData는 센서 타입별로 그룹화되어 있음
  // 모든 센서 타입에서 해당 meshName을 가진 센서 찾기
  for (const sensorType in sensorData) {
    const sensorsOfType = sensorData[sensorType];
    const foundSensor = sensorsOfType.find(sensor => 
      sensor.sensor_id === meshName || 
      sensor.sensor_id.toLowerCase() === meshName.toLowerCase()
    );
    
    if (foundSensor) {
      return {
        sensorId: foundSensor.sensor_id,
        sensorType: foundSensor.sensor_type,
        sensorStatus: foundSensor.status,
        timestamp: foundSensor.timestamp,
        values: foundSensor.sensor_type === 'particle' 
          ? { '0.1': foundSensor.val_0_1, '0.3': foundSensor.val_0_3, '0.5': foundSensor.val_0_5 }
          : { value: foundSensor.val }
      };
    }
  }
  
  return null;
};

/**
 * 모델의 전체 크기와 중심점 계산
 * @param {THREE.Scene} scene - GLB 모델의 scene
 * @returns {Object} 모델 크기 정보
 */
export const calculateModelBounds = (scene) => {
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = new THREE.Vector3();
  box.getSize(size);
  
  return {
    box,
    center: [center.x, center.y, center.z],
    size: [size.x, size.y, size.z],
    maxDimension: Math.max(size.x, size.y, size.z)
  };
};