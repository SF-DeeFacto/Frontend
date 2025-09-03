/**
 * 전역 상태 관리 시스템
 * Context API와 useReducer를 사용한 중앙화된 상태 관리
 */

import React, { createContext, useContext, useReducer } from 'react';

// 전역 상태 초기값
const initialState = {
  // 인증 상태 (AuthContext에서 관리)
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  
  // Zone 상태
  zones: {
    zoneStatuses: {},
    connectionStates: {},
    lastUpdated: {},
    zones: []
  },
  
  // 센서 데이터
  sensors: {
    data: {},
    loading: false,
    error: null,
    lastUpdated: null
  },
  
  // 알림 상태
  alarms: {
    alarms: [],
    loading: false,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    error: null,
    hasUnreadAlarms: false
  },
  
  // UI 상태
  ui: {
    loading: false,
    error: null,
    notifications: [],
    theme: 'light',
    sidebarCollapsed: false
  },
  
  // 날씨 정보
  weather: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  }
};

// 액션 타입 정의
export const ACTION_TYPES = {
  // Zone 관련
  SET_ZONE_STATUSES: 'SET_ZONE_STATUSES',
  SET_CONNECTION_STATES: 'SET_CONNECTION_STATES',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED',
  SET_ZONES: 'SET_ZONES',
  
  // 센서 관련
  SET_SENSOR_DATA: 'SET_SENSOR_DATA',
  SET_SENSOR_LOADING: 'SET_SENSOR_LOADING',
  SET_SENSOR_ERROR: 'SET_SENSOR_ERROR',
  
  // 알림 관련
  SET_ALARMS: 'SET_ALARMS',
  SET_ALARM_LOADING: 'SET_ALARM_LOADING',
  SET_ALARM_ERROR: 'SET_ALARM_ERROR',
  SET_ALARM_PAGINATION: 'SET_ALARM_PAGINATION',
  UPDATE_ALARM_STATUS: 'UPDATE_ALARM_STATUS',
  
  // UI 관련
  SET_UI_LOADING: 'SET_UI_LOADING',
  SET_UI_ERROR: 'SET_UI_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  
  // 날씨 관련
  SET_WEATHER_DATA: 'SET_WEATHER_DATA',
  SET_WEATHER_LOADING: 'SET_WEATHER_LOADING',
  SET_WEATHER_ERROR: 'SET_WEATHER_ERROR'
};

// 리듀서 함수
const globalReducer = (state, action) => {
  switch (action.type) {
    // Zone 관련 액션들
    case ACTION_TYPES.SET_ZONE_STATUSES:
      return {
        ...state,
        zones: {
          ...state.zones,
          zoneStatuses: action.payload
        }
      };
      
    case ACTION_TYPES.SET_CONNECTION_STATES:
      return {
        ...state,
        zones: {
          ...state.zones,
          connectionStates: action.payload
        }
      };
      
    case ACTION_TYPES.SET_LAST_UPDATED:
      return {
        ...state,
        zones: {
          ...state.zones,
          lastUpdated: action.payload
        }
      };
      
    case ACTION_TYPES.SET_ZONES:
      return {
        ...state,
        zones: {
          ...state.zones,
          zones: action.payload
        }
      };
    
    // 센서 관련 액션들
    case ACTION_TYPES.SET_SENSOR_DATA:
      return {
        ...state,
        sensors: {
          ...state.sensors,
          data: action.payload,
          lastUpdated: new Date().toISOString()
        }
      };
      
    case ACTION_TYPES.SET_SENSOR_LOADING:
      return {
        ...state,
        sensors: {
          ...state.sensors,
          loading: action.payload
        }
      };
      
    case ACTION_TYPES.SET_SENSOR_ERROR:
      return {
        ...state,
        sensors: {
          ...state.sensors,
          error: action.payload
        }
      };
    
    // 알림 관련 액션들
    case ACTION_TYPES.SET_ALARMS:
      return {
        ...state,
        alarms: {
          ...state.alarms,
          alarms: action.payload
        }
      };
      
    case ACTION_TYPES.SET_ALARM_LOADING:
      return {
        ...state,
        alarms: {
          ...state.alarms,
          loading: action.payload
        }
      };
      
    case ACTION_TYPES.SET_ALARM_ERROR:
      return {
        ...state,
        alarms: {
          ...state.alarms,
          error: action.payload
        }
      };
      
    case ACTION_TYPES.SET_ALARM_PAGINATION:
      return {
        ...state,
        alarms: {
          ...state.alarms,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements
        }
      };
      
    case ACTION_TYPES.UPDATE_ALARM_STATUS:
      return {
        ...state,
        alarms: {
          ...state.alarms,
          alarms: state.alarms.alarms.map(alarm =>
            alarm.id === action.payload.alarmId
              ? { ...alarm, ...action.payload.updates }
              : alarm
          )
        }
      };
    
    // UI 관련 액션들
    case ACTION_TYPES.SET_UI_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload
        }
      };
      
    case ACTION_TYPES.SET_UI_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload
        }
      };
      
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload]
        }
      };
      
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload
          )
        }
      };
      
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload
        }
      };
      
    case ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed
        }
      };
    
    // 날씨 관련 액션들
    case ACTION_TYPES.SET_WEATHER_DATA:
      return {
        ...state,
        weather: {
          ...state.weather,
          data: action.payload,
          lastUpdated: new Date().toISOString()
        }
      };
      
    case ACTION_TYPES.SET_WEATHER_LOADING:
      return {
        ...state,
        weather: {
          ...state.weather,
          loading: action.payload
        }
      };
      
    case ACTION_TYPES.SET_WEATHER_ERROR:
      return {
        ...state,
        weather: {
          ...state.weather,
          error: action.payload
        }
      };
    
    default:
      return state;
  }
};

