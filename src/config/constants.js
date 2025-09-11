/**
 * 애플리케이션 전역 상수 정의
 * 각 섹션별로 논리적으로 그룹화하여 관리
 */

// ==================== 시스템 설정 ====================
export const SYSTEM_CONFIG = {
  // 페이지네이션
  DEFAULT_PAGE_SIZE: 10,
  MAX_VISIBLE_PAGES: 5,
  
  // 타임아웃 및 재시도
  API_TIMEOUT: 30000,
  SSE_MAX_RETRIES: 5,
  SSE_RETRY_DELAY: 3000,
  SSE_HEARTBEAT_TIMEOUT: 120000, // 2분 (일반 SSE용)
  SSE_HEARTBEAT_CHECK_INTERVAL: 60000, // 1분 (일반 SSE용)
  
  // 알림 SSE 전용 설정 (데이터가 없어도 연결 유지)
  NOTIFICATION_SSE_HEARTBEAT_TIMEOUT: 600000, // 10분 (알림 SSE용)
  NOTIFICATION_SSE_HEARTBEAT_CHECK_INTERVAL: 300000, // 5분 (알림 SSE용)
  
  // 폴링 간격
  ALARM_POLLING_INTERVAL: 30000, // 30초
  WEATHER_UPDATE_INTERVAL: 3600000, // 1시간
  
  // UI 설정
  LOADING_SPINNER_DELAY: 200,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 300,
  
  // 차트 새로고침 간격
  CHART_REFRESH_INTERVAL: 30000, // 30초
  CHART_DEFAULT_HEIGHT: 400,
};

// ==================== 사용자 관리 ====================
export const USER_MANAGEMENT = {
  DEPARTMENTS: ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
  POSITIONS: ['사원', '대리', '과장', '차장', '부장', '이사', '대표'],
  ROLES: [
    { value: 'USER', label: '일반 사용자' },
    { value: 'ADMIN', label: '관리자' },
    { value: 'SUPER_ADMIN', label: '최고 관리자' }
  ],
  SCOPES: [
    { value: 'a,b,c', label: '전체구역' },
    { value: 'a', label: 'A구역' },
    { value: 'b', label: 'B구역' },
    { value: 'c', label: 'C구역' }
  ],
  SHIFTS: [
    { value: 'DAY', label: '주간(D)' },
    { value: 'NIGHT', label: '야간(N)' }
  ],
  STATUS: [
    { value: 'ACTIVE', label: '활성', color: 'green' },
    { value: 'INACTIVE', label: '비활성', color: 'gray' },
    { value: 'SUSPENDED', label: '정지', color: 'red' }
  ]
};

// ==================== 알림 설정 ====================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const NOTIFICATION_TYPE_COLORS = {
  [NOTIFICATION_TYPES.SUCCESS]: '#10B981',
  [NOTIFICATION_TYPES.ERROR]: '#EF4444',
  [NOTIFICATION_TYPES.WARNING]: '#F59E0B',
  [NOTIFICATION_TYPES.INFO]: '#3B82F6'
};

// ==================== API 설정 ====================
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile'
  },
  
  // 사용자 관리
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id',
    SEARCH: '/api/users/search'
  },
  
  // 센서 데이터
  SENSORS: {
    DATA: '/api/sensors/data',
    STATUS: '/api/sensors/status',
    HISTORY: '/api/sensors/history'
  },
  
  // 알림
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/:id/read',
    MARK_ALL_READ: '/api/notifications/read-all'
  }
};

// ==================== HTTP 상태 코드 ====================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// ==================== 로컬 스토리지 키 ====================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  ACCESS_TOKEN: 'access_token',  // SSE 연결에서 사용하는 키 추가
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'app_settings'
};

// ==================== 정규식 패턴 ====================
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9-+().\s]+$/,
  EMPLOYEE_ID: /^[A-Za-z0-9]+$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NUMBER_ONLY: /^\d+$/,
  DECIMAL: /^-?\d*(\.\d*)?$/
};

// ==================== 날짜 형식 ====================
export const DATE_FORMATS = {
  DISPLAY: 'YYYY. MM. DD',
  DISPLAY_WITH_TIME: 'YYYY. MM. DD HH:mm:ss',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss'
};

// ==================== 파일 관련 ====================
export const FILE_CONFIG = {
  EXTENSIONS: {
    PDF: '.pdf',
    EXCEL: '.xlsx',
    CSV: '.csv',
    IMAGE: ['.jpg', '.jpeg', '.png', '.gif']
  },
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
};

// ==================== 차트 설정 ====================
export const CHART_CONFIG = {
  TYPES: {
    LINE: 'line',
    BAR: 'bar',
    PIE: 'pie',
    AREA: 'area',
    SCATTER: 'scatter'
  },
  COLORS: [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ],
  DEFAULT_HEIGHT: 400,
  REFRESH_INTERVAL: 30000
};

// ==================== 애니메이션 설정 ====================
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// ==================== 색상 팔레트 ====================
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

// ==================== 기본 내보내기 ====================
export default {
  SYSTEM_CONFIG,
  USER_MANAGEMENT,
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_COLORS,
  API_ENDPOINTS,
  HTTP_STATUS,
  STORAGE_KEYS,
  REGEX_PATTERNS,
  DATE_FORMATS,
  FILE_CONFIG,
  CHART_CONFIG,
  ANIMATION_DURATION,
  COLORS
};