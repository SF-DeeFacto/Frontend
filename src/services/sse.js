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
  const retryDelay = 500; // 0.5초
  
  let lastMessageTime = Date.now(); // 마지막 메시지 수신 시간
  let heartbeatTimer = null; // 하트비트 타이머
  let reconnectTimer = null; // 재연결 타이머

  const createEventSource = () => {
    try {
      console.log(`🔄 SSE 연결 시도 ${retryCount + 1}/${maxRetries + 1}:`, url);
      console.log('🔗 SSE 연결 URL:', url);
      console.log('🔑 토큰:', token ? '있음' : '없음');
      console.log('⏰ 연결 시도 시간:', new Date().toLocaleTimeString());
      
      eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      eventSource.onopen = (event) => {
        console.log('✅ SSE 연결 성공!', url);
        console.log('🔗 연결 상태:', eventSource.readyState);
        console.log('⏰ 연결 성공 시간:', new Date().toLocaleTimeString());
        lastMessageTime = Date.now();
        
        // 하트비트 타이머 시작
        heartbeatTimer = setInterval(() => {
          const now = Date.now();
          const timeSinceLastMessage = now - lastMessageTime;
          console.log(`💓 SSE 하트비트 체크: 마지막 메시지로부터 ${timeSinceLastMessage}ms 경과`);
          
          if (timeSinceLastMessage > 60000) { // 1분 이상 메시지 없음
            console.warn('⚠️ SSE 연결이 응답하지 않습니다. 재연결을 시도합니다.');
            reconnect();
          }
        }, 30000); // 30초마다 체크
        
        onOpen?.(event);
      };
      
      eventSource.onmessage = (event) => {
        lastMessageTime = Date.now();
        console.log(`📨 SSE 데이터 수신:`, {
          url,
          timestamp: new Date().toLocaleTimeString(),
          data: event.data,
          dataLength: event.data?.length || 0,
          eventType: event.type
        });
        
        try {
          const parsedData = JSON.parse(event.data);
          console.log('✅ SSE 데이터 파싱 성공:', {
            url,
            parsedData,
            dataType: typeof parsedData,
            hasCode: 'code' in parsedData,
            hasData: 'data' in parsedData,
            dataLength: Array.isArray(parsedData.data) ? parsedData.data.length : 'N/A'
          });
          
          onMessage(parsedData);
        } catch (parseError) {
          console.error('❌ SSE 데이터 파싱 실패:', {
            url,
            originalData: event.data,
            error: parseError.message
          });
          onError(parseError);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('❌ SSE 연결 오류:', {
          url,
          error: error,
          errorType: error.type,
          errorMessage: error.message,
          readyState: eventSource?.readyState,
          timestamp: new Date().toLocaleTimeString()
        });
        
        // 하트비트 타이머 정리
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        
        onError(error);
        
        // 자동 재연결 시도
        if (retryCount < maxRetries) {
          console.log(`🔄 SSE 연결 재시도 ${retryCount + 1}/${maxRetries}... (2000ms 후)`);
          retryCount++;
          
          reconnectTimer = setTimeout(() => {
            reconnect();
          }, 2000);
        } else {
          console.error('❌ SSE 최대 재연결 시도 횟수 초과:', {
            url,
            maxRetries,
            totalAttempts: retryCount + 1
          });
        }
      };
      
    } catch (error) {
      console.error('❌ EventSource 생성 오류:', {
        url,
        error: error.message,
        errorType: error.name,
        stack: error.stack
      });
      onError(error);
    }
  };

  // 재연결 함수
  const reconnect = () => {
    console.log(`🔄 SSE 재연결 시도: ${url}`);
    
    if (eventSource) {
      console.log('🔌 기존 SSE 연결 해제');
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
    console.log(`🔌 SSE 연결 해제: ${url}`);
    console.log('🧹 SSE 리소스 정리 시작');
    
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
      console.log('🔌 EventSource 연결 해제');
      eventSource.close();
      eventSource = null;
    }
    
    console.log('✅ SSE 리소스 정리 완료');
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
