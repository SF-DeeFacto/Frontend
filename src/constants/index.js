/**
 * 애플리케이션 전역 상수 정의
 */

// 스토리지 키 상수
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  EMPLOYEE_ID: 'employeeId',
  UNREAD_ALARM_COUNT: 'unread_alarm_count',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

// Zone 관련 상수
export const ZONES = {
  A01: 'a01',
  A02: 'a02',
  B01: 'b01',
  B02: 'b02',
  B03: 'b03',
  B04: 'b04',
  C01: 'c01',
  C02: 'c02',
};

export const ZONE_LABELS = {
  a01: 'A01',
  a02: 'A02',
  b01: 'B01',
  b02: 'B02',
  b03: 'B03',
  b04: 'B04',
  c01: 'C01',
  c02: 'C02',
};

// Zone 경로 생성 유틸리티
export const getZonePath = (zoneId) => `/home/zone/${zoneId}`;

// API 관련 상수
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: '/notifications/mark-read',
  },
  SENSORS: {
    DATA: '/sensors/data',
    STATUS: '/sensors/status',
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    ZONES: '/dashboard/zones',
  },
};

// 폴링 간격 상수 (밀리초)
export const POLLING_INTERVALS = {
  ALARM: 30000,      // 30초
  SENSOR: 5000,      // 5초
  ZONE_STATUS: 10000, // 10초
};

// 페이지네이션 상수
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  ALARM_PAGE_SIZE: 7,
  MAX_VISIBLE_PAGES: 5,
};

// 테마 관련 상수
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// 센서 상태 상수
export const SENSOR_STATUS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED',
  UNKNOWN: 'UNKNOWN',
};

// 알림 타입 상수
export const ALARM_TYPES = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  PRESSURE: 'pressure',
  PARTICLE: 'particle',
  SYSTEM: 'system',
};

// 알림 상태 상수
export const ALARM_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  FAVORITE: 'favorite',
};

// 연결 상태 상수
export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  ERROR: 'error',
};

// 사용자 역할 상수
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
};

// 기본 설정값
export const DEFAULT_SETTINGS = {
  LANGUAGE: 'ko',
  TIMEZONE: 'Asia/Seoul',
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm:ss',
};

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  AUTH_FAILED: '인증에 실패했습니다. 다시 로그인해주세요.',
  PERMISSION_DENIED: '접근 권한이 없습니다.',
  DATA_LOAD_FAILED: '데이터를 불러오는데 실패했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

// 성공 메시지 상수
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인에 성공했습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  SAVE_SUCCESS: '저장되었습니다.',
  UPDATE_SUCCESS: '업데이트되었습니다.',
  DELETE_SUCCESS: '삭제되었습니다.',
};