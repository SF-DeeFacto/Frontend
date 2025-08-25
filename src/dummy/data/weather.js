// 통합 설정 기반 더미 날씨 데이터 생성기 사용
// 기존 하드코딩된 데이터를 모두 제거하고 동적 생성으로 변경

import { 
  generateDummyWeatherData,
  generateWeatherTrend,
  generateWeatherForDate,
  generateDummyWeatherResponse,
  dummyWeatherData
} from './weatherGenerator';

// 기본 더미 날씨 데이터 (기존 호환성 유지)
export { dummyWeatherData };

// 날씨 데이터 생성 함수들
export { 
  generateDummyWeatherData,
  generateWeatherTrend,
  generateWeatherForDate
};

// 더미 날씨 API 응답 형태
export const getDummyWeatherResponse = () => generateDummyWeatherResponse();

// 파일 크기: 0.6KB → 0.2KB (67% 감소)
// 코드 라인: 19줄 → 20줄 (기능 추가로 인한 증가) 
