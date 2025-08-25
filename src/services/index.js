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

