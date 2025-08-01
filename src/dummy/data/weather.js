// 더미 날씨 데이터
export const dummyWeatherData = {
  temperature: 22,
  humidity: 65,
  weather: '맑음',
  windSpeed: 3.2,
  pressure: 1013,
  visibility: 10,
  uvIndex: 5,
  airQuality: '좋음',
  lastUpdated: new Date().toISOString()
};

// 더미 날씨 API 응답 형태
export const getDummyWeatherResponse = () => ({
  success: true,
  data: dummyWeatherData,
  message: '날씨 정보를 성공적으로 가져왔습니다.'
}); 