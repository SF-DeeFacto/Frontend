/**
 * UI 관련 액션 타입
 */
export const UI_ACTION_TYPES = {
  SET_LOADING: 'ui/SET_LOADING',
  SET_ERROR: 'ui/SET_ERROR',
  ADD_NOTIFICATION: 'ui/ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'ui/REMOVE_NOTIFICATION',
  SET_THEME: 'ui/SET_THEME',
  TOGGLE_SIDEBAR: 'ui/TOGGLE_SIDEBAR',
  SET_SIDEBAR_COLLAPSED: 'ui/SET_SIDEBAR_COLLAPSED',
};

/**
 * 테마 타입
 */
export const Theme = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

/**
 * 알림 타입
 */
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
