import { 
  Thermometer, 
  Droplet, 
  Zap, 
  ChartScatter, 
  Wind 
} from 'lucide-react';
import { SENSOR_STATUS_COLORS, THREE_JS_COLORS } from './colorConfig';

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

// 센서 타입별 상세 정보 (통합 관리)
export const SENSOR_TYPE_CONFIG = {
  temperature: {
    name: '온도',
    icon: Thermometer,
    unit: '°C',
    patterns: ['TEMP'] // 3D 모델에서 인식할 패턴
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
  }
};

// 센서 상태별 색상은 colorConfig.js에서 관리

// 센서 상태별 3D 색상 (Three.js용) - colorConfig에서 가져오기
export const SENSOR_STATUS_3D_COLORS = {
  [SENSOR_STATUS.GREEN]: THREE_JS_COLORS.GREEN,
  [SENSOR_STATUS.YELLOW]: THREE_JS_COLORS.YELLOW,
  [SENSOR_STATUS.RED]: THREE_JS_COLORS.RED,
  [SENSOR_STATUS.CONNECTING]: THREE_JS_COLORS.GRAY,
  [SENSOR_STATUS.DISCONNECTED]: THREE_JS_COLORS.GRAY,
  normal: THREE_JS_COLORS.GREEN,
  warning: THREE_JS_COLORS.YELLOW,
  error: THREE_JS_COLORS.RED,
  unknown: THREE_JS_COLORS.GRAY,
  default: THREE_JS_COLORS.GRAY
};

// 센서 상태별 텍스트
export const SENSOR_STATUS_TEXT = {
  [SENSOR_STATUS.GREEN]: '정상',
  [SENSOR_STATUS.YELLOW]: '경고',
  [SENSOR_STATUS.RED]: '위험',
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
