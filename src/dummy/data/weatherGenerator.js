// 통합 설정 기반 더미 날씨 데이터 생성기

// 날씨 상태 정의
const WEATHER_CONDITIONS = ['맑음', '흐림', '비', '눈', '안개', '구름많음'];

// 공기질 상태 정의
const AIR_QUALITY_LEVELS = ['매우좋음', '좋음', '보통', '나쁨', '매우나쁨'];

// 랜덤 범위 값 생성 함수
const generateRandomValue = (min, max, decimals = 1) => {
  const value = Math.random() * (max - min) + min;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// 랜덤 항목 선택 함수
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// 현재 시간 기준으로 시간대별 날씨 변화 생성
const generateTimeBasedWeather = () => {
  const now = new Date();
  const hour = now.getHours();
  
  // 시간대별 기본 온도 범위
  let baseTemp = 22;
  if (hour >= 6 && hour < 12) baseTemp = 20;      // 아침
  else if (hour >= 12 && hour < 18) baseTemp = 25; // 오후
  else if (hour >= 18 && hour < 22) baseTemp = 23; // 저녁
  else baseTemp = 18;                              // 밤
  
  return { baseTemp, hour };
};

// 더미 날씨 데이터 생성
export const generateDummyWeatherData = (customTime = null) => {
  const { baseTemp, hour } = generateTimeBasedWeather();
  const tempVariation = generateRandomValue(-3, 3, 1);
  const temperature = baseTemp + tempVariation;
  
  // 온도에 따른 습도 조정 (온도가 높을수록 습도가 낮아짐)
  const humidity = Math.max(30, Math.min(80, 70 - (temperature - 20) * 2 + generateRandomValue(-10, 10, 1)));
  
  // 온도와 습도에 따른 날씨 상태 결정
  let weather = '맑음';
  if (humidity > 75) weather = getRandomItem(['흐림', '구름많음', '안개']);
  if (humidity > 85) weather = getRandomItem(['비', '눈']);
  
  // 풍속 (온도 차이에 따라 변화)
  const windSpeed = Math.max(0.5, Math.min(15, 3 + Math.abs(tempVariation) * 2 + generateRandomValue(-1, 1, 1)));
  
  // 기압 (날씨에 따라 변화)
  let pressure = 1013;
  if (weather === '비' || weather === '눈') pressure -= generateRandomValue(5, 15, 1);
  else if (weather === '맑음') pressure += generateRandomValue(0, 10, 1);
  
  // 가시거리 (날씨에 따라 변화)
  let visibility = 10;
  if (weather === '안개') visibility = generateRandomValue(0.1, 2, 1);
  else if (weather === '비' || weather === '눈') visibility = generateRandomValue(2, 8, 1);
  
  // 자외선 지수 (시간대와 날씨에 따라)
  let uvIndex = 0;
  if (hour >= 10 && hour <= 16 && weather === '맑음') {
    uvIndex = generateRandomValue(3, 8, 1);
  } else if (weather === '맑음') {
    uvIndex = generateRandomValue(1, 4, 1);
  }
  
  // 공기질 (습도와 날씨에 따라)
  let airQuality = '좋음';
  if (humidity > 80 || weather === '안개') airQuality = '보통';
  if (humidity > 90) airQuality = '나쁨';
  
  return {
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity),
    weather,
    windSpeed: Math.round(windSpeed * 10) / 10,
    pressure: Math.round(pressure),
    visibility: Math.round(visibility * 10) / 10,
    uvIndex: Math.round(uvIndex * 10) / 10,
    airQuality,
    lastUpdated: customTime || new Date().toISOString()
  };
};

// 여러 시간대의 날씨 데이터 생성 (트렌드 시뮬레이션)
export const generateWeatherTrend = (hours = 24) => {
  const weatherTrend = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    weatherTrend.push({
      ...generateDummyWeatherData(time.toISOString()),
      timestamp: time.toISOString()
    });
  }
  
  return weatherTrend.reverse(); // 시간순으로 정렬
};

// 특정 날짜의 날씨 데이터 생성
export const generateWeatherForDate = (date) => {
  const targetDate = new Date(date);
  return generateDummyWeatherData(targetDate.toISOString());
};

// 더미 날씨 API 응답 형태 생성
export const generateDummyWeatherResponse = (customData = null) => {
  const weatherData = customData || generateDummyWeatherData();
  
  return {
    success: true,
    data: weatherData,
    message: '날씨 정보를 성공적으로 가져왔습니다.',
    timestamp: new Date().toISOString()
  };
};

// 기본 더미 날씨 데이터 (기존 호환성 유지)
export const dummyWeatherData = generateDummyWeatherData();

// 기존 함수 호환성 유지
export const getDummyWeatherResponse = () => generateDummyWeatherResponse();
