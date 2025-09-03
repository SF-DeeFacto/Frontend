import { AUTH_ACTION_TYPES, AuthStatus } from './types';

/**
 * 인증 초기 상태
 */
export const initialAuthState = {
  user: null,
  isAuthenticated: false,
  status: AuthStatus.IDLE,
  error: null,
};

/**
 * 인증 리듀서
 */
export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        status: action.payload ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
        error: null,
      };

    case AUTH_ACTION_TYPES.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
        status: action.payload ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
      };

    case AUTH_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        status: action.payload ? AuthStatus.LOADING : AuthStatus.IDLE,
      };

    case AUTH_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        status: AuthStatus.ERROR,
      };

    case AUTH_ACTION_TYPES.CLEAR_AUTH:
      return {
        ...initialAuthState,
        status: AuthStatus.UNAUTHENTICATED,
      };

    default:
      return state;
  }
};
