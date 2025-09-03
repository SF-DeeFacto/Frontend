import { UI_ACTION_TYPES, Theme } from './types';

/**
 * UI 초기 상태
 */
export const initialUIState = {
  loading: false,
  error: null,
  notifications: [],
  theme: Theme.LIGHT,
  sidebarCollapsed: false,
};

/**
 * UI 리듀서
 */
export const uiReducer = (state = initialUIState, action) => {
  switch (action.type) {
    case UI_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case UI_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case UI_ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case UI_ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };

    case UI_ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case UI_ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };

    case UI_ACTION_TYPES.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload,
      };

    default:
      return state;
  }
};
