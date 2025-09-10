import { 
  Thermometer, 
  Droplet, 
  Zap, 
  ChartScatter, 
  Wind 
} from 'lucide-react';

// ==================== 상수 정의 ====================

// 센서 상태 타입
export const SENSOR_STATUS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW', 
  RED: 'RED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED'
};

// SENSOR_TYPE은 사용되지 않으므로 제거

// 연결 상태 타입
export const CONNECTION_STATE = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

// ==================== 센서 타입 설정 ====================

// 센서 타입별 상세 정보
export const SENSOR_TYPE_CONFIG = {
  temperature: {
    name: '온도',
    icon: Thermometer,
    unit: '°C',
    patterns: ['TEMP']
  },
  humidity: {
    name: '습도',
    icon: Droplet,
    unit: '%',
    patterns: ['HUM']
  },
  electrostatic: {
    name: '정전기',
    icon: Zap,
    unit: 'V',
    patterns: ['ESD']
  },
  particle: {
    name: '먼지',
    icon: ChartScatter,
    unit: 'μg/m³',
    patterns: ['LPM']
  },
  winddirection: {
    name: '풍향',
    icon: Wind,
    unit: '°',
    patterns: ['WD']
  },
  // 먼지 센서 상세 타입들
  particle_0_1um: {
    name: '먼지 0.1μm',
    icon: ChartScatter,
    unit: 'μg/m³',
    patterns: ['LPM', '0_1um']
  },
  particle_0_3um: {
    name: '먼지 0.3μm',
    icon: ChartScatter,
    unit: 'μg/m³',
    patterns: ['LPM', '0_3um']
  },
  particle_0_5um: {
    name: '먼지 0.5μm',
    icon: ChartScatter,
    unit: 'μg/m³',
    patterns: ['LPM', '0_5um']
  }
};

// 센서 타입 패턴 매핑 (이름 → 타입)
export const SENSOR_TYPE_PATTERNS = Object.entries(SENSOR_TYPE_CONFIG).reduce((acc, [type, config]) => {
  config.patterns.forEach(pattern => {
    acc[pattern] = type;
  });
  return acc;
}, {});

// ==================== 센서 상태 설정 ====================

// 센서 상태별 설정 (색상, 텍스트, 이모지 통합)
const SENSOR_STATUS_CONFIG = {
  [SENSOR_STATUS.GREEN]: {
    hexColor: '#10b981',
    color3D: 0x10b981,
    text: '정상',
    emoji: '🟢',
    tailwindClass: 'bg-green-500',
    priority: 1
  },
  [SENSOR_STATUS.YELLOW]: {
    hexColor: '#f59e0b',
    color3D: 0xf59e0b,
    text: '경고',
    emoji: '🟡',
    tailwindClass: 'bg-yellow-500',
    priority: 2
  },
  [SENSOR_STATUS.RED]: {
    hexColor: '#ef4444',
    color3D: 0xef4444,
    text: '경고',
    emoji: '🔴',
    tailwindClass: 'bg-red-500',
    priority: 3
  },
  [SENSOR_STATUS.CONNECTING]: {
    hexColor: '#3b82f6',
    color3D: 0x3b82f6,
    text: '연결중',
    emoji: '🔵',
    tailwindClass: 'bg-blue-500',
    priority: 0
  },
  [SENSOR_STATUS.DISCONNECTED]: {
    hexColor: '#6b7280',
    color3D: 0x6b7280,
    text: '연결끊김',
    emoji: '⚫',
    tailwindClass: 'bg-gray-500',
    priority: 0
  },
  // 호환성을 위한 별칭
  normal: {
    hexColor: '#10b981',
    color3D: 0x10b981,
    text: '정상',
    emoji: '🟢',
    tailwindClass: 'bg-green-500',
    priority: 1
  },
  warning: {
    hexColor: '#f59e0b',
    color3D: 0xf59e0b,
    text: '경고',
    emoji: '🟡',
    tailwindClass: 'bg-yellow-500',
    priority: 2
  },
  error: {
    hexColor: '#ef4444',
    color3D: 0xef4444,
    text: '오류',
    emoji: '🔴',
    tailwindClass: 'bg-red-500',
    priority: 3
  },
  unknown: {
    hexColor: '#6b7280',
    color3D: 0x6b7280,
    text: '알 수 없음',
    emoji: '⚪',
    tailwindClass: 'bg-gray-500',
    priority: 0
  },
  default: {
    hexColor: '#6b7280',
    color3D: 0x6b7280,
    text: '알 수 없음',
    emoji: '⚪',
    tailwindClass: 'bg-gray-500',
    priority: 0
  }
};

// ==================== 센서 설정 함수들 ====================

// 센서 타입 설정 가져오기
export const getSensorTypeConfig = (type) => {
  return SENSOR_TYPE_CONFIG[type] || null;
};

// 센서 이름으로 타입 분류
export const getSensorTypeFromName = (name) => {
  if (!name) return 'Unknown';
  
  for (const [pattern, type] of Object.entries(SENSOR_TYPE_PATTERNS)) {
    if (name.includes(pattern)) {
      return type;
    }
  }
  return 'Unknown';
};

