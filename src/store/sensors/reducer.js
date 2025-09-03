import { SENSOR_ACTION_TYPES } from './types';

/**
 * 센서 초기 상태
 */
export const initialSensorState = {
  data: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * 센서 리듀서
 */
export const sensorReducer = (state = initialSensorState, action) => {
  switch (action.type) {
    case SENSOR_ACTION_TYPES.SET_SENSOR_DATA:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case SENSOR_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };

    case SENSOR_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case SENSOR_ACTION_TYPES.UPDATE_SENSOR:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.sensorId]: {
            ...state.data[action.payload.sensorId],
            ...action.payload.data,
          },
        },
        lastUpdated: new Date().toISOString(),
      };

    case SENSOR_ACTION_TYPES.CLEAR_SENSORS:
      return {
        ...initialSensorState,
      };

    default:
      return state;
  }
};
