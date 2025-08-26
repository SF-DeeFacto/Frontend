// 더미 날씨 데이터 생성 함수
export const generateDummyWeatherData = () => ({
  temperature: Math.floor(Math.random() * 30) + 10, // 10-40도
  humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
  weather: ['맑음', '흐림', '비', '눈'][Math.floor(Math.random() * 4)],
  windSpeed: Math.random() * 10, // 0-10 m/s
  pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
  visibility: Math.floor(Math.random() * 20) + 5, // 5-25 km
  uvIndex: Math.floor(Math.random() * 11), // 0-10
  airQuality: ['좋음', '보통', '나쁨', '매우나쁨'][Math.floor(Math.random() * 4)],
  lastUpdated: new Date().toISOString()
});

// 날씨 트렌드 데이터 생성 함수
export const generateWeatherTrend = (hours = 24) => {
  const trendData = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    trendData.push({
      ...generateDummyWeatherData(),
      timestamp: time.toISOString()
    });
  }
  
  return trendData.reverse();
};

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
