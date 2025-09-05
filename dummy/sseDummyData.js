/**
 * SSE API 통합 더미 데이터
 * 모든 SSE 엔드포인트의 더미 데이터를 통합 관리
 */

import { mainSSEDummyData, generateMainSSEUpdate, sseConnectionSuccess, sseConnectionError } from './sseMainData.js';
import { generateZoneSSEData, generateZoneSSEUpdate, allZonesSSEData, getZoneSensorStats } from './sseZoneData.js';
import { generateNotificationSSEData, generateAlertSSEData, generateNotificationUpdate, generateNotificationStats } from './sseNotificationData.js';
import { generateZoneSensorData, generateSensorStats, generateSensorHistory } from './sensorDataDummy.js';

// SSE 이벤트 타입
export const SSE_EVENT_TYPES = {
  MESSAGE: 'message',
  ALERT: 'alert',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error'
};

// SSE 더미 서버 클래스
export class SSEDummyServer {
  constructor() {
    this.connections = new Map();
    this.intervalIds = new Map();
    this.isRunning = false;
  }

  // SSE 연결 시뮬레이션
  connect(url, options = {}) {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const connection = {
      id: connectionId,
      url: url,
      options: options,
      isConnected: true,
      lastMessageTime: Date.now()
    };
    
    this.connections.set(connectionId, connection);
    
    // 연결 성공 이벤트 전송
    setTimeout(() => {
      this.sendEvent(connectionId, SSE_EVENT_TYPES.CONNECT, sseConnectionSuccess);
    }, 100);
    
    return {
      connectionId: connectionId,
      disconnect: () => this.disconnect(connectionId)
    };
  }

  // SSE 연결 해제
  disconnect(connectionId) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.isConnected = false;
      this.connections.delete(connectionId);
      
      // 연결 해제 이벤트 전송
      this.sendEvent(connectionId, SSE_EVENT_TYPES.DISCONNECT, {
        code: 'SUCCESS',
        message: 'SSE connection closed',
        timestamp: new Date().toISOString()
      });
    }
    
    // 해당 연결의 모든 인터벌 정리
    if (this.intervalIds.has(connectionId)) {
      this.intervalIds.get(connectionId).forEach(id => clearInterval(id));
      this.intervalIds.delete(connectionId);
    }
  }

  // 이벤트 전송
  sendEvent(connectionId, eventType, data) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.isConnected) return;
    
    const event = {
      type: eventType,
      data: JSON.stringify(data),
      timestamp: new Date().toISOString()
    };
    
    // 콜백 함수 호출
    if (connection.options.onMessage) {
      connection.options.onMessage(data);
    }
    
    console.log(`📡 SSE Event Sent [${connectionId}]:`, event);
  }

  // 메인 대시보드 SSE 시작
  startMainSSE(connectionId, interval = 10000) {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.8) { // 80% 확률로 정상 데이터
        this.sendEvent(connectionId, SSE_EVENT_TYPES.MESSAGE, mainSSEDummyData);
      } else { // 20% 확률로 업데이트 데이터
        this.sendEvent(connectionId, SSE_EVENT_TYPES.MESSAGE, generateMainSSEUpdate());
      }
    }, interval);
    
    this.addInterval(connectionId, intervalId);
  }

  // Zone별 SSE 시작
  startZoneSSE(connectionId, zoneId, interval = 15000) {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.7) { // 70% 확률로 정상 데이터
        this.sendEvent(connectionId, SSE_EVENT_TYPES.MESSAGE, generateZoneSSEData(zoneId));
      } else { // 30% 확률로 업데이트 데이터
        this.sendEvent(connectionId, SSE_EVENT_TYPES.MESSAGE, generateZoneSSEUpdate(zoneId));
      }
    }, interval);
    
    this.addInterval(connectionId, intervalId);
  }

  // 알림 SSE 시작
  startNotificationSSE(connectionId, interval = 20000) {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.6) { // 60% 확률로 일반 알림
        this.sendEvent(connectionId, SSE_EVENT_TYPES.MESSAGE, generateNotificationSSEData());
      } else if (Math.random() < 0.8) { // 20% 확률로 경고 알림
        this.sendEvent(connectionId, SSE_EVENT_TYPES.ALERT, generateAlertSSEData());
      } else { // 20% 확률로 업데이트
        this.sendEvent(connectionId, SSE_EVENT_TYPES.MESSAGE, generateNotificationUpdate());
      }
    }, interval);
    
    this.addInterval(connectionId, intervalId);
  }

  // 인터벌 추가
  addInterval(connectionId, intervalId) {
    if (!this.intervalIds.has(connectionId)) {
      this.intervalIds.set(connectionId, []);
    }
    this.intervalIds.get(connectionId).push(intervalId);
  }

  // 모든 연결 정리
  cleanup() {
    this.connections.forEach((connection, connectionId) => {
      this.disconnect(connectionId);
    });
  }
}

