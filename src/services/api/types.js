/**
 * API 응답 타입 정의
 */

// 공통 API 응답 구조
export const ApiResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
};

// HTTP 상태 코드
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// 에러 타입
export const ApiErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// 사용자 역할
export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  VIEWER: 'VIEWER',
};

/**
 * API 응답 인터페이스
 */
export const createApiResponse = (data, message = '', status = ApiResponseStatus.SUCCESS) => ({
  data,
  message,
  status,
  timestamp: new Date().toISOString(),
});

/**
 * 에러 응답 인터페이스
 */
export const createErrorResponse = (error, type = ApiErrorType.UNKNOWN_ERROR) => ({
  error: {
    type,
    message: error.message || '알 수 없는 오류가 발생했습니다.',
    code: error.code || 'UNKNOWN',
    status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  },
  status: ApiResponseStatus.ERROR,
  timestamp: new Date().toISOString(),
});
