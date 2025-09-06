// SSE 통신을 위한 설정
// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 SSE 연결 방법을 제공합니다.

// EventSourcePolyfill import 추가
import { EventSourcePolyfill } from 'event-source-polyfill';
import { handleSSEError } from '../utils/unifiedErrorHandler';
import { SYSTEM_CONFIG, STORAGE_KEYS } from '../config/constants';

// 전역 SSE 연결 관리자
class SSEConnectionManager {
  constructor() {
    this.connections = new Map(); // 연결 ID -> disconnect 함수 매핑
    this.connectionId = 0;
  }

  // SSE 연결 등록
  registerConnection(disconnectFn) {
    const id = ++this.connectionId;
    this.connections.set(id, disconnectFn);
    console.log(`🔌 SSE 연결 등록됨 (ID: ${id}), 총 연결 수: ${this.connections.size}`);
    return id;
  }

  // 특정 연결 해제
  disconnectConnection(id) {
    const disconnectFn = this.connections.get(id);
    if (disconnectFn) {
      console.log(`🔌 SSE 연결 해제 중 (ID: ${id})`);
      disconnectFn();
      this.connections.delete(id);
      console.log(`✅ SSE 연결 해제 완료 (ID: ${id}), 남은 연결 수: ${this.connections.size}`);
    } else {
      console.warn(`⚠️ SSE 연결을 찾을 수 없음 (ID: ${id})`);
    }
  }

  // 모든 SSE 연결 해제 (로그아웃 시 사용)
  disconnectAllConnections() {
    const connectionCount = this.connections.size;
    console.log(`🔌 모든 SSE 연결 해제 시작... (총 ${connectionCount}개 연결)`);
    
    if (connectionCount === 0) {
      console.log('ℹ️ 해제할 SSE 연결이 없습니다.');
      return;
    }
    
    this.connections.forEach((disconnectFn, id) => {
      try {
        console.log(`🔌 SSE 연결 해제 중 (ID: ${id})`);
        disconnectFn();
        console.log(`✅ SSE 연결 해제 완료 (ID: ${id})`);
      } catch (error) {
        console.error(`❌ SSE 연결 해제 실패 (ID: ${id}):`, error);
      }
    });
    
    this.connections.clear();
    console.log(`🎉 모든 SSE 연결 해제 완료! (${connectionCount}개 연결 해제됨)`);
  }

  // 연결 상태 확인
  getConnectionCount() {
    return this.connections.size;
  }
}

