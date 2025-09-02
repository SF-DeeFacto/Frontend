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
  // 인증 토큰 가져오기
  const token = localStorage.getItem('access_token');
  
  // 토큰이 없으면 연결하지 않음
  if (!token) {
    onError(new Error('인증 토큰이 없습니다.'));
    return () => {}; // 빈 함수 반환
  }
  
  // 실제 EventSource API 사용
  let eventSource = null;
  let retryCount = 0;
  const maxRetries = 3;
  const retryDelay = 2000; // 2초로 증가
  
  let lastMessageTime = Date.now(); // 마지막 메시지 수신 시간
  let heartbeatTimer = null; // 하트비트 타이머
  let reconnectTimer = null; // 재연결 타이머
  let isDestroyed = false; // 연결 해제 상태 추적

  const createEventSource = () => {
    if (isDestroyed) return; // 이미 해제된 경우 연결하지 않음
    
    try {
      eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      eventSource.onopen = (event) => {
        if (isDestroyed) return;
        
        lastMessageTime = Date.now();
        retryCount = 0; // 연결 성공 시 재시도 카운트 리셋
        
        // 하트비트 타이머 시작
        heartbeatTimer = setInterval(() => {
          if (isDestroyed) return;
          
          const now = Date.now();
          const timeSinceLastMessage = now - lastMessageTime;
          
          if (timeSinceLastMessage > 60000) { // 1분 이상 메시지 없음
            reconnect();
          }
        }, 30000); // 30초마다 체크
        
        onOpen?.(event);
      };
      
      eventSource.onmessage = (event) => {
        if (isDestroyed) return;
        
        lastMessageTime = Date.now();
        
        try {
          const parsedData = JSON.parse(event.data);
          onMessage(parsedData);
        } catch (parseError) {
          onError(parseError);
        }
      };
      
      eventSource.onerror = (error) => {
        if (isDestroyed) return;
        
        // 하트비트 타이머 정리
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        
        onError(error);
        
        // 자동 재연결 시도
        if (retryCount < maxRetries) {
          retryCount++;
          
          reconnectTimer = setTimeout(() => {
            if (!isDestroyed) {
              reconnect();
            }
          }, retryDelay);
        }
      };
      
    } catch (error) {
      onError(error);
    }
  };

  // 재연결 함수
  const reconnect = () => {
    if (isDestroyed) return;
    
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    
    createEventSource();
  };

  // 초기 연결 시작
  createEventSource();

  // 정리 함수 반환
  return () => {
    isDestroyed = true; // 연결 해제 상태로 설정
    
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    
    if (eventSource) {
      eventSource.close();
      eventSource = null;
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
