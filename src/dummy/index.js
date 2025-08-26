// 더미데이터 시작
// 더미 데이터 및 서비스 내보내기 (로그인/로그아웃만 실제 API 사용)

// 데이터 생성기들
export { generateZoneStatusData, generateZoneStatusVersions } from './data/zoneStatusGenerator.js';
export { generateDummyUsers, generateUsersByRole, generateUsersByDepartment } from './data/userGenerator.js';
export { generateDummyWeatherData } from './data/weather.js';

// 기존 호환성을 위한 데이터들
export { dummyWeatherData, getDummyWeatherResponse } from './data/weather.js';
export { dummyReports, getDummyReportsResponse, getDummyReportById } from './data/reports.js';
export { zoneStatusData, zoneStatusDataV2, zoneStatusDataV3, zoneStatusDataV4 } from './data/zoneStatus.js';
export { dummyUsers } from './data/users.js';

// Zone 센서 데이터
export { 
  zoneSensorData, 
  getZoneSensorData, 
  getAllZoneSensorData,
  getZoneSensorDataByType,
  getZoneSensorDataByStatus,
  getUpdatedZoneSensorData
} from './data/zoneSensorData.js';

// 더미데이터 끝 (삭제)

// 서비스들
export { handleDummyLogin, handleDummyLogout, validateDummyToken } from './services/user.js';
export { fetchWeatherData, handleDummyWeatherFallback, getWeatherTrend, getWeatherForDate, getCurrentWeather } from './services/weather.js';
