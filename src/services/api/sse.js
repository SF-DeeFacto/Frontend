// SSE 통신을 위한 설정
// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 SSE 연결 방법을 제공합니다.

import { getAvailableBackendConfig } from '../../config/backendConfig';

// SSE API 클라이언트 생성
const createSSEClient = async () => {
  const config = await getAvailableBackendConfig();
  if (!config) {
    throw new Error('API Gateway 연결 불가');
  }
  
  return {
    baseURL: config.baseURL,
    target: config.target
  };
};

// SSE URL 설정 (환경변수 기반)
export const SSE_URLS = {
  // API Gateway를 통한 SSE 연결
  main: "/api/home/status",
  zone: (zoneId) => `/api/home/zone?zoneId=${zoneId}`,
  
  // 개발용 직접 연결 (프록시 미사용시)
  // main: "http://localhost:8080/home/status",
  // zone: (zoneId) => `http://localhost:8080/home/zone?zoneId=${zoneId}`,
};

// SSE 연결 함수
export const connectSSE = (url, { onMessage, onError, onOpen }) => {
  console.log('SSE 연결 시작:', url);
  
  // 인증 토큰 가져오기
  const token = localStorage.getItem('access_token');
  
  // 토큰을 쿼리 파라미터로 추가
  const urlWithToken = token ? `${url}${url.includes('?') ? '&' : '?'}token=${token}` : url;
  
  // 실제 EventSource API 사용
  let eventSource = null;
  let retryCount = 0;
  const maxRetries = 3;
  const retryDelay = 2000; // 2초
  
  const createEventSource = () => {
    try {
      console.log(`SSE 연결 시도 ${retryCount + 1}/${maxRetries + 1}:`, urlWithToken);
      
      // EventSource 생성
      eventSource = new EventSource(urlWithToken);
      
      // 연결 성공 시
      eventSource.onopen = (event) => {
        console.log('SSE 연결 성공!', url);
        retryCount = 0; // 재시도 카운트 리셋
        if (onOpen) {
          onOpen(event);
        }
      };
      
      // 메시지 수신 시
      eventSource.onmessage = (event) => {
        console.log('📨 SSE 데이터 수신:', {
          url: urlWithToken,
          timestamp: new Date().toLocaleTimeString(),
          data: event.data
        });
        
        try {
          const data = JSON.parse(event.data);
          console.log('✅ SSE 데이터 파싱 성공:', {
            url: urlWithToken,
            parsedData: data,
            dataType: typeof data,
            hasCode: !!data.code,
            hasData: !!data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
          });
          onMessage(data);
        } catch (error) {
          console.error('❌ SSE 데이터 파싱 오류:', {
            url: urlWithToken,
            rawData: event.data,
            error: error.message
          });
        }
      };
      
      // 에러 발생 시
      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        
        // 재시도 로직
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`SSE 연결 재시도 ${retryCount}/${maxRetries}... (${retryDelay}ms 후)`);
          
          // 기존 연결 해제
          if (eventSource) {
            eventSource.close();
          }
          
          // 재시도
          setTimeout(() => {
            createEventSource();
          }, retryDelay);
        } else {
          console.error('SSE 연결 최대 재시도 횟수 초과');
          onError(error);
        }
      };
      
    } catch (error) {
      console.error('SSE 연결 생성 실패:', error);
      onError(error);
    }
  };
  
  // 초기 연결 시도
  createEventSource();
  
  // 연결 해제 함수 반환
  return {
    disconnect: () => {
      if (eventSource) {
        console.log('SSE 연결 해제:', url);
        eventSource.close();
        eventSource = null;
      }
    },
    // 연결 상태 확인
    isConnected: () => eventSource && eventSource.readyState === EventSource.OPEN
  };
};

// SSE API 함수들
export const sseApi = {
  // 대시보드 상태 SSE 연결
  connectDashboardStatus: (onMessage, onError, onOpen) => {
    return connectSSE(SSE_URLS.main, { onMessage, onError, onOpen });
  },
  
  // 구역별 상태 SSE 연결
  connectZoneStatus: (zoneId, onMessage, onError, onOpen) => {
    return connectSSE(SSE_URLS.zone(zoneId), { onMessage, onError, onOpen });
  },
  
  // 사용자 정의 SSE 연결
  connect: connectSSE
};

// 기존 함수들과의 호환성을 위한 export
export default sseApi;
