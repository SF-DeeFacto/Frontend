// 백엔드 서버 설정 - 환경변수 사용

// 환경변수에서 설정 가져오기
const getEnvVar = (key, defaultValue) => {
  // Vite 환경변수 우선 확인
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // process.env 확인 (vite.config.js define에서 설정된 값)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  return defaultValue;
};

// 백엔드 서버 설정
export const BACKEND_CONFIG = {
  // API Gateway (환경변수에서 설정 가져오기)
  API_GATEWAY: {
    baseURL: getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api'),
    target: getEnvVar('VITE_API_GATEWAY_URL', 'http://localhost:8080'),
    healthCheck: '/api/health' // API Gateway 헬스체크 엔드포인트
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

// 백엔드 서버 상태 확인 함수 - 실제 API 호출로 확인
export const checkBackendHealth = async (config) => {
  try {
    console.log(`백엔드 서버 연결 확인 시도: ${config.target}${config.healthCheck}`);
    
    // 실제 API 호출로 연결 확인
    const response = await fetch(`${config.target}${config.healthCheck}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5초 타임아웃
    });
    
    if (response.ok) {
      console.log(`백엔드 서버 연결 성공: ${config.target}${config.healthCheck}`);
      return true;
    } else {
      console.log(`백엔드 서버 응답 오류: ${response.status} ${response.statusText}`);
      return false;
    }
    
  } catch (error) {
    console.log(`백엔드 서버 연결 확인 실패: ${config.target}${config.healthCheck}`, error.message);
    
    // 간단한 ping 시도 (CORS 우회)
    try {
      const pingResponse = await fetch(`${config.target}/`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(3000) // 3초 타임아웃
      });
      
      console.log(`백엔드 서버 ping 성공: ${config.target}/`);
      return true;
      
    } catch (pingError) {
      console.log(`백엔드 서버 ping 실패: ${config.target}/`, pingError.message);
      return false;
    }
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
