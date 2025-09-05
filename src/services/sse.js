// SSE 통신을 위한 설정
// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 SSE 연결 방법을 제공합니다.

// EventSourcePolyfill import 추가
import { EventSourcePolyfill } from 'event-source-polyfill';
import { handleSSEError } from '../utils/unifiedErrorHandler';
import { SYSTEM_CONFIG, STORAGE_KEYS } from '../config/constants';

// 개발 환경에서 EventSourcePolyfill을 모킹으로 교체
let MockEventSourcePolyfill = null;
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // 모킹이 설정되었는지 확인
  if (window.EventSourcePolyfill && window.EventSourcePolyfill.isMock) {
    MockEventSourcePolyfill = window.EventSourcePolyfill;
    console.log('🎭 sse.js: EventSourcePolyfill을 모킹으로 교체');
  } else {
    console.log('⚠️ sse.js: 모킹이 아직 로드되지 않음, 실제 EventSourcePolyfill 사용');
  }
}

// SSE URL 설정
export const SSE_URLS = {
  // (개발용) 프록시를 통한 연결 url - Dashboard 백엔드 (포트 8083)
  main: "/dashboard-api/home/status",
  zone: (zoneId) => `/dashboard-api/home/zone?zoneId=${zoneId}`,
  
  // 알림 전용 SSE 엔드포인트 (프록시를 통해 /api로 전달)
  notification: "/api/noti/sse/subscribe",
  
  // (개발용) 직접 연결 url (프록시 미사용시)
  // main: "http://localhost:8083/home/status",
  // zone: (zoneId) => `http://localhost:8083/home/zone?zoneId=${zoneId}`,
  // notification: "http://localhost:8080/noti/sse/subscribe",
  
  // (운영용) gateway 사용시 연결 url
  // main: "http://localhost:8080/home/status",
  // zone: (zoneId) => `http://localhost:8080/home/zone?zoneId=${zoneId}`,
  // notification: "http://localhost:8080/noti/sse/subscribe",
};

// SSE 연결 함수
export const connectSSE = (url, { onMessage, onError, onOpen }) => {
  // 인증 토큰 가져오기
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  
  // 토큰이 없으면 연결하지 않음
  if (!token) {
    onError(new Error('인증 토큰이 없습니다.'));
    return () => {}; // 빈 함수 반환
  }
  
  // 실제 EventSource API 사용
  let eventSource = null;
  let retryCount = 0;
  const maxRetries = SYSTEM_CONFIG.SSE_MAX_RETRIES;
  const retryDelay = SYSTEM_CONFIG.SSE_RETRY_DELAY;
  
  let lastMessageTime = Date.now(); // 마지막 메시지 수신 시간
  let heartbeatTimer = null; // 하트비트 타이머
  let reconnectTimer = null; // 재연결 타이머
  let isDestroyed = false; // 연결 해제 상태 추적

  const createEventSource = () => {
    if (isDestroyed) return; // 이미 해제된 경우 연결하지 않음
    
    console.log('🔌 SSE 연결 시작:', url);
    
    try {
      // eventSource = new EventSourcePolyfill(url, {
        //삭제
              // 개발 환경에서는 모킹 사용, 운영 환경에서는 실제 EventSourcePolyfill 사용
      let EventSourceToUse = EventSourcePolyfill;
      
      if (import.meta.env.DEV && typeof window !== 'undefined') {
        // 모킹이 설정되었는지 동적으로 확인
        if (window.EventSourcePolyfill && window.EventSourcePolyfill.isMock) {
          EventSourceToUse = window.EventSourcePolyfill;
          console.log('🔌 사용할 EventSource: 모킹');
        } else {
          console.log('🔌 사용할 EventSource: 실제 (모킹 없음)');
        }
      } else {
        console.log('🔌 사용할 EventSource: 실제 (운영 환경)');
      }
      
      eventSource = new EventSourceToUse(url, {
        //삭제제
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      eventSource.onopen = (event) => {
        if (isDestroyed) return;
        
        console.log('✅ SSE 연결 성공:', url);
        console.log('📊 SSE 연결 상태:', {
          readyState: eventSource.readyState,
          url: eventSource.url,
          timestamp: new Date().toISOString()
        });
        
        lastMessageTime = Date.now();
        retryCount = 0; // 연결 성공 시 재시도 카운트 리셋
        
        // 하트비트 타이머 시작
        heartbeatTimer = setInterval(() => {
          if (isDestroyed) return;
          
          const now = Date.now();
          const timeSinceLastMessage = now - lastMessageTime;
          
          if (timeSinceLastMessage > SYSTEM_CONFIG.SSE_HEARTBEAT_TIMEOUT) {
            console.log('⚠️ SSE 하트비트 타임아웃, 재연결 시도');
            reconnect();
          }
        }, SYSTEM_CONFIG.SSE_HEARTBEAT_CHECK_INTERVAL);
        
        onOpen?.(event);
      };
      
      eventSource.onmessage = (event) => {
        if (isDestroyed) return;
        
        lastMessageTime = Date.now();
        
        console.log('🔍 SSE onmessage 이벤트 발생:', event);
        console.log('🔍 event.data:', event.data);
        
        try {
          const parsedData = JSON.parse(event.data);
          console.log('📨 SSE 메시지 수신:', parsedData);
          console.log('📨 onMessage 콜백 호출 전');
          onMessage(parsedData);
          console.log('📨 onMessage 콜백 호출 후');
        } catch (parseError) {
          console.error('❌ SSE 메시지 파싱 오류:', parseError);
          onError(parseError);
        }
      };

      // 특정 이벤트 타입별 메시지 처리 (alert 이벤트)
      eventSource.addEventListener('alert', (event) => {
        if (isDestroyed) return;
        
        lastMessageTime = Date.now();
        
        try {
          const parsedData = JSON.parse(event.data);
          console.log('🚨 SSE alert 이벤트 수신:', parsedData);
          onMessage(parsedData);
        } catch (parseError) {
          console.error('❌ SSE alert 메시지 파싱 오류:', parseError);
          onError(parseError);
        }
      });
      
      eventSource.onerror = (error) => {
        if (isDestroyed) return;
        
        // 통합 에러 처리
        const errorInfo = handleSSEError(error, { 
          url, 
          retryCount, 
          maxRetries,
          context: 'SSE 연결 에러'
        });
        
        console.error('❌ SSE 연결 오류:', error);
        
        // 하트비트 타이머 정리
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        
        onError(error);
        
        // 자동 재연결 시도
        if (retryCount < maxRetries && errorInfo.retryable) {
          retryCount++;
          const currentRetryDelay = retryDelay * Math.pow(1.5, retryCount - 1); // 지수 백오프
          console.log(`🔄 SSE 재연결 시도 ${retryCount}/${maxRetries} (${currentRetryDelay}ms 후)`);
          
          reconnectTimer = setTimeout(() => {
            if (!isDestroyed) {
              reconnect();
            }
          }, currentRetryDelay);
        } else {
          console.error('❌ SSE 최대 재시도 횟수 초과, 연결 포기');
          // 최대 재시도 후에도 5분 후에 다시 시도
          setTimeout(() => {
            if (!isDestroyed) {
              console.log('🔄 SSE 장기 재연결 시도');
              retryCount = 0; // 재시도 카운트 리셋
              reconnect();
            }
          }, 300000); // 5분 후
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

// 알림 전용 SSE 연결
export const connectNotificationSSE = ({ onMessage, onError, onOpen }) => {
  return connectSSE(SSE_URLS.notification, { onMessage, onError, onOpen });
};
