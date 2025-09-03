import { SENSOR_ACTION_TYPES } from './types';

/**
 * 센서 액션 크리에이터
 */
export const sensorActions = {
  setSensorData: (data) => ({
    type: SENSOR_ACTION_TYPES.SET_SENSOR_DATA,
    payload: data,
  }),

  setLoading: (loading) => ({
    type: SENSOR_ACTION_TYPES.SET_LOADING,
    payload: loading,
  }),

  setError: (error) => ({
    type: SENSOR_ACTION_TYPES.SET_ERROR,
    payload: error,
  }),

  updateSensor: (sensorId, data) => ({
    type: SENSOR_ACTION_TYPES.UPDATE_SENSOR,
    payload: { sensorId, data },
  }),

  clearSensors: () => ({
    type: SENSOR_ACTION_TYPES.CLEAR_SENSORS,
  }),
};