// 전역 상태 컨텍스트 생성
const GlobalStateContext = createContext(null);

// 전역 상태 프로바이더 컴포넌트
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// 전역 상태 훅
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  
  if (!context) {
    throw new Error('useGlobalState는 GlobalStateProvider 내에서 사용되어야 합니다.');
  }
  
  return context;
};

// 특정 상태만 선택하는 훅들
export const useZoneState = () => {
  const { state } = useGlobalState();
  return state.zones;
};

export const useSensorState = () => {
  const { state } = useGlobalState();
  return state.sensors;
};

export const useAlarmState = () => {
  const { state } = useGlobalState();
  return state.alarms;
};

export const useUIState = () => {
  const { state } = useGlobalState();
  return state.ui;
};

export const useWeatherState = () => {
  const { state } = useGlobalState();
  return state.weather;
};

// 액션 디스패치 훅
export const useDispatch = () => {
  const { dispatch } = useGlobalState();
  return dispatch;
};

// 액션 크리에이터 함수들
export const actionCreators = {
  // Zone 액션들
  setZoneStatuses: (zoneStatuses) => ({
    type: ACTION_TYPES.SET_ZONE_STATUSES,
    payload: zoneStatuses
  }),
  
  setConnectionStates: (connectionStates) => ({
    type: ACTION_TYPES.SET_CONNECTION_STATES,
    payload: connectionStates
  }),
  
  setLastUpdated: (lastUpdated) => ({
    type: ACTION_TYPES.SET_LAST_UPDATED,
    payload: lastUpdated
  }),
  
  setZones: (zones) => ({
    type: ACTION_TYPES.SET_ZONES,
    payload: zones
  }),
  
  // 센서 액션들
  setSensorData: (data) => ({
    type: ACTION_TYPES.SET_SENSOR_DATA,
    payload: data
  }),
  
  setSensorLoading: (loading) => ({
    type: ACTION_TYPES.SET_SENSOR_LOADING,
    payload: loading
  }),
  
  setSensorError: (error) => ({
    type: ACTION_TYPES.SET_SENSOR_ERROR,
    payload: error
  }),
  
  // 알림 액션들
  setAlarms: (alarms) => ({
    type: ACTION_TYPES.SET_ALARMS,
    payload: alarms
  }),
  
  setAlarmLoading: (loading) => ({
    type: ACTION_TYPES.SET_ALARM_LOADING,
    payload: loading
  }),
  
  setAlarmError: (error) => ({
    type: ACTION_TYPES.SET_ALARM_ERROR,
    payload: error
  }),
  
  setAlarmPagination: (pagination) => ({
    type: ACTION_TYPES.SET_ALARM_PAGINATION,
    payload: pagination
  }),
  
  updateAlarmStatus: (alarmId, updates) => ({
    type: ACTION_TYPES.UPDATE_ALARM_STATUS,
    payload: { alarmId, updates }
  }),
  
  // UI 액션들
  setUILoading: (loading) => ({
    type: ACTION_TYPES.SET_UI_LOADING,
    payload: loading
  }),
  
  setUIError: (error) => ({
    type: ACTION_TYPES.SET_UI_ERROR,
    payload: error
  }),
  
  addNotification: (notification) => ({
    type: ACTION_TYPES.ADD_NOTIFICATION,
    payload: { ...notification, id: Date.now() }
  }),
  
  removeNotification: (id) => ({
    type: ACTION_TYPES.REMOVE_NOTIFICATION,
    payload: id
  }),
  
  setTheme: (theme) => ({
    type: ACTION_TYPES.SET_THEME,
    payload: theme
  }),
  
  toggleSidebar: () => ({
    type: ACTION_TYPES.TOGGLE_SIDEBAR
  }),
  
  // 날씨 액션들
  setWeatherData: (data) => ({
    type: ACTION_TYPES.SET_WEATHER_DATA,
    payload: data
  }),
  
  setWeatherLoading: (loading) => ({
    type: ACTION_TYPES.SET_WEATHER_LOADING,
    payload: loading
  }),
  
  setWeatherError: (error) => ({
    type: ACTION_TYPES.SET_WEATHER_ERROR,
    payload: error
  })
};

export default GlobalStateContext;
