/**
 * SSE 설정 관리
 * 모든 SSE 관련 설정을 중앙에서 관리
 */

// 환경별 설정
const ENV_CONFIG = {
  development: {
    // 개발용 프록시를 통한 연결
    main: "/dashboard-api/home/status",
    zone: (zoneId) => `/dashboard-api/home/zone?zoneId=${zoneId}`,
    apiBase: "http://localhost:8080",
    dashboardApi: "http://localhost:8083"
  },
  production: {
    // 운영용 gateway 사용
    main: "/home/status",
    zone: (zoneId) => `/home/zone?zoneId=${zoneId}`,
    apiBase: "https://api.example.com",
    dashboardApi: "https://dashboard.example.com"
  }
};

// 현재 환경 설정
const currentEnv = import.meta.env.MODE || 'development';
const envConfig = ENV_CONFIG[currentEnv];

// SSE 기본 설정
export const SSE_CONFIG = {
  // 재연결 설정
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  RECONNECT_DELAY: 5000,
  
  // 하트비트 설정
  HEARTBEAT_INTERVAL: 30000, // 30초
  CONNECTION_TIMEOUT: 60000, // 1분
  
  // 연결 설정
  WITH_CREDENTIALS: true,
  HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // URL 설정
  URLS: {
    main: envConfig.main,
    zone: envConfig.zone,
    apiBase: envConfig.apiBase,
    dashboardApi: envConfig.dashboardApi
  },
  
  // 환경 정보
  ENVIRONMENT: currentEnv,
  IS_DEVELOPMENT: currentEnv === 'development',
  IS_PRODUCTION: currentEnv === 'production'
};

// SSE 이벤트 타입
export const SSE_EVENT_TYPES = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  ERROR: 'error',
  RECONNECT: 'reconnect',
  HEARTBEAT: 'heartbeat'
};

// SSE 연결 상태
export const SSE_CONNECTION_STATES = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  RECONNECTING: 'reconnecting'
};

// SSE 에러 타입
export const SSE_ERROR_TYPES = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  TIMEOUT: 'timeout',
  PARSE: 'parse',
  UNKNOWN: 'unknown'
};

// SSE 로깅 설정
export const SSE_LOGGING = {
  ENABLED: true,
  LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
  SHOW_TIMESTAMP: true,
  SHOW_CONNECTION_STATE: true,
  SHOW_DATA_SAMPLE: true,
  MAX_LOG_LENGTH: 1000
};

// 설정 유효성 검사
export const validateSSEConfig = () => {
  const errors = [];
  
  if (!SSE_CONFIG.URLS.main) {
    errors.push('메인 SSE URL이 설정되지 않았습니다.');
  }
  
  if (!SSE_CONFIG.URLS.zone) {
    errors.push('존 SSE URL 함수가 설정되지 않았습니다.');
  }
  
  if (SSE_CONFIG.RETRY_ATTEMPTS < 1) {
    errors.push('재시도 횟수는 1 이상이어야 합니다.');
  }
  
  if (SSE_CONFIG.HEARTBEAT_INTERVAL < 1000) {
    errors.push('하트비트 간격은 1초 이상이어야 합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 설정 정보 출력 (개발용)
export const logSSEConfig = () => {
  if (SSE_LOGGING.ENABLED && SSE_LOGGING.LEVEL === 'debug') {
    console.log('🔧 SSE 설정 정보:', {
      환경: SSE_CONFIG.ENVIRONMENT,
      URLS: SSE_CONFIG.URLS,
      재연결설정: {
        최대시도: SSE_CONFIG.RETRY_ATTEMPTS,
        재시도간격: `${SSE_CONFIG.RETRY_DELAY}ms`,
        재연결간격: `${SSE_CONFIG.RECONNECT_DELAY}ms`
      },
      하트비트설정: {
        간격: `${SSE_CONFIG.HEARTBEAT_INTERVAL}ms`,
        타임아웃: `${SSE_CONFIG.CONNECTION_TIMEOUT}ms`
      }
    });
  }
};

// 초기 설정 검증
const configValidation = validateSSEConfig();
if (!configValidation.isValid) {
  console.error('❌ SSE 설정 오류:', configValidation.errors);
}

// 설정 로깅
logSSEConfig();
