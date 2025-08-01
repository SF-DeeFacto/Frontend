import { getDummyWeatherResponse } from '../data/weather.js';

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