// 전역 SSE 연결 관리자 인스턴스
export const sseConnectionManager = new SSEConnectionManager();

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
    console.log('🔍 SSE 연결 설정:', {
      url,
      token: token ? `${token.substring(0, 10)}...` : '없음',
      maxRetries,
      retryDelay
    });
    
    try {
      eventSource = new EventSourcePolyfill(url, {
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
          timestamp: new Date().toISOString(),
          connectionId: '등록 예정'
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

  // 정리 함수 생성
  const disconnectFn = () => {
    console.log('🔌 SSE 연결 해제 함수 실행:', url);
    isDestroyed = true; // 연결 해제 상태로 설정
    
    if (reconnectTimer) {
      console.log('⏰ 재연결 타이머 정리');
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (heartbeatTimer) {
      console.log('💓 하트비트 타이머 정리');
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    
    if (eventSource) {
      console.log('🔌 EventSource 연결 종료');
      eventSource.close();
      eventSource = null;
    }
    
    console.log('✅ SSE 연결 해제 완료:', url);
  };

  // 전역 연결 관리자에 등록
  const connectionId = sseConnectionManager.registerConnection(disconnectFn);

  // 정리 함수 반환 (등록된 연결 ID도 함께 반환)
  return () => {
    disconnectFn();
    sseConnectionManager.disconnectConnection(connectionId);
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

// 알림 전용 SSE 연결 (데이터가 없어도 연결 유지)
export const connectNotificationSSE = ({ onMessage, onError, onOpen }) => {
  // 인증 토큰 가져오기
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  
  // 토큰이 없으면 연결하지 않음
  if (!token) {
    onError(new Error('인증 토큰이 없습니다.'));
    return () => {}; // 빈 함수 반환
  }
  
  // 알림 SSE 전용 설정
  let eventSource = null;
  let retryCount = 0;
  const maxRetries = SYSTEM_CONFIG.SSE_MAX_RETRIES;
  const retryDelay = SYSTEM_CONFIG.SSE_RETRY_DELAY;
  
  let lastMessageTime = Date.now();
  let heartbeatTimer = null;
  let reconnectTimer = null;
  let isDestroyed = false;

  const createEventSource = () => {
    if (isDestroyed) return;
    
    console.log('🔔 알림 SSE 연결 시작:', SSE_URLS.notification);
    
    try {
      eventSource = new EventSourcePolyfill(SSE_URLS.notification, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        // 알림 SSE 전용 타임아웃 설정 (더 길게)
        heartbeatTimeout: SYSTEM_CONFIG.NOTIFICATION_SSE_HEARTBEAT_TIMEOUT,
      });
      
      eventSource.onopen = (event) => {
        if (isDestroyed) return;
        
        console.log('✅ 알림 SSE 연결 성공');
        lastMessageTime = Date.now();
        retryCount = 0;
        
        // 알림 SSE 전용 하트비트 타이머 (더 긴 간격)
        heartbeatTimer = setInterval(() => {
          if (isDestroyed) return;
          
          const now = Date.now();
          const timeSinceLastMessage = now - lastMessageTime;
          
          if (timeSinceLastMessage > SYSTEM_CONFIG.NOTIFICATION_SSE_HEARTBEAT_TIMEOUT) {
            console.log('⚠️ 알림 SSE 하트비트 타임아웃, 재연결 시도');
            reconnect();
          }
        }, SYSTEM_CONFIG.NOTIFICATION_SSE_HEARTBEAT_CHECK_INTERVAL);
        
        onOpen?.(event);
      };
      
      eventSource.onmessage = (event) => {
        if (isDestroyed) return;
        
        lastMessageTime = Date.now();
        
        try {
          const parsedData = JSON.parse(event.data);
          console.log('🔔 알림 SSE 메시지 수신:', parsedData);
          onMessage(parsedData);
        } catch (parseError) {
          console.error('❌ 알림 SSE 메시지 파싱 오류:', parseError);
          onError(parseError);
        }
      };

      // alert 이벤트 처리
      eventSource.addEventListener('alert', (event) => {
        if (isDestroyed) return;
        
        lastMessageTime = Date.now();
        
        try {
          const parsedData = JSON.parse(event.data);
          console.log('🚨 알림 SSE alert 이벤트 수신:', parsedData);
          onMessage(parsedData);
        } catch (parseError) {
          console.error('❌ 알림 SSE alert 메시지 파싱 오류:', parseError);
          onError(parseError);
        }
      });
      
      eventSource.onerror = (error) => {
        if (isDestroyed) return;
        
        console.error('❌ 알림 SSE 연결 오류:', error);
        
        // 하트비트 타이머 정리
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        
        onError(error);
        
        // 자동 재연결 시도
        if (retryCount < maxRetries) {
          retryCount++;
          const currentRetryDelay = retryDelay * Math.pow(1.5, retryCount - 1);
          console.log(`🔄 알림 SSE 재연결 시도 ${retryCount}/${maxRetries} (${currentRetryDelay}ms 후)`);
          
          reconnectTimer = setTimeout(() => {
            if (!isDestroyed) {
              reconnect();
            }
          }, currentRetryDelay);
        } else {
          console.error('❌ 알림 SSE 최대 재시도 횟수 초과, 연결 포기');
          // 최대 재시도 후에도 10분 후에 다시 시도
          setTimeout(() => {
            if (!isDestroyed) {
              console.log('🔄 알림 SSE 장기 재연결 시도');
              retryCount = 0;
              reconnect();
            }
          }, 600000); // 10분 후
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

  // 정리 함수 생성
  const disconnectFn = () => {
    console.log('🔔 알림 SSE 연결 해제 함수 실행');
    isDestroyed = true;
    
    if (reconnectTimer) {
      console.log('⏰ 알림 SSE 재연결 타이머 정리');
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (heartbeatTimer) {
      console.log('💓 알림 SSE 하트비트 타이머 정리');
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    
    if (eventSource) {
      console.log('🔔 알림 EventSource 연결 종료');
      eventSource.close();
      eventSource = null;
    }
    
    console.log('✅ 알림 SSE 연결 해제 완료');
  };

  // 전역 연결 관리자에 등록
  const connectionId = sseConnectionManager.registerConnection(disconnectFn);

  // 정리 함수 반환 (등록된 연결 ID도 함께 반환)
  return () => {
    disconnectFn();
    sseConnectionManager.disconnectConnection(connectionId);
  };
};
