/**
 * SSE 모킹 훅
 * React 컴포넌트에서 쉽게 사용할 수 있는 SSE 모킹 훅
 */

import { useEffect, useRef, useState } from 'react';
import { initSSEMockServer, getMockServerStatus, disableSSEMockServer } from './sseMockServer.js';
import { createDummyData } from './sseDummyData.js';

// SSE 모킹 상태 관리
const mockServerState = {
  isInitialized: false,
  connections: new Map(),
  messageHandlers: new Map()
};

// SSE 모킹 훅
export const useSSEMock = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // 모킹 서버 초기화
    if (!mockServerState.isInitialized) {
      initSSEMockServer();
      mockServerState.isInitialized = true;
    }

    // 연결 ID 생성
    const connectionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 모킹 연결 생성
    const mockConnection = {
      id: connectionId,
      url: url,
      options: options,
      isConnected: false
    };

    mockServerState.connections.set(connectionId, mockConnection);
    connectionRef.current = connectionId;

    // 연결 시뮬레이션
    const connectTimeout = setTimeout(() => {
      mockConnection.isConnected = true;
      setIsConnected(true);
      setError(null);
      
      // 연결 성공 콜백
      options.onOpen?.({ type: 'open' });
      
      // 데이터 전송 시작
      startDataStream(connectionId, url, options);
    }, 100);

    // 정리 함수
    return () => {
      clearTimeout(connectTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (connectionRef.current) {
        mockServerState.connections.delete(connectionRef.current);
      }
      
      setIsConnected(false);
    };
  }, [url]);

  // 데이터 스트림 시작
  const startDataStream = (connectionId, url, options) => {
    const sendData = () => {
      const connection = mockServerState.connections.get(connectionId);
      if (!connection || !connection.isConnected) return;

      let data;
      
      try {
        if (url.includes('/home/status')) {
          // 메인 대시보드 데이터
          data = Math.random() < 0.8 ? createDummyData.main() : createDummyData.main();
        } else if (url.includes('/home/zone')) {
          // Zone 데이터
          const zoneId = url.match(/zoneId=([^&]+)/)?.[1] || 'A01';
          data = createDummyData.zone(zoneId);
        } else if (url.includes('/noti/sse/subscribe')) {
          // 알림 데이터
          data = Math.random() < 0.6 ? createDummyData.notification() : createDummyData.alert();
        }

        if (data) {
          const event = {
            data: JSON.stringify(data),
            type: 'message',
            lastEventId: Date.now().toString()
          };
          
          setLastMessage(data);
          options.onMessage?.(data);
        }
      } catch (err) {
        setError(err);
        options.onError?.(err);
      }
    };

    // 초기 데이터 전송
    sendData();

    // 주기적 데이터 전송
    const interval = url.includes('/noti/sse/subscribe') ? 20000 : 
                    url.includes('/home/zone') ? 15000 : 10000;
    
    intervalRef.current = setInterval(sendData, interval);
  };

  // 연결 해제
  const disconnect = () => {
    if (connectionRef.current) {
      const connection = mockServerState.connections.get(connectionRef.current);
      if (connection) {
        connection.isConnected = false;
        mockServerState.connections.delete(connectionRef.current);
      }
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsConnected(false);
  };

  return {
    isConnected,
    lastMessage,
    error,
    disconnect
  };
};

// 메인 SSE 모킹 훅
export const useMainSSEMock = (options = {}) => {
  return useSSEMock('/dashboard-api/home/status', options);
};

// Zone SSE 모킹 훅
export const useZoneSSEMock = (zoneId, options = {}) => {
  return useSSEMock(`/dashboard-api/home/zone?zoneId=${zoneId}`, options);
};

// 알림 SSE 모킹 훅
export const useNotificationSSEMock = (options = {}) => {
  return useSSEMock('/api/noti/sse/subscribe', options);
};

// 모킹 서버 상태 확인 훅
export const useMockServerStatus = () => {
  const [status, setStatus] = useState(getMockServerStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getMockServerStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return status;
};

// 모킹 서버 제어 훅
export const useMockServerControl = () => {
  const [isEnabled, setIsEnabled] = useState(mockServerState.isInitialized);

  const enable = () => {
    initSSEMockServer();
    mockServerState.isInitialized = true;
    setIsEnabled(true);
  };

  const disable = () => {
    disableSSEMockServer();
    mockServerState.isInitialized = false;
    setIsEnabled(false);
  };

  return {
    isEnabled,
    enable,
    disable
  };
};

export default {
  useSSEMock,
  useMainSSEMock,
  useZoneSSEMock,
  useNotificationSSEMock,
  useMockServerStatus,
  useMockServerControl
};
