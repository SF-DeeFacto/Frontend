/**
 * SSE API 연동 완료:
 * - 모든 Zone에서 실시간 SSE 데이터 사용
 * - 더미 데이터 완전 제거
 * - 백엔드 연결 상태에 따른 정확한 데이터 표시
 */
import { useState, useEffect, useCallback } from 'react';
import { connectMainSSE, connectZoneSSE } from '../services/sse';
import { ZONE_INFO } from '../config/zoneConfig';
import { SENSOR_STATUS, CONNECTION_STATE } from '../config/sensorConfig';
import { handleSSEError } from '../utils/unifiedErrorHandler';


export const useZoneManager = () => {
  console.log('🚀 useZoneManager 훅이 호출되었습니다!');
  
  const [zoneStatuses, setZoneStatuses] = useState({
    A01: SENSOR_STATUS.CONNECTING,
    A02: SENSOR_STATUS.CONNECTING,
    B01: SENSOR_STATUS.CONNECTING,
    B02: SENSOR_STATUS.CONNECTING,
    B03: SENSOR_STATUS.CONNECTING,
    B04: SENSOR_STATUS.CONNECTING,
    C01: SENSOR_STATUS.CONNECTING,
    C02: SENSOR_STATUS.CONNECTING
  });

  const [connectionStates, setConnectionStates] = useState({
    mainSSE: CONNECTION_STATE.DISCONNECTED,
    zoneSSE: {}
  });

  const [lastUpdated, setLastUpdated] = useState({});

  // 메인 SSE 연결
  const connectMainSSEHandler = useCallback(() => {
    try {
      console.log('🔌 useZoneManager: 메인 SSE 연결 시도 중...');
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: CONNECTION_STATE.CONNECTING
      }));

      return connectMainSSE({
        onMessage: (data) => {
          try {
            console.log('📨 useZoneManager: SSE 메시지 수신:', data);
            if (data?.code === 'SUCCESS' && Array.isArray(data.data)) {
              const updateTime = new Date().toLocaleTimeString();
              console.log('✅ useZoneManager: Zone 상태 업데이트 중...', data.data);
              
              data.data.forEach(zone => {
                if (zone.zoneName && zone.status) {
                  console.log(`🔄 Zone ${zone.zoneName}: ${zone.status}`);
                  setZoneStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [zone.zoneName]: zone.status
                  }));
                  
                  setLastUpdated(prev => ({
                    ...prev,
                    [zone.zoneName]: updateTime
                  }));
                }
              });
            } else {
              console.log('⚠️ useZoneManager: 잘못된 데이터 형식:', data);
            }
          } catch (error) {
            console.error('❌ useZoneManager: 메인 SSE 데이터 처리 오류:', error);
          }
        },
        onOpen: () => {
          console.log('✅ useZoneManager: 메인 SSE 연결 성공!');
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: CONNECTION_STATE.CONNECTED
          }));
        },
        onError: (error) => {
          console.error('❌ useZoneManager: 메인 SSE 연결 오류:', error);
          const errorInfo = handleSSEError(error, { 
            context: '메인 SSE 연결' 
          });
          
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: CONNECTION_STATE.ERROR
          }));
          
          console.warn('메인 SSE 연결 오류:', errorInfo.message);
        }
      });
    } catch (error) {
      const errorInfo = handleSSEError(error, { 
        context: '메인 SSE 연결 초기화' 
      });
      
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: CONNECTION_STATE.ERROR
      }));
      
      console.warn('메인 SSE 연결 초기화 오류:', errorInfo.message);
      return null;
    }
  }, []);

  // 초기화
  useEffect(() => {
    console.log('🔄 useZoneManager useEffect 실행');
    let disconnectMainSSE = null;
    let isMounted = true;

    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    console.log('🔑 토큰 확인:', token ? '토큰 있음' : '토큰 없음');
    
    if (!token) {
      console.log('❌ 토큰이 없어서 SSE 연결을 시도하지 않습니다.');
      return;
    }

    console.log('✅ 토큰이 있으므로 SSE 연결을 시도합니다.');
    // 메인 SSE 연결
    disconnectMainSSE = connectMainSSEHandler();

    // 클린업
    return () => {
      isMounted = false;
      
      // SSE 연결 해제
      if (disconnectMainSSE) {
        try {
          disconnectMainSSE();
        } catch (error) {
          console.error('메인 SSE 연결 해제 오류:', error);
        }
      }
    };
  }, [connectMainSSEHandler]);

  // Zone 정보 배열 반환
  const zones = Object.values(ZONE_INFO);

  return {
    zoneStatuses,
    connectionStates,
    lastUpdated,
    zones
  };
};