// 센서 타입 한글명 가져오기 (대소문자 및 다양한 형태 지원)
export const getSensorTypeMapping = (type) => {
  if (!type) return type;
  
  // 대소문자 변환
  const lowerType = type.toLowerCase();
  
  // 직접 매칭 시도
  let config = getSensorTypeConfig(lowerType);
  if (config) return config.name;
  
  // 대문자 매칭 시도
  config = getSensorTypeConfig(type.toUpperCase());
  if (config) return config.name;
  
  // 패턴 매칭 시도 (예: TEMP -> temperature)
  for (const [sensorType, sensorConfig] of Object.entries(SENSOR_TYPE_CONFIG)) {
    if (sensorConfig.patterns.some(pattern => 
      lowerType.includes(pattern.toLowerCase()) || 
      type.toUpperCase().includes(pattern)
    )) {
      return sensorConfig.name;
    }
  }
  
  // 특별한 경우 처리
  if (lowerType.includes('particle') || lowerType.includes('lpm')) {
    // 먼지 센서 상세 타입 처리
    if (lowerType.includes('0_1um') || lowerType.includes('0.1')) {
      return '먼지 0.1μm';
    }
    if (lowerType.includes('0_3um') || lowerType.includes('0.3')) {
      return '먼지 0.3μm';
    }
    if (lowerType.includes('0_5um') || lowerType.includes('0.5')) {
      return '먼지 0.5μm';
    }
    return '먼지';
  }
  if (lowerType.includes('temp')) {
    return '온도';
  }
  if (lowerType.includes('hum') || lowerType.includes('humidity')) {
    return '습도';
  }
  if (lowerType.includes('wind') || lowerType.includes('wd')) {
    return '풍향';
  }
  if (lowerType.includes('esd') || lowerType.includes('electrostatic')) {
    return '정전기';
  }
  
  return type; // 매칭되지 않으면 원본 반환
};

// 센서 상태 설정 가져오기
const getStatusConfig = (status) => {
  return SENSOR_STATUS_CONFIG[status] || SENSOR_STATUS_CONFIG.default;
};

// 센서 상태 색상 가져오기 (HEX)
export const getStatusHexColor = (status) => {
  return getStatusConfig(status).hexColor;
};

// 센서 상태 3D 색상 가져오기 (Three.js용)
export const getStatus3DColor = (status) => {
  return getStatusConfig(status).color3D;
};

// 센서 상태 텍스트 가져오기
export const getStatusText = (status) => {
  return getStatusConfig(status).text;
};

// 센서 상태 이모지 가져오기
export const getStatusEmoji = (status) => {
  return getStatusConfig(status).emoji;
};

// 센서 상태 Tailwind CSS 클래스 가져오기
export const getStatusColor = (status) => {
  return getStatusConfig(status).tailwindClass;
};

// 센서 상태 우선순위 가져오기
export const getSensorStatusPriority = (status) => {
  return getStatusConfig(status).priority;
};

// ==================== 센서 데이터 처리 ====================

// 센서 데이터 검증
export const isValidSensorData = (sensorData) => {
  if (sensorData.sensorType === 'particle') {
    return (sensorData.val_0_1 !== undefined && sensorData.val_0_1 !== null) ||
           (sensorData.val_0_3 !== undefined && sensorData.val_0_3 !== null) ||
           (sensorData.val_0_5 !== undefined && sensorData.val_0_5 !== null);
  }
  return sensorData.val !== undefined && sensorData.val !== null;
};

// 센서 값이 유효한지 확인 (기존 함수명 유지)
export const isSensorValueValid = isValidSensorData;

// 센서 값 변경 확인
export const hasSensorValueChanged = (oldSensor, newSensor) => {
  if (!oldSensor || !newSensor) return true;
  
  if (oldSensor.sensorStatus !== newSensor.sensorStatus) {
    return true;
  }
  
  if (oldSensor.sensorType === 'particle') {
    const oldValues = oldSensor.values || {};
    const newValues = newSensor.values || {};
    
    return (
      oldValues['0.1'] !== newValues['0.1'] ||
      oldValues['0.3'] !== newValues['0.3'] ||
      oldValues['0.5'] !== newValues['0.5']
    );
  } else {
    const oldValue = oldSensor.values?.value;
    const newValue = newSensor.values?.value;
    return oldValue !== newValue;
  }
};

