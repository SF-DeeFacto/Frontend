/**
 * API 클라이언트 서비스
 * 새로운 base.js 구조를 사용한 리팩토링된 버전
 */

import { createApiClient } from './api/base';
import { connectMainSSE, connectZoneSSE, SSE_URLS } from './sse';

// 사용자 인증용 API 클라이언트 (UserService)
const createAuthApiClient = () => {
  return createApiClient({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 30000,
  });
};

// 대시보드용 API 클라이언트 (Dashboard 백엔드)
const createDashboardApiClient = () => {
  return createApiClient({
    baseURL: import.meta.env.VITE_DASHBOARD_API_BASE_URL || "/dashboard-api",
    timeout: 30000,
  });
};

// 클라이언트 인스턴스 생성
const authApiClient = createAuthApiClient();
const dashboardApiClient = createDashboardApiClient();

// 편의 함수들 - 리팩토링된 에러 처리 포함
export const apiGet = async (url, config = {}) => {
  try {
    return await authApiClient.get(url, config);
  } catch (error) {
    throw error; // base.js의 handleApiError에서 처리됨
  }
};

export const apiPost = async (url, data = {}, config = {}) => {
  try {
    return await authApiClient.post(url, data, config);
  } catch (error) {
    throw error;
  }
};

export const apiPut = async (url, data = {}, config = {}) => {
  try {
    return await authApiClient.put(url, data, config);
  } catch (error) {
    throw error;
  }
};

export const apiDelete = async (url, config = {}) => {
  try {
    return await authApiClient.delete(url, config);
  } catch (error) {
    throw error;
  }
};

// Exports
export default authApiClient;
export { 
  authApiClient, 
  dashboardApiClient,
  createAuthApiClient, 
  createDashboardApiClient, 
  connectMainSSE, 
  connectZoneSSE, 
  SSE_URLS 
};

