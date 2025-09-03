import { AUTH_ACTION_TYPES } from './types';

/**
 * 인증 액션 크리에이터
 */
export const authActions = {
  setUser: (user) => ({
    type: AUTH_ACTION_TYPES.SET_USER,
    payload: user,
  }),

  setAuthenticated: (isAuthenticated) => ({
    type: AUTH_ACTION_TYPES.SET_AUTHENTICATED,
    payload: isAuthenticated,
  }),

  setLoading: (loading) => ({
    type: AUTH_ACTION_TYPES.SET_LOADING,
    payload: loading,
  }),

  setError: (error) => ({
    type: AUTH_ACTION_TYPES.SET_ERROR,
    payload: error,
  }),

  clearAuth: () => ({
    type: AUTH_ACTION_TYPES.CLEAR_AUTH,
  }),
};
