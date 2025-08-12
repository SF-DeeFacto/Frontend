// 백엔드 서버 설정 - 게이트웨이 경로 통일

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
  // API Gateway (게이트웨이 경로만 사용)
  API_GATEWAY: {
    baseURL: getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api'),
    healthCheck: '/health' // 게이트웨이를 통한 헬스체크 (/api/health)
  }
};

// 백엔드 서버 상태 확인 (환경변수에서 설정)
export const BACKEND_HEALTH_CHECK = getEnvVar('VITE_ENABLE_DEBUG_LOGGING', 'true') === 'true';

// API 타임아웃 설정 (환경변수에서 설정)
export const API_TIMEOUT = parseInt(getEnvVar('VITE_API_TIMEOUT', '10000'));

// 현재 사용할 백엔드 설정 (게이트웨이 경로만 사용)
export const getCurrentBackendConfig = () => {
  return BACKEND_CONFIG.API_GATEWAY;
};

// 백엔드 서버 상태 확인 함수 - 게이트웨이를 통한 헬스체크
export const checkBackendHealth = async () => {
  try {
    console.log('게이트웨이를 통한 백엔드 상태 확인 시작...');
    
    // 게이트웨이를 통한 헬스체크 (/api/health)
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5초 타임아웃
    });
    
    if (response.ok) {
      console.log('게이트웨이를 통한 백엔드 연결 성공');
      return true;
    } else {
      console.log(`게이트웨이를 통한 백엔드 응답 오류: ${response.status} ${response.statusText}`);
      return false;
    }
    
  } catch (error) {
    console.log('게이트웨이를 통한 백엔드 연결 확인 실패:', error.message);
    return false;
  }
};

// 사용 가능한 백엔드 설정 반환 (게이트웨이 경로만 사용)
export const getAvailableBackendConfig = async () => {
  // 게이트웨이를 통한 백엔드 연결 확인
  if (await checkBackendHealth()) {
    console.log('게이트웨이를 통한 백엔드 연결 성공');
    return BACKEND_CONFIG.API_GATEWAY;
  }

  console.log('게이트웨이를 통한 백엔드 연결 실패');
  return null;
};

// 환경변수 설정 정보 출력 (개발용)
export const logEnvironmentConfig = () => {
  if (getEnvVar('VITE_ENABLE_DEBUG_LOGGING', 'false') === 'true') {
    console.log('=== 환경변수 설정 정보 ===');
    console.log('API Base Path:', getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api'));
    console.log('Node Environment:', getEnvVar('VITE_NODE_ENV', 'development'));
    console.log('Debug Logging:', getEnvVar('VITE_ENABLE_DEBUG_LOGGING', 'false'));
    console.log('========================');
  }
};
