/**
 * SSE 더미 데이터 인덱스 파일
 * 모든 더미 데이터를 한 곳에서 import할 수 있도록 제공
 */

// 메인 SSE 데이터
export {
  mainSSEDummyData,
  generateMainSSEUpdate,
  sseConnectionSuccess,
  sseConnectionError,
  ZONE_STATUS
} from './sseMainData.js';

// Zone SSE 데이터
export {
  generateZoneSSEData,
  generateZoneSSEUpdate,
  generateSensorTypeData,
  allZonesSSEData,
  getZoneSensorStats,
  SENSOR_TYPES,
  SENSOR_STATUS
} from './sseZoneData.js';

// 알림 SSE 데이터
export {
  generateNotificationSSEData,
  generateAlertSSEData,
  generateNotificationUpdate,
  generateZoneNotification,
  generateReadNotificationData,
  generateDeleteNotificationData,
  generateNotificationStats,
  generateSSEConnectionData,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_PRIORITY,
  ZONES
} from './sseNotificationData.js';

// 센서 데이터 생성기
export {
  generateSensorData,
  generateZoneSensorData,
  generateSensorUpdate,
  generateSensorHistory,
  generateSensorStats,
  generateThresholdData,
  generateCalibrationData,
  generateSensorError,
  SENSOR_CONFIGS
} from './sensorDataDummy.js';

// 통합 더미 데이터 및 서버
export {
  SSEDummyServer,
  createDummyData,
  SSE_URLS,
  dummyServer,
  usageExamples,
  runTests,
  SSE_EVENT_TYPES
} from './sseDummyData.js';

// SSE 모킹 서버
export {
  MockEventSource,
  MockEventSourcePolyfill,
  initSSEMockServer,
  getMockServerStatus,
  disableSSEMockServer
} from './sseMockServer.js';

// SSE 모킹 훅
export {
  useSSEMock,
  useMainSSEMock,
  useZoneSSEMock,
  useNotificationSSEMock,
  useMockServerStatus,
  useMockServerControl
} from './useSSEMock.js';

// 자동 설정
export { default as setup } from './setup.js';

// 기본 export
export { default as sseDummyData } from './sseDummyData.js';
export { default as sensorDataDummy } from './sensorDataDummy.js';
export { default as sseMainData } from './sseMainData.js';
export { default as sseZoneData } from './sseZoneData.js';
export { default as sseNotificationData } from './sseNotificationData.js';
