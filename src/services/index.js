// 프록시 설정
import axios from "axios";
import { connectMainSSE, connectZoneSSE, SSE_URLS } from './sse';

// 사용자 인증용 API 클라이언트 생성 함수 (UserService - 포트 8081)
const createAuthApiClient = () => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // 프록시를 통해 요청
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000, // 30초 타임아웃으로 증가 (백엔드 응답 지연 대응)
  });

  // 요청 인터셉터 - 토큰 자동 추가
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 요청 시작 시간 기록
      config.metadata = { startTime: new Date() };
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 401 에러 처리
  apiClient.interceptors.response.use(
    (response) => {
      // 응답 시간 계산
      const endTime = new Date();
      const startTime = response.config.metadata?.startTime;
      const duration = startTime ? endTime - startTime : '알 수 없음';
      
      console.log(`✅ API 응답 성공: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log(`⏱️ 응답 시간: ${duration}ms`);
      console.log(`📊 응답 상태: ${response.status} ${response.statusText}`);
      
      return response;
    },
    async (error) => {
      // 응답 시간 계산 (에러인 경우에도)
      const endTime = new Date();
      const startTime = error.config?.metadata?.startTime;
      const duration = startTime ? endTime - startTime : '알 수 없음';
      
      console.error(`❌ API 응답 실패: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error(`⏱️ 요청 지속 시간: ${duration}ms`);
      console.error(`🔍 에러 상세 정보:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        timeout: error.code === 'ECONNABORTED' ? '타임아웃 발생' : '타임아웃 아님',
        networkError: error.code === 'ERR_NETWORK' ? '네트워크 오류' : '네트워크 정상'
      });
      
      const originalRequest = error.config;
      
      // 401 에러이고 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        // 에러 코드 확인 (토큰 만료인지 구분)
        const errorCode = error.response?.data?.code;
        const isTokenExpired = errorCode === 'TOKEN_EXPIRED_401';
        
        if (!isTokenExpired) {
          // 토큰 만료가 아닌 다른 401 에러인 경우 바로 로그아웃
          console.log('🔐 인증 오류 (토큰 만료 아님). 로그아웃 처리합니다.');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        originalRequest._retry = true;
        
        console.log('🔐 토큰 만료, 자동 갱신 시도...');
        
        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            console.log('토큰 만료, 자동 갱신 시도...');
            
            const response = await axios.post('/api/auth/refresh', {
              refreshToken: refreshToken
            }, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            // 응답 구조 확인 및 안전한 토큰 추출
            console.log('리프레시 토큰 응답:', response.data);
            
            let newAccessToken;
            if (response.data.access && response.data.access.token) {
              newAccessToken = response.data.access.token;
            } else if (response.data.token) {
              newAccessToken = response.data.token;
            } else if (response.data.data && response.data.data.access && response.data.data.access.token) {
              newAccessToken = response.data.data.access.token;
            } else {
              throw new Error('응답에서 액세스 토큰을 찾을 수 없습니다.');
            }
            
            localStorage.setItem('access_token', newAccessToken);
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          
          // 리프레시 토큰도 만료된 경우 로그아웃 처리
          if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            const refreshErrorCode = refreshError.response?.data?.code;
            console.log('리프레시 토큰 갱신 실패:', refreshErrorCode || '알 수 없는 오류');
            console.log('리프레시 토큰도 만료되었습니다. 로그아웃 처리합니다.');
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
          
          // 네트워크 오류 등 기타 오류의 경우 원래 에러 반환
          return Promise.reject(error);
        }
        
        // 리프레시 토큰이 없는 경우 로그인 페이지로 이동
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// 대시보드용 API 클라이언트 생성 함수 (Dashboard 백엔드 - 포트 8083)
const createDashboardApiClient = () => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_DASHBOARD_API_BASE_URL || "/dashboard-api",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000, // 30초 타임아웃 추가 (일관성 유지)
  });

  // 요청 인터셉터 - 토큰 자동 추가
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 요청 시작 시간 기록
      config.metadata = { startTime: new Date() };
      console.log(`🚀 Dashboard API 요청 시작: ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`📊 Dashboard 요청 설정:`, {
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: config.headers
      });
      
      return config;
    },
    (error) => {
      console.error('❌ Dashboard API 요청 인터셉터 오류:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 추가
  apiClient.interceptors.response.use(
    (response) => {
      // 응답 시간 계산
      const endTime = new Date();
      const startTime = response.config.metadata?.startTime;
      const duration = startTime ? endTime - startTime : '알 수 없음';
      
      console.log(`✅ Dashboard API 응답 성공: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log(`⏱️ Dashboard 응답 시간: ${duration}ms`);
      console.log(`📊 Dashboard 응답 상태: ${response.status} ${response.statusText}`);
      
      return response;
    },
    async (error) => {
      // 응답 시간 계산 (에러인 경우에도)
      const endTime = new Date();
      const startTime = error.config?.metadata?.startTime;
      const duration = startTime ? endTime - startTime : '알 수 없음';
      
      console.error(`❌ Dashboard API 응답 실패: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error(`⏱️ Dashboard 요청 지속 시간: ${duration}ms`);
      console.error(`🔍 Dashboard 에러 상세 정보:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        timeout: error.code === 'ECONNABORTED' ? '타임아웃 발생' : '타임아웃 아님',
        networkError: error.code === 'ERR_NETWORK' ? '네트워크 오류' : '네트워크 정상'
      });
      
      const originalRequest = error.config;
      
      // 401 에러이고 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        console.log('🔐 Dashboard API 토큰 만료, 자동 갱신 시도...');
        
        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            console.log('Dashboard API 토큰 만료, 자동 갱신 시도...');
            
            const response = await axios.post('/api/auth/refresh', refreshToken, {
              headers: {
                'Content-Type': 'text/plain',
                'Authorization': `Bearer ${refreshToken}`
              }
            });
            
            const newAccessToken = response.data.access.token;
            localStorage.setItem('access_token', newAccessToken);
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Dashboard API 토큰 갱신 실패:', refreshError);
          
          // 리프레시 토큰도 만료된 경우 로그아웃 처리
          if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            console.log('리프레시 토큰도 만료되었습니다. 로그아웃 처리합니다.');
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
          
          // 네트워크 오류 등 기타 오류의 경우 원래 에러 반환
          return Promise.reject(error);
        }
        
        // 리프레시 토큰이 없는 경우 로그인 페이지로 이동
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// 기본 API 클라이언트 인스턴스 (인증용 - UserService)
const authApiClient = createAuthApiClient();

// 대시보드용 API 클라이언트 인스턴스 (Dashboard 백엔드)
const dashboardApiClient = createDashboardApiClient();

// 편의 함수들
export const apiGet = async (url, config = {}) => {
  return authApiClient.get(url, config);
};

export const apiPost = async (url, data = {}, config = {}) => {
  return authApiClient.post(url, data, config);
};

export const apiPut = async (url, data = {}, config = {}) => {
  return authApiClient.put(url, data, config);
};

export const apiDelete = async (url, config = {}) => {
  return authApiClient.delete(url, config);
};

export default authApiClient;
export { authApiClient, createAuthApiClient, createDashboardApiClient, dashboardApiClient, connectMainSSE, connectZoneSSE, SSE_URLS };

// 아래 설정 자꾸 오류 남. 
// 배포할 때는 아래 처럼 바꾸고 02처럼 서버 프록시 설정을 해줘야함. 
// 지금은 일단은 백엔드에 크로스코드 임시로 넣어둠...
//01
// const apiClient = axios.create({
//   baseURL: "/api", // 프록시를 통해 백엔드로 요청
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000, // 10초 타임아웃 추가
// });

//02
// server: {
//   proxy: {
//     '/api': {
//       target: 'http://localhost:8081',
//       changeOrigin: true
//     }
//   }
// }

