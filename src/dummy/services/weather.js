import { getDummyWeatherResponse, generateDummyWeatherData } from '../data/weather.js';

// 실제 날씨 API 호출 함수
export const fetchWeatherData = async () => {
  try {
    // 실제 백엔드 API 호출 시도
    const response = await fetch('/home/weather', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // 실제 백엔드 응답 처리
      const data = await response.json();
      console.log('실제 날씨 API 호출 성공:', data);
      return { success: true, data: data.data || data };
    } else {
      // 백엔드 API가 실패하면 더미 데이터로 처리
      console.log('백엔드 날씨 API 호출 실패, 더미 데이터로 처리');
      return handleDummyWeatherFallback();
    }
  } catch (error) {
    // 네트워크 오류 등으로 API 호출이 실패하면 더미 데이터로 처리
    console.log('날씨 API 호출 중 오류 발생, 더미 데이터로 처리:', error.message);
    return handleDummyWeatherFallback();
  }
};

// 더미 날씨 데이터 폴백 처리
export const handleDummyWeatherFallback = () => {
  const dummyResponse = getDummyWeatherResponse();
  console.log('더미 날씨 데이터 사용:', dummyResponse.data);
  return { success: true, data: dummyResponse.data };
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
