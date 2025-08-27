// 더미데이터 시작
// ⚠️  더미데이터 삭제 시 참고사항:
// 1. src/services/api/auth.js - 실제 로그인/로그아웃 API 연동 완료 ✅
// 2. src/services/userService.js - 실제 사용자 관리 API 연동 완료 ✅
// 3. 이 더미데이터들은 개발/테스트용으로만 사용됨

// 더미 데이터 및 서비스 내보내기 (로그인/로그아웃만 실제 API 사용)

// 데이터 생성기들
export { generateZoneStatusData, generateZoneStatusVersions } from './data/zoneStatusGenerator.js';
export { generateDummyUsers, dummyUsers } from './data/userGenerator.js';
export { generateDummyWeatherData, dummyWeatherData } from './data/weather.js';

// 기존 호환성을 위한 데이터들
export { dummyReports, getDummyReportsResponse, getDummyReportById } from './data/reports.js';
export { zoneStatusData, zoneStatusDataV2, zoneStatusDataV3, zoneStatusDataV4 } from './data/zoneStatus.js';

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
export { handleDummyLogin, handleDummyLogout, validateDummyToken, userService } from './data/userGenerator.js';
export { fetchWeatherData } from './data/weather.js';