/**
 * SSE 모킹 서버
 * 실제 백엔드 없이도 SSE 연결을 시뮬레이션하는 서버
 */

import { createDummyData } from './sseDummyData.js';

// EventSource 모킹 클래스
class MockEventSource {
  constructor(url, options = {}) {
    console.log('🎭 MockEventSource 생성:', url, options);
    this.url = url;
    this.options = options;
    this.readyState = 0; // CONNECTING
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.listeners = new Map();
    this.isDestroyed = false;
    this.intervalId = null;
    
    // 연결 시뮬레이션
    setTimeout(() => {
      if (!this.isDestroyed) {
        console.log('🔌 MockEventSource 연결 시뮬레이션 시작:', url);
        this.readyState = 1; // OPEN
        this.onopen?.({ type: 'open' });
        this.startDataStream();
      }
    }, 100);
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  startDataStream() {
    if (this.isDestroyed) return;
    console.log('📡 MockEventSource 데이터 스트림 시작:', this.url);

    const getData = () => {
      if (this.isDestroyed) return;

      let data;
      
      if (this.url.includes('/home/status')) {
        // 메인 대시보드 데이터
        data = Math.random() < 0.8 ? createDummyData.main() : createDummyData.main();
        console.log('📊 메인 대시보드 데이터 생성:', data);
      } else if (this.url.includes('/home/zone')) {
        // Zone 데이터
        const zoneId = this.url.match(/zoneId=([^&]+)/)?.[1] || 'A01';
        data = createDummyData.zone(zoneId);
        console.log(`🏭 Zone ${zoneId} 데이터 생성:`, data);
      } else if (this.url.includes('/noti/sse/subscribe')) {
        // 알림 데이터
        data = Math.random() < 0.6 ? createDummyData.notification() : createDummyData.alert();
        console.log('🔔 알림 데이터 생성:', data);
      }

      if (data) {
        const event = {
          data: JSON.stringify(data),
          type: 'message',
          lastEventId: Date.now().toString()
        };
        
        console.log('📤 MockEventSource 이벤트 전송:', event);
        this.onmessage?.(event);
        
        // alert 이벤트도 전송 (알림용)
        if (this.url.includes('/noti/sse/subscribe') && Math.random() < 0.3) {
          const alertEvent = {
            data: JSON.stringify(createDummyData.alert()),
            type: 'alert',
            lastEventId: Date.now().toString()
          };
          
          const alertCallbacks = this.listeners.get('alert') || [];
          alertCallbacks.forEach(callback => callback(alertEvent));
        }
      }
    };

    // 초기 데이터 전송
    getData();

    // 주기적 데이터 전송
    const interval = this.url.includes('/noti/sse/subscribe') ? 20000 : 
                    this.url.includes('/home/zone') ? 15000 : 10000;
    
    this.intervalId = setInterval(getData, interval);
  }

  close() {
    this.isDestroyed = true;
    this.readyState = 2; // CLOSED
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// EventSourcePolyfill 모킹
class MockEventSourcePolyfill extends MockEventSource {
  constructor(url, options = {}) {
    super(url, options);
  }
}

// 모킹 식별을 위한 속성 추가
MockEventSourcePolyfill.isMock = true;

// 전역 EventSource를 모킹으로 교체
if (typeof window !== 'undefined') {
  console.log('🎭 EventSource를 모킹으로 교체 중...');
  window.EventSource = MockEventSource;
  window.EventSourcePolyfill = MockEventSourcePolyfill;
  
  // EventSourcePolyfill 모듈도 모킹으로 교체
  if (window.EventSourcePolyfill) {
    console.log('✅ EventSourcePolyfill 모킹 교체 완료');
  }
  
  console.log('✅ EventSource 모킹 교체 완료');
}

// 모킹 서버 초기화 함수
export const initSSEMockServer = () => {
  console.log('🎭 SSE 모킹 서버 초기화됨');
  console.log('📡 사용 가능한 엔드포인트:');
  console.log('  - /dashboard-api/home/status (메인 대시보드)');
  console.log('  - /dashboard-api/home/zone?zoneId=ZONE_ID (Zone별 데이터)');
  console.log('  - /api/noti/sse/subscribe (알림)');
  
  return true;
};

// 모킹 서버 상태 확인
export const getMockServerStatus = () => {
  return {
    isActive: typeof window !== 'undefined' && window.EventSource === MockEventSource,
    endpoints: [
      '/dashboard-api/home/status',
      '/dashboard-api/home/zone?zoneId=ZONE_ID',
      '/api/noti/sse/subscribe'
    ],
    message: 'SSE 모킹 서버가 활성화되어 있습니다.'
  };
};

// 모킹 서버 비활성화
export const disableSSEMockServer = () => {
  if (typeof window !== 'undefined') {
    // 원래 EventSource로 복원 (브라우저 기본값)
    delete window.EventSource;
    delete window.EventSourcePolyfill;
    console.log('🎭 SSE 모킹 서버 비활성화됨');
  }
};

export default {
  MockEventSource,
  MockEventSourcePolyfill,
  initSSEMockServer,
  getMockServerStatus,
  disableSSEMockServer
};
