/**
 * 색상 통합 관리 설정 파일
 * 모든 색상을 중앙에서 관리하여 일관성 확보
 */

// ==================== 브랜드 색상 ====================
export const BRAND_COLORS = {
  PRIMARY: '#494FA2',
  PRIMARY_LIGHT: '#3d4291',
  PRIMARY_DARK: '#323680',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6',
  NEUTRAL: '#9CA3AF'
};

// ==================== 센서 상태 색상 (통합) ====================
export const SENSOR_STATUS_COLORS = {
  // 센서 데이터 상태 (API 연결 시)
  GREEN: '#10b981',    // 안전 (초록)
  YELLOW: '#f59e0b',   // 경고 (노랑)  
  RED: '#ef4444',      // 위험 (빨강)
  
  // 연결 안됨 (API 연결 안됨)
  DISCONNECTED: '#6b7280',  // 연결 안됨 (회색)
  UNKNOWN: '#6b7280',       // 알수없음 (회색)
  DEFAULT: '#6b7280',       // 기본값 (회색)
  
  // 기존 호환성을 위한 별칭
  normal: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  connecting: '#6b7280',
  connected: '#6b7280'
};

// ==================== 연결 상태 색상 (단순화) ====================
export const CONNECTION_STATUS_COLORS = {
  CONNECTED: '#6b7280',     // 연결됨 (회색) - 실제로는 센서 데이터 색상 사용
  DISCONNECTED: '#6b7280'   // 연결 안됨 (회색)
};

// ==================== UI 색상 ====================
export const UI_COLORS = {
  // 배경 색상
  BACKGROUND: {
    PRIMARY: '#fafafa',
    SECONDARY: '#ffffff',
    DARK: '#1f2937',
    DARK_SECONDARY: '#374151'
  },
  
  // 텍스트 색상
  TEXT: {
    PRIMARY: '#1f2937',
    SECONDARY: '#6b7280',
    MUTED: '#9ca3af',
    WHITE: '#ffffff'
  },
  
  // 테두리 색상
  BORDER: {
    LIGHT: '#e5e7eb',
    MEDIUM: '#d1d5db',
    DARK: '#6b7280'
  },
  
  // 그라데이션
  GRADIENT: {
    PRIMARY: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    DARK: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    PATTERN: `
      linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
    `
  }
};

// ==================== 3D 모델 색상 (Three.js용) ====================
export const THREE_JS_COLORS = {
  GREEN: 0x10b981,    // 안전 (초록)
  YELLOW: 0xf59e0b,   // 경고 (노랑)
  RED: 0xef4444,      // 위험 (빨강)
  GRAY: 0x6b7280,     // 연결 상태 (회색)
  DARK_GRAY: 0x9ca3af, // 기본값 (어두운 회색)
  
  // 기존 호환성을 위한 별칭
  normal: 0x10b981,
  warning: 0xf59e0b,
  error: 0xef4444,
  connecting: 0x6b7280,
  connected: 0x6b7280,
  unknown: 0x6b7280,
  default: 0x6b7280
};

// 센서 상태별 3D 색상 (통합)
export const SENSOR_STATUS_3D_COLORS = {
  // 센서 상태 상수
  GREEN: THREE_JS_COLORS.GREEN,
  YELLOW: THREE_JS_COLORS.YELLOW,
  RED: THREE_JS_COLORS.RED,
  CONNECTING: THREE_JS_COLORS.GRAY,
  DISCONNECTED: THREE_JS_COLORS.GRAY,
  
  // 기존 호환성
  normal: THREE_JS_COLORS.normal,
  warning: THREE_JS_COLORS.warning,
  error: THREE_JS_COLORS.error,
  connecting: THREE_JS_COLORS.connecting,
  connected: THREE_JS_COLORS.connected,
  unknown: THREE_JS_COLORS.unknown,
  default: THREE_JS_COLORS.default
};

// ==================== 차트 색상 ====================
export const CHART_COLORS = [
  BRAND_COLORS.PRIMARY,
  BRAND_COLORS.SUCCESS,
  BRAND_COLORS.WARNING,
  BRAND_COLORS.DANGER,
  BRAND_COLORS.INFO,
  '#8B5CF6', // 보라색
  '#06B6D4', // 청록색
  '#84CC16'  // 라임색
];

// ==================== 그라데이션 ====================
export const GRADIENTS = {
  PRIMARY: 'bg-gradient-to-r from-primary-500 to-primary-600',
  SUCCESS: 'bg-gradient-to-r from-success-500 to-success-600',
  WARNING: 'bg-gradient-to-r from-warning-500 to-warning-600',
  DANGER: 'bg-gradient-to-r from-danger-500 to-danger-600'
};

// ==================== 색상 유틸리티 함수 ====================
export const ColorUtils = {
  // 연결 상태 색상 가져오기
  getConnectionStatusColor: (status) => {
    return CONNECTION_STATUS_COLORS[status] || CONNECTION_STATUS_COLORS.DISCONNECTED;
  },

  // 브랜드 색상 가져오기
  getBrandColor: (variant = 'PRIMARY') => {
    return BRAND_COLORS[variant] || BRAND_COLORS.PRIMARY;
  },

  // 3D 모델용 색상 가져오기
  getThreeJSColor: (colorName) => {
    return THREE_JS_COLORS[colorName] || THREE_JS_COLORS.GRAY;
  },

  // 센서 상태 3D 색상 가져오기
  getSensorStatus3DColor: (status) => {
    return SENSOR_STATUS_3D_COLORS[status] || SENSOR_STATUS_3D_COLORS.default;
  },

  // 센서 상태 HEX 색상 가져오기
  getSensorStatusColor: (status) => {
    return SENSOR_STATUS_COLORS[status] || SENSOR_STATUS_COLORS.DEFAULT;
  },

  // HEX 색상을 Three.js 색상으로 변환
  hexToThreeJS: (hexColor) => {
    return parseInt(hexColor.replace('#', '0x'));
  }
};

// ==================== 기존 호환성 ====================
// 기존 코드와의 호환성을 위한 export
export const COLORS = BRAND_COLORS;
export const CONNECTION_STATUS_HEX_COLORS = CONNECTION_STATUS_COLORS;

export default {
  BRAND_COLORS,
  SENSOR_STATUS_COLORS,
  SENSOR_STATUS_3D_COLORS,
  CONNECTION_STATUS_COLORS,
  UI_COLORS,
  THREE_JS_COLORS,
  CHART_COLORS,
  GRADIENTS,
  ColorUtils,
  // 기존 호환성
  COLORS,
  CONNECTION_STATUS_HEX_COLORS
};
