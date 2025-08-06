// 더미 데이터 및 서비스 내보내기 (로그인/로그아웃만 실제 API 사용)
// export { dummyUsers } from './data/users.js';
export { dummyWeatherData, getDummyWeatherResponse } from './data/weather.js';
// export { handleDummyLogin, handleDummyLogout, validateDummyToken } from './services/user.js';
export { fetchWeatherData, handleDummyWeatherFallback } from './services/weather.js'; 