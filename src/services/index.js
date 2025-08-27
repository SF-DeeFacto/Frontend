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
    timeout: 10000, // 10초 타임아웃 추가
  });

  // 요청 인터셉터 - 토큰 자동 추가
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 토큰 만료 시 자동 갱신
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // 401 에러이고 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            console.log('토큰 만료, 자동 갱신 시도...');
            
            const response = await axios.post('/api/auth/refresh', {
              refreshToken: refreshToken
            });
            
            const newAccessToken = response.data.data.access.token;
            localStorage.setItem('access_token', newAccessToken);
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          // 토큰 갱신 실패 시 로그인 페이지로 이동
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
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
  });

  // 요청 인터셉터 - 토큰 자동 추가
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
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

