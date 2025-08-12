// 백엔드 서버 설정 - 환경변수 사용

// 환경변수에서 설정 가져오기
const getEnvVar = (key, defaultValue) => {
  return import.meta.env[key] || defaultValue;
};

// 백엔드 서버 설정
export const BACKEND_CONFIG = {
  // API Gateway (환경변수에서 설정 가져오기)
  API_GATEWAY: {
    baseURL: getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api'),
    target: getEnvVar('VITE_API_GATEWAY_URL', 'http://localhost:8080'),
    healthCheck: '/'
  }
};

// 백엔드 서버 상태 확인 (환경변수에서 설정)
export const BACKEND_HEALTH_CHECK = getEnvVar('VITE_ENABLE_DEBUG_LOGGING', 'true') === 'true';

// API 타임아웃 설정 (환경변수에서 설정)
export const API_TIMEOUT = parseInt(getEnvVar('VITE_API_TIMEOUT', '10000'));

// 현재 사용할 백엔드 설정 (API Gateway만 사용)
export const getCurrentBackendConfig = () => {
  return BACKEND_CONFIG.API_GATEWAY;
};

// 백엔드 서버 상태 확인 함수
export const checkBackendHealth = async (config) => {
  try {
    console.log(`백엔드 서버 연결 확인 시도: ${config.target}`);

    // API Gateway 연결 확인 (간단한 HEAD 요청)
    const response = await fetch(`${config.target}`, {
      method: 'HEAD',
      mode: 'no-cors'
    });

    console.log(`백엔드 서버 연결 성공: ${config.target}`);
    return true;

  } catch (error) {
    console.log(`백엔드 서버 연결 실패: ${config.target}`, error);
    return false;
  }
};

// 사용 가능한 백엔드 설정 반환 (API Gateway만 확인)
export const getAvailableBackendConfig = async () => {
  // API Gateway 연결 확인
  if (await checkBackendHealth(BACKEND_CONFIG.API_GATEWAY)) {
    console.log('API Gateway 사용 가능');
    return BACKEND_CONFIG.API_GATEWAY;
  }

  console.log('API Gateway 연결 불가');
  return null;
};

// 환경변수 설정 정보 출력 (개발용)
export const logEnvironmentConfig = () => {
  if (getEnvVar('VITE_ENABLE_DEBUG_LOGGING', 'false') === 'true') {
    console.log('=== 환경변수 설정 정보 ===');
    console.log('API Gateway URL:', getEnvVar('VITE_API_GATEWAY_URL', 'http://localhost:8080'));
    console.log('API Base Path:', getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api'));
    console.log('Node Environment:', getEnvVar('VITE_NODE_ENV', 'development'));
    console.log('Debug Logging:', getEnvVar('VITE_ENABLE_DEBUG_LOGGING', 'false'));
    console.log('========================');
  }
};
