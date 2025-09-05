// 날씨 관련 유틸리티 함수들

// 날씨 상태에 따른 아이콘 반환
export const getWeatherIcon = (weather) => {
  const weatherIcons = {
    '맑음': '☀️',
    '구름': '☁️',
    '흐림': '⛅',
    '비': '🌧️',
    '눈': '❄️',
    '안개': '🌫️',
    '천둥번개': '⛈️',
    '바람': '💨'
  };
  
  return weatherIcons[weather] || '🌤️'; // 기본값
};

// 날씨 상태에 따른 색상 반환
export const getWeatherColor = (weather) => {
  const weatherColors = {
    '맑음': '#fbbf24', // 노란색
    '구름': '#9ca3af', // 회색
    '흐림': '#6b7280', // 어두운 회색
    '비': '#3b82f6',   // 파란색
    '눈': '#e0e7ff',   // 연한 파란색
    '안개': '#d1d5db', // 연한 회색
    '천둥번개': '#7c3aed', // 보라색
    '바람': '#10b981'  // 초록색
  };
  
  return weatherColors[weather] || '#9ca3af'; // 기본값
};

// 온도에 따른 색상 반환
export const getTemperatureColor = (temperature) => {
  if (temperature >= 30) return '#ef4444'; // 빨간색 (더움)
  if (temperature >= 20) return '#f59e0b'; // 주황색 (따뜻함)
  if (temperature >= 10) return '#10b981'; // 초록색 (시원함)
  if (temperature >= 0) return '#3b82f6';  // 파란색 (차가움)
  return '#8b5cf6'; // 보라색 (매우 차가움)
};
