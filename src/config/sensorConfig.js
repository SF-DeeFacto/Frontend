import { SENSOR_STATUS } from '../types/sensor';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  ChartScatter, 
  Wind 
} from 'lucide-react';

// 센서 타입별 상세 정보
export const SENSOR_TYPE_CONFIG = {
  temperature: {
    name: '온도',
    icon: Thermometer,
    unit: '°C'
  },
  humidity: {
    name: '습도',
    icon: Droplets,
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
