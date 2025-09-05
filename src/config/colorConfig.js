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
  DEFAULT: '#6b7280'        // 기본값 (회색)
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
  DARK_GRAY: 0x9ca3af // 기본값 (어두운 회색)
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
  }
};

// ==================== 기존 호환성 ====================
// 기존 코드와의 호환성을 위한 export
export const COLORS = BRAND_COLORS;
export const CONNECTION_STATUS_HEX_COLORS = CONNECTION_STATUS_COLORS;

export default {
  BRAND_COLORS,
  SENSOR_STATUS_COLORS,
  CONNECTION_STATUS_COLORS,
  UI_COLORS,
  THREE_JS_COLORS,
  ColorUtils,
  // 기존 호환성
  COLORS,
  CONNECTION_STATUS_HEX_COLORS
};
