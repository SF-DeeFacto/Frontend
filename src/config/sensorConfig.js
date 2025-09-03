import { SENSOR_STATUS } from '../types/sensor';

// 센서 타입별 상세 정보
export const SENSOR_TYPE_CONFIG = {
  temperature: {
    name: '온도',
    icon: '🌡️',
    unit: '°C',
    color: '#ff6b6b',
    description: '온도 센서'
  },
  humidity: {
    name: '습도',
    icon: '💧',
    unit: '%',
    color: '#4ecdc4',
    description: '습도 센서'
  },
  esd: {
    name: '정전기',
    icon: '⚡',
    unit: 'V',
    color: '#feca57',
    description: '정전기 센서'
  },
  particle: {
    name: '먼지',
    icon: '🌫️',
    unit: 'μg/m³',
    color: '#96ceb4',
    description: '먼지 센서'
  },
  windDir: {
    name: '풍향',
    icon: '🌪️',
    unit: '°',
    color: '#45b7d1',
    description: '풍향 센서'
  }
};

// 센서 상태별 색상 (Tailwind CSS 클래스)
export const SENSOR_STATUS_COLORS = {
  [SENSOR_STATUS.GREEN]: 'bg-green-500',
  [SENSOR_STATUS.YELLOW]: 'bg-yellow-500',
  [SENSOR_STATUS.RED]: 'bg-red-500',
  [SENSOR_STATUS.CONNECTING]: 'bg-blue-500',
  [SENSOR_STATUS.DISCONNECTED]: 'bg-gray-500',
  default: 'bg-gray-500'
};

// 센서 상태별 색상 (HEX 값 - 3D 렌더링용)
export const SENSOR_STATUS_HEX_COLORS = {
  [SENSOR_STATUS.GREEN]: '#10b981',
  [SENSOR_STATUS.YELLOW]: '#f59e0b',
  [SENSOR_STATUS.RED]: '#ef4444',
  [SENSOR_STATUS.CONNECTING]: '#3b82f6',
  [SENSOR_STATUS.DISCONNECTED]: '#6b7280',
  default: '#6b7280'
};

// 센서 상태별 색상 (3D Three.js용 숫자 형태)
export const SENSOR_STATUS_3D_COLORS = {
  [SENSOR_STATUS.GREEN]: 0x10b981,
  [SENSOR_STATUS.YELLOW]: 0xf59e0b,
  [SENSOR_STATUS.RED]: 0xef4444,
  [SENSOR_STATUS.CONNECTING]: 0x3b82f6,
  [SENSOR_STATUS.DISCONNECTED]: 0x6b7280,
  default: 0x6b7280
};

// 센서 상태별 이모지
export const SENSOR_STATUS_EMOJIS = {
  [SENSOR_STATUS.GREEN]: '🟢',
  [SENSOR_STATUS.YELLOW]: '🟡',
  [SENSOR_STATUS.RED]: '🔴',
  [SENSOR_STATUS.CONNECTING]: '🔵',
  [SENSOR_STATUS.DISCONNECTED]: '⚪',
  default: '⚪'
};

// 센서 상태별 텍스트
export const SENSOR_STATUS_TEXT = {
  [SENSOR_STATUS.GREEN]: '정상',
  [SENSOR_STATUS.YELLOW]: '주의',
  [SENSOR_STATUS.RED]: '경고',
  [SENSOR_STATUS.CONNECTING]: '연결중',
  [SENSOR_STATUS.DISCONNECTED]: '연결끊김',
  default: '알 수 없음'
};

// 센서 타입 배열 (UI 렌더링용)
export const SENSOR_TYPES = Object.entries(SENSOR_TYPE_CONFIG).map(([type, config]) => ({
  type,
  name: config.name
}));

// 센서 타입별 색상 (3D 렌더링용)
export const SENSOR_TYPE_COLORS = Object.fromEntries(
  Object.entries(SENSOR_TYPE_CONFIG).map(([type, config]) => [type, config.color])
);

// 센서 설정 가져오기
export const getSensorTypeConfig = (type) => {
  return SENSOR_TYPE_CONFIG[type] || null;
};

// 센서 상태 색상 가져오기 (Tailwind CSS)
export const getStatusColor = (status) => {
  return SENSOR_STATUS_COLORS[status] || SENSOR_STATUS_COLORS.default;
};

// 센서 상태 색상 가져오기 (HEX)
export const getStatusHexColor = (status) => {
  return SENSOR_STATUS_HEX_COLORS[status] || SENSOR_STATUS_HEX_COLORS.default;
};

// 센서 상태 이모지 가져오기
export const getStatusEmoji = (status) => {
  return SENSOR_STATUS_EMOJIS[status] || SENSOR_STATUS_EMOJIS.default;
};

// 센서 상태 텍스트 가져오기
export const getStatusText = (status) => {
  return SENSOR_STATUS_TEXT[status] || SENSOR_STATUS_TEXT.default;
};

// 센서 상태 3D 색상 가져오기 (Three.js용)
export const getStatus3DColor = (status) => {
  return SENSOR_STATUS_3D_COLORS[status] || SENSOR_STATUS_3D_COLORS.default;
};

// 상태별 한글 설명 반환
export const getStatusDescription = (status) => {
  switch (status?.toUpperCase()) {
    case 'GREEN':
    case 'NORMAL':
      return '정상';
    case 'YELLOW':
    case 'WARNING':
      return '경고';
    case 'RED':
    case 'ERROR':
      return '오류';
    case 'CONNECTING':
      return '연결중';
    case 'DISCONNECTED':
      return '연결끊김';
    default:
      return '알 수 없음';
  }
};
