import { 
  Thermometer, 
  Droplet, 
  Zap, 
  ChartScatter, 
  Wind 
} from 'lucide-react';

// ==================== 센서 상태 타입 정의 ====================

// 센서 상태 타입
export const SENSOR_STATUS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW', 
  RED: 'RED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED'
};

// 센서 타입
export const SENSOR_TYPE = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  ELECTROSTATIC: 'electrostatic',
  PARTICLE: 'particle',
  WINDDIRECTION: 'winddirection'
};

// 연결 상태 타입
export const CONNECTION_STATE = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

// ==================== 센서 타입별 상세 정보 ====================

// 센서 타입별 상세 정보
export const SENSOR_TYPE_CONFIG = {
  temperature: {
    name: '온도',
    icon: Thermometer,
    unit: '°C'
  },
  humidity: {
    name: '습도',
    icon: Droplet,
    unit: '%'
  },
  electrostatic: {
    name: '정전기',
    icon: Zap,
    unit: 'V'
  },
  particle: {
    name: '먼지',
    icon: ChartScatter,
    unit: 'μg/m³'
  },
  winddirection: {
    name: '풍향',
    icon: Wind,
    unit: '°'
  }
};

// ==================== 센서 상태별 색상 ====================

// 센서 상태별 색상 (HEX 값)
export const SENSOR_STATUS_HEX_COLORS = {
  [SENSOR_STATUS.GREEN]: '#10b981',
  [SENSOR_STATUS.YELLOW]: '#f59e0b',
  [SENSOR_STATUS.RED]: '#ef4444',
  [SENSOR_STATUS.CONNECTING]: '#3b82f6',
  [SENSOR_STATUS.DISCONNECTED]: '#6b7280',
  normal: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  unknown: '#6b7280',
  default: '#6b7280'
};

// 센서 상태별 색상 (3D Three.js용 숫자 형태)
export const SENSOR_STATUS_3D_COLORS = {
  [SENSOR_STATUS.GREEN]: 0x10b981,
  [SENSOR_STATUS.YELLOW]: 0xf59e0b,
  [SENSOR_STATUS.RED]: 0xef4444,
  [SENSOR_STATUS.CONNECTING]: 0x3b82f6,
  [SENSOR_STATUS.DISCONNECTED]: 0x6b7280,
  normal: 0x10b981,
  warning: 0xf59e0b,
  error: 0xef4444,
  unknown: 0x6b7280,
  default: 0x6b7280
};

// 센서 상태별 텍스트
export const SENSOR_STATUS_TEXT = {
  [SENSOR_STATUS.GREEN]: '정상',
  [SENSOR_STATUS.YELLOW]: '경고',
  [SENSOR_STATUS.RED]: '경고',
  [SENSOR_STATUS.CONNECTING]: '연결중',
  [SENSOR_STATUS.DISCONNECTED]: '연결끊김',
  normal: '정상',
  warning: '경고',
  error: '오류',
  unknown: '알 수 없음',
  default: '알 수 없음'
};

// 센서 타입 배열 (UI 렌더링용)
export const SENSOR_TYPES = Object.entries(SENSOR_TYPE_CONFIG).map(([type, config]) => ({
  type,
  name: config.name,
  icon: config.icon
}));

// ==================== 센서 설정 함수들 ====================

// 센서 설정 가져오기
export const getSensorTypeConfig = (type) => {
  return SENSOR_TYPE_CONFIG[type] || null;
};

// 센서 상태 색상 가져오기 (HEX)
export const getStatusHexColor = (status) => {
  return SENSOR_STATUS_HEX_COLORS[status] || SENSOR_STATUS_HEX_COLORS.default;
};

// 센서 상태 텍스트 가져오기
export const getStatusText = (status) => {
  return SENSOR_STATUS_TEXT[status] || SENSOR_STATUS_TEXT.default;
};

// 센서 상태 3D 색상 가져오기 (Three.js용)
export const getStatus3DColor = (status) => {
  return SENSOR_STATUS_3D_COLORS[status] || SENSOR_STATUS_3D_COLORS.default;
};

// ==================== 센서 타입 분류 통합 ====================

