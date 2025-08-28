// SSE 통신을 위한 설정
// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 SSE 연결 방법을 제공합니다.

// EventSourcePolyfill import 추가
import { EventSourcePolyfill } from 'event-source-polyfill';

// SSE URL 설정
export const SSE_URLS = {
  // (개발용) 프록시를 통한 연결 url - Dashboard 백엔드 (포트 8083)
  main: "/dashboard-api/home/status",
  zone: (zoneId) => `/dashboard-api/home/zone?zoneId=${zoneId}`,
  
  // (개발용) 직접 연결 url (프록시 미사용시)
  // main: "http://localhost:8083/home/status",
  // zone: (zoneId) => `http://localhost:8083/home/zone?zoneId=${zoneId}`,
  
  // (운영용) gateway 사용시 연결 url
  // main: "http://localhost:8080/home/status",
  // zone: (zoneId) => `http://localhost:8080/home/zone?zoneId=${zoneId}`,
};

// SSE 연결 함수
export const connectSSE = (url, { onMessage, onError, onOpen }) => {
  console.log('SSE 연결 시작:', url);
  
  // 인증 토큰 가져오기
  const token = localStorage.getItem('access_token');
  
  // 토큰이 없으면 연결하지 않음
  if (!token) {
    console.log('토큰이 없어 SSE 연결을 건너뜁니다.');
    onError(new Error('인증 토큰이 없습니다.'));
    return () => {}; // 빈 함수 반환
  }
  
  // 토큰을 쿼리 파라미터로 추가 (기존 방식)
  const urlWithToken = token ? `${url}${url.includes('?') ? '&' : '?'}token=${token}` : url;
  
  // 토큰을 헤더로 전송하는 방식으로 변경
  // const urlWithToken = url;
  
  // 실제 EventSource API 사용
  let eventSource = null;
  let retryCount = 0;
  const maxRetries = 3;
  const retryDelay = 2000; // 2초
  
  const createEventSource = () => {
    try {
      console.log(`SSE 연결 시도 ${retryCount + 1}/${maxRetries + 1}:`, url);
      
      // EventSourcePolyfill을 사용하므로 URL에 토큰을 포함하지 않음
      // Authorization 헤더로 토큰 전달
      console.log('SSE 연결 URL:', url);
      console.log('토큰:', token ? '있음' : '없음');
      
      // EventSourcePolyfill 사용 (커스텀 헤더 가능)
      eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // 필요하다면 쿠키도 같이 보냄
      });
      
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
          url: url,
          timestamp: new Date().toLocaleTimeString(),
          data: event.data
        });
        
        try {
          const data = JSON.parse(event.data);
          console.log('✅ SSE 데이터 파싱 성공:', {
            url: url,
            parsedData: data,
            dataType: typeof data,
            hasCode: !!data.code,
            hasData: !!data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
          });
          onMessage(data);
        } catch (error) {
          console.error('❌ SSE 데이터 파싱 오류:', {
            url: url,
            rawData: event.data,
            error: error.message
          });
        }
      };
      
      // 에러 발생 시
      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        eventSource.close();
        
        // 재시도 로직
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`SSE 연결 재시도 ${retryCount}/${maxRetries}... (${retryDelay}ms 후)`);
          
          setTimeout(() => {
            createEventSource();
          }, retryDelay);
        } else {
          console.error('SSE 연결 최대 재시도 횟수 초과');
          onError(error);
        }
      };
      
    } catch (error) {
      console.error('EventSource 생성 오류:', error);
      onError(error);
    }
  };
  
  // 초기 연결 시도
  createEventSource();
  
  // 연결 해제 함수 반환
  return () => {
    console.log('SSE 연결 해제');
    if (eventSource) {
      try {
        eventSource.close();
      } catch (error) {
        console.log('SSE 연결 해제 중 오류:', error);
      }
    }
  };
};

// 메인 대시보드용 SSE 연결
export const connectMainSSE = ({ onMessage, onError, onOpen }) => {
  return connectSSE(SSE_URLS.main, { onMessage, onError, onOpen });
};

// 특정 존용 SSE 연결
export const connectZoneSSE = (zoneId, { onMessage, onError, onOpen }) => {
  return connectSSE(SSE_URLS.zone(zoneId), { onMessage, onError, onOpen });
};
