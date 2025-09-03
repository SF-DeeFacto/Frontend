/**
 * 기본 API 클라이언트 설정
 * 모든 API 호출의 기반이 되는 설정과 인터셉터
 */

import axios from 'axios';
import { createErrorResponse, ApiErrorType, HttpStatus } from './types';

/**
 * API 클라이언트 팩토리
 */
export const createApiClient = (config = {}) => {
  const client = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 개발 환경에서 요청 로깅
      if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    (response) => {
      // 개발 환경에서 응답 로깅
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 개발 환경에서 에러 로깅
      if (import.meta.env.DEV) {
        console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }

      // 401 에러 처리 (토큰 만료)
      if (error.response?.status === HttpStatus.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            // 토큰 갱신 시도
            const response = await client.post('/auth/refresh', {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            localStorage.setItem('access_token', accessToken);

            // 원래 요청에 새 토큰 적용
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // 리프레시 실패 시 로그아웃
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * 에러 처리 유틸리티
 */
export const handleApiError = (error, context = '') => {
  let errorType = ApiErrorType.UNKNOWN_ERROR;
  let userMessage = '알 수 없는 오류가 발생했습니다.';

  if (error.code === 'ERR_NETWORK') {
    errorType = ApiErrorType.NETWORK_ERROR;
    userMessage = '네트워크 연결을 확인해주세요.';
  } else if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        errorType = ApiErrorType.VALIDATION_ERROR;
        userMessage = error.response.data?.message || '잘못된 요청입니다.';
        break;
      case HttpStatus.UNAUTHORIZED:
        errorType = ApiErrorType.AUTHENTICATION_ERROR;
        userMessage = '인증이 필요합니다. 다시 로그인해주세요.';
        break;
      case HttpStatus.FORBIDDEN:
        errorType = ApiErrorType.AUTHORIZATION_ERROR;
        userMessage = '접근 권한이 없습니다.';
        break;
      case HttpStatus.NOT_FOUND:
        errorType = ApiErrorType.SERVER_ERROR;
        userMessage = '요청한 리소스를 찾을 수 없습니다.';
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
      case HttpStatus.SERVICE_UNAVAILABLE:
        errorType = ApiErrorType.SERVER_ERROR;
        userMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        break;
      default:
        userMessage = error.response.data?.message || '서버 오류가 발생했습니다.';
    }
  }

  const errorResponse = createErrorResponse({
    message: userMessage,
    code: error.code,
    status: error.response?.status,
    context,
  }, errorType);

  // 개발 환경에서 상세 에러 로깅
  if (import.meta.env.DEV) {
    console.error(`🚨 API Error [${context}]:`, errorResponse);
  }

  return {
    ...errorResponse,
    userMessage,
    originalError: error,
  };
};