// 센서 타입 패턴 정의
export const SENSOR_TYPE_PATTERNS = {
  ESD: ['ESD'],
  HUMIDITY: ['HUM'], 
  WIND: ['WD'],
  TEMPERATURE: ['TEMP'],
  PARTICLE: ['LPM'],
  HANDLE: ['Handle']
};

// 센서 이름으로 타입 분류하는 통합 함수
export const getSensorTypeFromName = (name) => {
  if (!name) return 'Unknown';
  
  for (const [type, patterns] of Object.entries(SENSOR_TYPE_PATTERNS)) {
    if (patterns.some(pattern => name.includes(pattern))) {
      return type;
    }
  }
  return 'Unknown';
};

// 센서 타입 매핑 (한글명)
export const SENSOR_TYPE_MAPPING = {
  'electrostatic': '정전기',
  'temperature': '온도',
  'humidity': '습도', 
  'particle': '먼지',
  'particle_0_1um': '미세먼지 0.1μm',
  'particle_0_3um': '미세먼지 0.3μm',
  'particle_0_5um': '미세먼지 0.5μm',
  'winddirection': '풍향'
};

// 센서 타입 매핑 함수
export const getSensorTypeMapping = (type) => {
  return SENSOR_TYPE_MAPPING[type] || type;
};

// 센서 타입 목록 (UI 필터용)
export const SENSOR_TYPES_FOR_FILTER = [
  'all',
  'temperature', 
  'humidity', 
  'electrostatic', 
  'particle_0_1um', 
  'particle_0_3um', 
  'particle_0_5um', 
  'winddirection'
];

// Particle 센서 타입 상세 배열 (UI에서 사용)
export const PARTICLE_SENSOR_TYPES = [
  'particle_0_1um',
  'particle_0_3um', 
  'particle_0_5um'
];

// Particle 센서 타입별 한글 매핑 (UI에서 사용)
export const PARTICLE_SENSOR_MAPPING = {
  'particle_0_1um': '미세먼지 0.1μm',
  'particle_0_3um': '미세먼지 0.3μm',
  'particle_0_5um': '미세먼지 0.5μm'
};

// ==================== 센서 ID 생성 통합 ====================

// 센서 ID 생성 설정
export const SENSOR_ID_CONFIG = {
  MAX_COUNT: 55,
  ID_PREFIX: 'S'
};

// 센서 ID 배열 생성 함수
export const generateSensorIds = () => {
  const ids = [];
  for (let i = 1; i <= SENSOR_ID_CONFIG.MAX_COUNT; i++) {
    ids.push(`${SENSOR_ID_CONFIG.ID_PREFIX}${i.toString().padStart(2, '0')}`);
  }
  return ids;
};

// 센서 패턴 배열 (3D 모델용)
export const SENSOR_PATTERNS = ['ESD', 'LPM', 'HUM', 'WD', 'TEMP'];

// ==================== 센서 유틸리티 함수 통합 ====================

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

// 센서 상태 우선순위
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

// ==================== Zone 정보 통합 ====================

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
    'a01': 'zone_A',
    'a02': 'zone_A02',
    'b01': 'zone_B', 
    'b02': 'zone_B02',
    'b03': 'zone_B03',
    'b04': 'zone_B04',
    'c01': 'zone_C01',
    'c02': 'zone_C02',
    'A01': 'zone_A',
    'A02': 'zone_A02',
    'B01': 'zone_B', 
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

// ==================== 센서 UI 유틸리티 통합 ====================

// 센서 상태에 따른 Tailwind CSS 색상 클래스 반환
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

// 센서 상태에 따른 이모지 반환
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

// 시간 포맷팅
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// ==================== 센서 데이터 처리 통합 ====================

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

// ==================== 센서 데이터 디바운싱 통합 ====================

// 센서 데이터 디바운싱을 위한 유틸리티 클래스
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
        try {
          this.callback(data);
        } catch (error) {
          console.error('센서 데이터 디바운싱 콜백 오류:', error);
        }
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

// ==================== 센서 데이터 찾기 통합 ====================

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

// ==================== 3D 센서 함수 통합 ====================

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