// SSE 관련 API 서비스 - 공통 API 클라이언트 사용

import api from './client';

// SSE 연결 생성
export const createSSEConnection = (endpoint, onMessage, onError) => {
  try {
    // Vite 프록시를 통한 SSE 연결
    const eventSource = new EventSource(`/api${endpoint}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('SSE 데이터 파싱 오류:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      if (onError) onError(error);
    };
    
    eventSource.onopen = () => {
      console.log('SSE 연결 성공:', endpoint);
    };
    
    return eventSource;
  } catch (error) {
    console.error('SSE 연결 생성 실패:', error);
    throw error;
  }
};

// 센서 데이터 스트림 구독
export const subscribeToSensorData = (zoneId, onData) => {
  return createSSEConnection(
    `/sensor/stream?zoneId=${zoneId}`,
    onData,
    (error) => console.error('센서 데이터 스트림 오류:', error)
  );
};

// 알람 데이터 스트림 구독
export const subscribeToAlarmData = (onData) => {
  return createSSEConnection(
    '/alarm/stream',
    onData,
    (error) => console.error('알람 데이터 스트림 오류:', error)
  );
};

// 대시보드 데이터 스트림 구독
export const subscribeToDashboardData = (onData) => {
  return createSSEConnection(
    '/dashboard/stream',
    onData,
    (error) => console.error('대시보드 데이터 스트림 오류:', error)
  );
};

// SSE 연결 해제
export const disconnectSSE = (eventSource) => {
  if (eventSource) {
    eventSource.close();
    console.log('SSE 연결 해제됨');
  }
};

// SSE API 객체
export const sseApi = {
  createSSEConnection,
  subscribeToSensorData,
  subscribeToAlarmData,
  subscribeToDashboardData,
  disconnectSSE
};
