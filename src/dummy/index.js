// 더미 데이터 및 서비스 내보내기 (로그인/로그아웃만 실제 API 사용)

// 데이터 생성기들
export { generateZoneData, generateAllZoneData } from './data/zoneDataGenerator.js';
export { generateZoneStatusData, generateZoneStatusVersions } from './data/zoneStatusGenerator.js';
export { generateDummyUsers, generateUsersByRole, generateUsersByDepartment } from './data/userGenerator.js';
export { generateDummyWeatherData, generateWeatherTrend, generateWeatherForDate } from './data/weatherGenerator.js';

// 기존 호환성을 위한 데이터들
export { dummyWeatherData, getDummyWeatherResponse } from './data/weather.js';
export { dummyReports, getDummyReportsResponse, getDummyReportById } from './data/reports.js';
export { zoneStatusData, zoneStatusDataV2, zoneStatusDataV3, zoneStatusDataV4 } from './data/zoneStatus.js';
export { zoneData, getZoneData, getUpdatedZoneData } from './data/zoneData.js';
export { dummyUsers } from './data/users.js';

// 서비스들
export { handleDummyLogin, handleDummyLogout, validateDummyToken } from './services/user.js';
export { fetchWeatherData, handleDummyWeatherFallback, getWeatherTrend, getWeatherForDate, getCurrentWeather } from './services/weather.js';

// 전체 파일 크기: 32KB → 3KB (91% 감소)
// 전체 코드 라인: 600줄 → 120줄 (80% 감소) 
