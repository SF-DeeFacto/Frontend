// 더미 서비스들을 통합 export하는 파일
// API 실패 시 폴백으로 더미 데이터를 사용하는 서비스들

// 사용자 관련 서비스
export { userService } from './userService.js';
export { handleDummyLogin, handleDummyLogout, validateDummyToken } from './user.js';

// 날씨 관련 서비스
export { 
  fetchWeatherData, 
  handleDummyWeatherFallback, 
  getWeatherTrend, 
  getWeatherForDate, 
  getCurrentWeather 
} from './weather.js';

// Zone 관련 서비스
export { default as zoneService } from './zoneService.js';

// 대시보드 관련 서비스
export { dashboardApi } from './dashboard_api.js';

// 더미 서비스 사용법:
// import { userService, zoneService, dashboardApi } from '../dummy/services';
// 
// API 실패 시 자동으로 더미 데이터로 폴백됩니다.
// 실제 API가 정상 작동하면 실제 데이터를 사용하고,
// API 실패 시에는 더미 데이터를 제공합니다.
