// 서비스 통합 인덱스
// 모든 API 서비스들을 한 곳에서 관리

// 인증 관련 API
export * from './api/auth';

// 사용자 관련 API
export * from './api/user';

// 대시보드 관련 API
export * from './api/dashboard';

// 구역 관련 API
export * from './api/zone';

// SSE 관련 API
export * from './api/sse';

// API 서비스 객체들
export { authApi } from './api/auth';
export { userApi } from './api/user';
export { dashboardApi } from './api/dashboard';
export { zoneApi } from './api/zone';
export { sseApi } from './api/sse';

// 통합 API 클라이언트
export const apiClient = {
  auth: authApi,
  user: userApi,
  dashboard: dashboardApi,
  zone: zoneApi,
  sse: sseApi
};

// 기본 export
export default apiClient;

// 사용법 예시:
// import { authApi, userApi, zoneApi } from '../services';
// import { apiClient } from '../services';

