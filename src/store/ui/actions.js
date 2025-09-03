import { UI_ACTION_TYPES, NotificationType } from './types';

/**
 * UI 액션 크리에이터
 */
export const uiActions = {
  setLoading: (loading) => ({
    type: UI_ACTION_TYPES.SET_LOADING,
    payload: loading,
  }),

  setError: (error) => ({
    type: UI_ACTION_TYPES.SET_ERROR,
    payload: error,
  }),

  addNotification: (notification) => ({
    type: UI_ACTION_TYPES.ADD_NOTIFICATION,
    payload: {
      id: Date.now().toString(),
      type: NotificationType.INFO,
      ...notification,
    },
  }),

  removeNotification: (id) => ({
    type: UI_ACTION_TYPES.REMOVE_NOTIFICATION,
    payload: id,
  }),

  setTheme: (theme) => ({
    type: UI_ACTION_TYPES.SET_THEME,
    payload: theme,
  }),

  toggleSidebar: () => ({
    type: UI_ACTION_TYPES.TOGGLE_SIDEBAR,
  }),

  setSidebarCollapsed: (collapsed) => ({
    type: UI_ACTION_TYPES.SET_SIDEBAR_COLLAPSED,
    payload: collapsed,
  }),
};
