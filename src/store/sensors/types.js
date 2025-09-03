/**
 * 센서 관련 액션 타입
 */
export const SENSOR_ACTION_TYPES = {
  SET_SENSOR_DATA: 'sensors/SET_SENSOR_DATA',
  SET_LOADING: 'sensors/SET_LOADING',
  SET_ERROR: 'sensors/SET_ERROR',
  UPDATE_SENSOR: 'sensors/UPDATE_SENSOR',
  CLEAR_SENSORS: 'sensors/CLEAR_SENSORS',
};

/**
 * 센서 상태 타입
 */
export const SensorStatus = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
};

/**
 * 센서 타입
 */
export const SensorType = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  PRESSURE: 'pressure',
  VIBRATION: 'vibration',
  SOUND: 'sound',
};