// 더미 데이터 생성 함수들
export const createDummyData = {
  // 메인 대시보드 데이터
  main: () => mainSSEDummyData,
  
  // Zone별 데이터
  zone: (zoneId) => generateZoneSSEData(zoneId),
  
  // 모든 Zone 데이터
  allZones: () => allZonesSSEData(),
  
  // 알림 데이터
  notification: () => generateNotificationSSEData(),
  
  // 경고 알림 데이터
  alert: () => generateAlertSSEData(),
  
  // 센서 통계 데이터
  sensorStats: (zoneId) => generateSensorStats(zoneId),
  
  // 센서 히스토리 데이터
  sensorHistory: (sensorType, sensorId, zoneId, hours = 24) => 
    generateSensorHistory(sensorType, sensorId, zoneId, hours),
  
  // 알림 통계 데이터
  notificationStats: () => generateNotificationStats()
};

// SSE URL 매핑
export const SSE_URLS = {
  main: '/dashboard-api/home/status',
  zone: (zoneId) => `/dashboard-api/home/zone?zoneId=${zoneId}`,
  notification: '/api/noti/sse/subscribe'
};

// 더미 서버 인스턴스
export const dummyServer = new SSEDummyServer();

// 사용 예제
export const usageExamples = {
  // 메인 SSE 연결 예제
  connectMainSSE: () => {
    const connection = dummyServer.connect(SSE_URLS.main, {
      onMessage: (data) => console.log('메인 SSE 데이터:', data),
      onError: (error) => console.error('메인 SSE 오류:', error),
      onOpen: () => console.log('메인 SSE 연결됨')
    });
    
    dummyServer.startMainSSE(connection.connectionId);
    return connection;
  },
  
  // Zone SSE 연결 예제
  connectZoneSSE: (zoneId) => {
    const connection = dummyServer.connect(SSE_URLS.zone(zoneId), {
      onMessage: (data) => console.log(`Zone ${zoneId} SSE 데이터:`, data),
      onError: (error) => console.error(`Zone ${zoneId} SSE 오류:`, error),
      onOpen: () => console.log(`Zone ${zoneId} SSE 연결됨`)
    });
    
    dummyServer.startZoneSSE(connection.connectionId, zoneId);
    return connection;
  },
  
  // 알림 SSE 연결 예제
  connectNotificationSSE: () => {
    const connection = dummyServer.connect(SSE_URLS.notification, {
      onMessage: (data) => console.log('알림 SSE 데이터:', data),
      onError: (error) => console.error('알림 SSE 오류:', error),
      onOpen: () => console.log('알림 SSE 연결됨')
    });
    
    dummyServer.startNotificationSSE(connection.connectionId);
    return connection;
  }
};

// 테스트 함수
export const runTests = () => {
  console.log('🧪 SSE 더미 데이터 테스트 시작');
  
  // 메인 SSE 테스트
  console.log('📊 메인 SSE 데이터:', createDummyData.main());
  
  // Zone SSE 테스트
  console.log('🏭 Zone A01 데이터:', createDummyData.zone('A01'));
  
  // 알림 SSE 테스트
  console.log('🔔 알림 데이터:', createDummyData.notification());
  
  // 센서 통계 테스트
  console.log('📈 센서 통계:', createDummyData.sensorStats('A01'));
  
  console.log('✅ SSE 더미 데이터 테스트 완료');
};

export default {
  SSEDummyServer,
  createDummyData,
  SSE_URLS,
  dummyServer,
  usageExamples,
  runTests,
  SSE_EVENT_TYPES
};
