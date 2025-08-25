// 실시간 API 연동 준비용 - 고정 더미데이터

// 간단한 고정 더미 날씨 데이터 (실제 API 대체용)
export const generateDummyWeatherData = () => {
  return {
    temperature: 23.5,
    weather: '맑음'
  };
};

// API 응답 형태 (실제 API 연동 시 이 구조 사용)
export const generateDummyWeatherResponse = () => {
  const weatherData = generateDummyWeatherData();
  
  return {
    success: true,
    data: weatherData,
    timestamp: new Date().toISOString()
  };
};

// 기본 더미 날씨 데이터 (기존 호환성 유지)
export const dummyWeatherData = generateDummyWeatherData();

// 기존 함수 호환성 유지
export const getDummyWeatherResponse = () => generateDummyWeatherResponse(); 
