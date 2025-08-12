// 공통 API 클라이언트
// 개발: Vite 프록시 사용 (/api → http://localhost:8080)
// 운영: 리버스 프록시 사용 (/api → https://api.example.com)

import axios from 'axios';

// 환경별 설정
const isDevelopment = import.meta.env.DEV;

// API 기본 URL 설정
// 개발/운영 모두 /api 사용 (프록시가 실제 백엔드로 전달)
const API_BASE_URL = '/api';

// 공통 API 클라이언트 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (isDevelopment) {
      console.log('API 요청:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log('API 응답:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error('API 오류:', error.response?.status, error.config?.url, error.message);
    }
    
    // 401 에러 시 토큰 제거
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    
    return Promise.reject(error);
  }
);

export default api;
