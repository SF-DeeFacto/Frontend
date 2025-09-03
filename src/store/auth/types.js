/**
 * 인증 관련 액션 타입
 */
export const AUTH_ACTION_TYPES = {
  SET_USER: 'auth/SET_USER',
  SET_AUTHENTICATED: 'auth/SET_AUTHENTICATED',
  SET_LOADING: 'auth/SET_LOADING',
  SET_ERROR: 'auth/SET_ERROR',
  CLEAR_AUTH: 'auth/CLEAR_AUTH',
};

/**
 * 인증 상태 타입 정의
 */
export const AuthStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
};
