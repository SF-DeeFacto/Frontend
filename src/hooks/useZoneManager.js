/**
 * SSE API 연동 완료:
 * - 모든 Zone에서 실시간 SSE 데이터 사용
 * - 더미 데이터 완전 제거
 * - 백엔드 연결 상태에 따른 정확한 데이터 표시
 */
import { useState, useEffect, useCallback } from 'react';
import { connectMainSSE, connectZoneSSE } from '../services/sse';
import { ZONE_INFO, SENSOR_STATUS, CONNECTION_STATE } from '../config/sensorConfig';
import { handleSSEError } from '../utils/unifiedErrorHandler';


export const useZoneManager = () => {
  // ZONE_INFO에서 동적으로 초기 상태 생성
  const initialZoneStatuses = Object.keys(ZONE_INFO).reduce((acc, zoneId) => {
    acc[zoneId] = SENSOR_STATUS.CONNECTING;
    return acc;
  }, {});
  
  const [zoneStatuses, setZoneStatuses] = useState(initialZoneStatuses);

  const [connectionStates, setConnectionStates] = useState({
    mainSSE: CONNECTION_STATE.DISCONNECTED,
    zoneSSE: {}
  });

  const [lastUpdated, setLastUpdated] = useState({});

  // 메인 SSE 연결
  const connectMainSSEHandler = useCallback(() => {
    try {
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: CONNECTION_STATE.CONNECTING
      }));

      return connectMainSSE({
        onMessage: (data) => {
          try {
            if (data?.code === 'SUCCESS' && Array.isArray(data.data)) {
              const updateTime = new Date().toLocaleTimeString();
              
              data.data.forEach(zone => {
                if (zone.zoneName && zone.status) {
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
            }
          } catch (error) {
            console.error('메인 SSE 데이터 처리 오류:', error);
          }
        },
        onOpen: () => {
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: CONNECTION_STATE.CONNECTED
          }));
        },
        onError: (error) => {
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
    let disconnectMainSSE = null;
    let isMounted = true;

    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }

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
