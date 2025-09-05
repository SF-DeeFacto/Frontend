import { 
  Thermometer, 
  Droplet, 
  Zap, 
  ChartScatter, 
  Wind 
} from 'lucide-react';

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

// 센서 관련 함수들은 sensorUtils.js로 이동