// 백엔드 센서 데이터를 센서 타입별로 그룹화하고 정렬
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
        
        // 기존 센서가 없거나, 현재 센서가 더 최신이거나, 같은 타임스탬프인 경우 업데이트
        if (!existingSensor || 
            new Date(existingSensor.timestamp).getTime() < currentTimestamp ||
            new Date(existingSensor.timestamp).getTime() === currentTimestamp) {
          
          const sensorData = {
            sensorId: sensor.sensorId,
            sensorType: sensor.sensorType,
            status: sensor.sensorStatus,
            timestamp: sensor.timestamp,
            values: sensor.values,
            // 센서 값들을 직접 속성으로 추가
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
  
  // 센서 타입별로 그룹화하고 타임스탬프 순으로 정렬
  sensorMap.forEach((sensorData, sensorKey) => {
    const sensorType = sensorData.sensorType;
    if (!grouped[sensorType]) {
      grouped[sensorType] = [];
    }
    grouped[sensorType].push(sensorData);
  });
  
  // 각 센서 타입별로 센서 ID 순서대로 정렬
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
  
  return grouped;
};


// ==================== Zone 정보 ====================

// Zone 정보 타입
export const ZONE_INFO = {
  A01: { id: 'a01', name: 'Zone A01', zone_name: 'zone_A01' },
  A02: { id: 'a02', name: 'Zone A02', zone_name: 'zone_A02' },
  B01: { id: 'b01', name: 'Zone B01', zone_name: 'zone_B01' },
  B02: { id: 'b02', name: 'Zone B02', zone_name: 'zone_B02' },
  B03: { id: 'b03', name: 'Zone B03', zone_name: 'zone_B03' },
  B04: { id: 'b04', name: 'Zone B04', zone_name: 'zone_B04' },
  C01: { id: 'c01', name: 'Zone C01', zone_name: 'zone_C01' },
  C02: { id: 'c02', name: 'Zone C02', zone_name: 'zone_C02' }
};

// Zone 매핑 (소문자 → 대문자)
export const ZONE_MAPPING = {
  'a01': 'A01',
  'a02': 'A02', 
  'b01': 'B01',
  'b02': 'B02',
  'b03': 'B03',
  'b04': 'B04',
  'c01': 'C01',
  'c02': 'C02'
};

// Zone 상태 키 매핑
export const getZoneStatusKey = (meshName) => {
  const zoneMapping = {
    'a01': 'zone_A01',
    'a02': 'zone_A02',
    'b01': 'zone_B01', 
    'b02': 'zone_B02',
    'b03': 'zone_B03',
    'b04': 'zone_B04',
    'c01': 'zone_C01',
    'c02': 'zone_C02',
    'A01': 'zone_A01',
    'A02': 'zone_A02',
    'B01': 'zone_B01', 
    'B02': 'zone_B02',
    'B03': 'zone_B03',
    'B04': 'zone_B04',
    'C01': 'zone_C01',
    'C02': 'zone_C02'
  };
  return zoneMapping[meshName];
};

// 모델 경로 생성
export const getModelPath = (zoneId) => {
  return `/models/${zoneId.toUpperCase()}-meshopt.glb`;
};

// ==================== 센서 데이터 찾기 ====================

// 센서 데이터에서 meshName에 해당하는 센서 찾기
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

// ==================== 3D 센서 함수 ====================

// 센서 Mesh의 AABB 정보 계산 (Three.js용)
export const calculateMeshBounds = (mesh) => {
  const THREE = require('three');
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

// 센서 인디케이터 위치 계산 (Three.js용)
export const calculateIndicatorPosition = (bounds, offset = 0.2) => {
  const [centerX, centerY, centerZ] = bounds.center;
  const [maxX, maxY, maxZ] = bounds.boxMax;
  
  return [
    centerX,
    maxY + offset, // 메쉬 표면 위에 약간 올림
    centerZ
  ];
};

// GLB 모델에서 센서 메쉬들을 찾고 위치 정보 계산 (Three.js용)
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

// 모델의 전체 크기와 중심점 계산 (Three.js용)
export const calculateModelBounds = (scene) => {
  const THREE = require('three');
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

// ==================== UI 관련 ====================

// 센서 타입 배열 (실시간 데이터용) - 기본 타입만
export const SENSOR_TYPES = [
  { type: 'temperature', name: '온도', icon: Thermometer },
  { type: 'humidity', name: '습도', icon: Droplet },
  { type: 'electrostatic', name: '정전기', icon: Zap },
  { type: 'particle', name: '먼지', icon: ChartScatter },
  { type: 'winddirection', name: '풍향', icon: Wind }
];


// 센서 타입 목록 (UI 필터용) - 중복 제거
export const SENSOR_TYPES_FOR_FILTER = [
  'all',
  'temperature', 
  'humidity', 
  'electrostatic', 
  'particle',
  'winddirection'
];

// 시간 포맷팅
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// ==================== 호환성을 위한 별칭 ====================

// 기존 코드와의 호환성을 위한 별칭들
export const SENSOR_STATUS_HEX_COLORS = Object.fromEntries(
  Object.entries(SENSOR_STATUS_CONFIG).map(([key, config]) => [key, config.hexColor])
);

export const SENSOR_STATUS_3D_COLORS = Object.fromEntries(
  Object.entries(SENSOR_STATUS_CONFIG).map(([key, config]) => [key, config.color3D])
);

export const SENSOR_STATUS_TEXT = Object.fromEntries(
  Object.entries(SENSOR_STATUS_CONFIG).map(([key, config]) => [key, config.text])
);

export const SENSOR_TYPE_MAPPING = Object.fromEntries(
  Object.entries(SENSOR_TYPE_CONFIG).map(([key, config]) => [key, config.name])
);