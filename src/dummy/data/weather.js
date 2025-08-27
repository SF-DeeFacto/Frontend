// 간단한 날씨 더미데이터
// ⚠️  더미데이터 삭제 시 참고사항:
// 1. 이 파일의 더미데이터는 개발/테스트용으로만 사용됨
// 2. 실제 날씨 API 연동 시 이 파일을 삭제하고 실제 API 사용

// 기본 더미 날씨 데이터
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

// 간단한 날씨 데이터 생성 함수
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

// 날씨 데이터 가져오기 (간단한 폴백)
export const fetchWeatherData = async () => {
  try {
    // 실제 백엔드 API 호출 시도
    const response = await fetch('/home/weather');
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.data || data };
    }
  } catch (error) {
    console.log('날씨 API 호출 실패, 더미 데이터 사용:', error.message);
  }
  
  // API 실패 시 더미 데이터 반환
  return { success: true, data: dummyWeatherData };
};

// 날씨 트렌드 데이터 가져오기
export const getWeatherTrend = async (hours = 24) => {
  try {
    // 실제 백엔드 API 호출 시도
    const response = await fetch(`/home/weather/trend?hours=${hours}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('실제 날씨 트렌드 API 호출 성공:', data);
      return { success: true, data: data.data || data };
    } else {
      console.log('백엔드 날씨 트렌드 API 호출 실패, 더미 데이터로 처리');
      // 간단한 더미 트렌드 생성
      const trendData = [];
      for (let i = 0; i < hours; i++) {
        trendData.push(generateDummyWeatherData());
      }
      return { success: true, data: trendData };
    }
  } catch (error) {
    console.log('날씨 트렌드 API 호출 중 오류 발생, 더미 데이터로 처리:', error.message);
    // 간단한 더미 트렌드 생성
    const trendData = [];
    for (let i = 0; i < hours; i++) {
      trendData.push(generateDummyWeatherData());
    }
    return { success: true, data: trendData };
  }
};

// 특정 날짜 날씨 데이터 가져오기
export const getWeatherForDate = async (date) => {
  try {
    // 실제 백엔드 API 호출 시도
    const response = await fetch(`/home/weather/date?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('실제 날짜별 날씨 API 호출 성공:', data);
      return { success: true, data: data.data || data };
    } else {
      console.log('백엔드 날짜별 날씨 API 호출 실패, 더미 데이터로 처리');
      return { success: true, data: generateDummyWeatherData() };
    }
  } catch (error) {
    console.log('날짜별 날씨 API 호출 중 오류 발생, 더미 데이터로 처리:', error.message);
    return { success: true, data: generateDummyWeatherData() };
  }
};

// 현재 날씨 데이터 가져오기 (fetchWeatherData와 동일하지만 별도 함수로 제공)
export const getCurrentWeather = async () => {
  return await fetchWeatherData();
}; 
