/**
 * 애플리케이션 전역 상수 정의
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

// ==================== 비즈니스 도메인 상수 ====================

// 존(Zone) 관련
export const ZONES = {
  ALL: '전체',
  A01: 'A01',
  A02: 'A02', 
  B01: 'B01',
  B02: 'B02',
  B03: 'B03',
  B04: 'B04',
  C01: 'C01',
  C02: 'C02'
};

export const ZONE_LIST = Object.values(ZONES);

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

// 센서 관련
export const SENSORS = {
  TEMPERATURE: '온도',
  HUMIDITY: '습도',
  WIND_DIRECTION: '풍향',
  STATIC_ELECTRICITY: '정전기',
  PARTICLE: '파티클'
};

export const SENSOR_LIST = Object.values(SENSORS);

// 사용자 관리 관련
export const USER_MANAGEMENT = {
  DEPARTMENTS: ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
  POSITIONS: ['사원', '대리', '과장', '차장', '부장', '이사', '대표'],
  ROLES: [
    { value: 'USER', label: '일반 사용자' },
    { value: 'ADMIN', label: '관리자' },
    // { value: 'ROOT', label: '슈퍼 관리자' }
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
  ]
};

// 알림 관련
export const NOTIFICATION_TYPES = {
  ALERT: 'ALERT',
  REPORT: 'REPORT', 
  INFO: 'INFO',
  MAINTENANCE: 'MAINTENANCE',
  SYSTEM: 'SYSTEM',
  SCHEDULE: 'SCHEDULE'
};

export const NOTIFICATION_TYPE_COLORS = {
  [NOTIFICATION_TYPES.ALERT]: 'bg-red-100 text-red-600',
  [NOTIFICATION_TYPES.REPORT]: 'bg-green-100 text-green-600',
  [NOTIFICATION_TYPES.INFO]: 'bg-blue-100 text-blue-600',
  [NOTIFICATION_TYPES.MAINTENANCE]: 'bg-yellow-100 text-yellow-600',
  [NOTIFICATION_TYPES.SYSTEM]: 'bg-purple-100 text-purple-600',
  [NOTIFICATION_TYPES.SCHEDULE]: 'bg-indigo-100 text-indigo-600'
};

// 리포트 관련
export const REPORT_TYPES = {
  ALL: '전체',
  DAILY: '일일 리포트',
  WEEKLY: '주간 리포트',
  MONTHLY: '월간 리포트'
};

export const REPORT_PERIODS = {
  ALL: '전체',
  TODAY: '오늘',
  YESTERDAY: '어제',
  LAST_7_DAYS: '최근 7일',
  LAST_30_DAYS: '최근 30일',
  THIS_MONTH: '이번 달',
  LAST_MONTH: '지난 달',
  CUSTOM: '직접입력'
};

// ==================== UI 상수 ====================

// 색상 관련
export const COLORS = {
  PRIMARY: '#494FA2',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6'
};

// 그라데이션
export const GRADIENTS = {
  PRIMARY: 'bg-gradient-to-r from-primary-500 to-primary-600',
  SUCCESS: 'bg-gradient-to-r from-success-500 to-success-600',
  WARNING: 'bg-gradient-to-r from-warning-500 to-warning-600',
  DANGER: 'bg-gradient-to-r from-danger-500 to-danger-600'
};

// 애니메이션 지속시간
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// ==================== 로컬 스토리지 키 ====================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  EMPLOYEE_ID: 'employeeId',
  USER: 'user',
  UNREAD_ALARM_COUNT: 'unread_alarm_count',
  ERROR_STATS: 'error_stats',
  THEME: 'theme'
};

// ==================== API 관련 ====================
export const API_ENDPOINTS = {
  // 인증
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER_PROFILE: '/user/info/profile',
  
  // 대시보드
  DASHBOARD: '/home/dashboard',
  ZONE_DATA: '/home/zone',
  
  // 알림
  NOTIFICATIONS: '/noti/list',
  NOTIFICATION_COUNT: '/noti/count',
  MARK_READ: '/noti/read',
  MARK_ALL_READ: '/noti/read/all',
  TOGGLE_FAVORITE: '/noti/favorite',
  
  // 센서
  SENSORS: '/home/setting/sensor',
  THRESHOLDS: '/home/setting/sensor/threshold',
  THRESHOLD_UPDATE: '/home/setting/sensor/threshold/update',
  
  // 리포트
  REPORTS_LIST: '/reports/list',
  REPORT_DOWNLOAD: '/reports/download',
  
  // 날씨
  WEATHER: '/weather/current'
};

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// ==================== 차트 관련 ====================
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  DOUGHNUT: 'doughnut',
  PIE: 'pie'
};

export const CHART_COLORS = [
  '#494FA2',
  '#10B981', 
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16'
];

// ==================== 파일 관련 ====================
export const FILE_EXTENSIONS = {
  PDF: '.pdf',
  EXCEL: '.xlsx',
  CSV: '.csv',
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

export default {
  SYSTEM_CONFIG,
  ZONES,
  ZONE_LIST,
  ZONE_MAPPING,
  SENSORS,
  SENSOR_LIST,
  USER_MANAGEMENT,
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_COLORS,
  REPORT_TYPES,
  REPORT_PERIODS,
  COLORS,
  GRADIENTS,
  ANIMATION_DURATION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  HTTP_STATUS,
  CHART_TYPES,
  CHART_COLORS,
  FILE_EXTENSIONS,
  MAX_FILE_SIZE,
  REGEX_PATTERNS,
  DATE_FORMATS
};
