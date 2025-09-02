import { useState, useEffect, useCallback } from 'react';
import { connectMainSSE, connectZoneSSE } from '../services/sse';
import { ZONE_INFO, SENSOR_STATUS, CONNECTION_STATE } from '../types/sensor';


export const useZoneManager = () => {
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
      console.log('메인 SSE 연결 시작...');
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: CONNECTION_STATE.CONNECTING
      }));

      return connectMainSSE({
        onMessage: (data) => {
          try {
            console.log('메인 SSE 데이터 수신:', data);
            
            if (data?.code === 'OK' && Array.isArray(data.data)) {
              const updateTime = new Date().toLocaleTimeString();
              console.log('Zone 데이터 배열:', data.data);
              
              data.data.forEach(zone => {
                if (zone.zoneName && zone.status) {
                  // 모든 Zone 처리 (실시간 데이터 필터링 제거)
                  if (zone.zoneName) {
                    console.log(`Zone 상태 업데이트: ${zone.zoneName} = ${zone.status}`);
                    
                    setZoneStatuses(prevStatuses => ({
                      ...prevStatuses,
                      [zone.zoneName]: zone.status
                    }));
                    
                    setLastUpdated(prev => ({
                      ...prev,
                      [zone.zoneName]: updateTime
                    }));
                  }
                }
              });
            } else {
              console.log('올바르지 않은 데이터 형식:', data);
            }
          } catch (error) {
            console.error('메인 SSE 데이터 처리 오류:', error);
          }
        },
        onOpen: () => {
          console.log('메인 SSE 연결 성공!');
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: CONNECTION_STATE.CONNECTED
          }));
        },
        onError: (error) => {
          console.error('메인 SSE 연결 오류:', error);
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: CONNECTION_STATE.ERROR
          }));
        }
      });
    } catch (error) {
      console.error('메인 SSE 연결 실패:', error);
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: CONNECTION_STATE.ERROR
      }));
      return null;
    }
  }, []);

  // 초기화
  useEffect(() => {
    let disconnectMainSSE = null;

    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('토큰이 없어 SSE 연결을 건너뜁니다.');
      return;
    }

    // 메인 SSE 연결
    disconnectMainSSE = connectMainSSEHandler();

    // 클린업
    return () => {
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

  // Zone 상태 변경 감지 (디버깅용)
  useEffect(() => {
    console.log('현재 Zone 상태:', zoneStatuses);
  }, [zoneStatuses]);

  // Zone 정보 배열 반환
  const zones = Object.values(ZONE_INFO);

  return {
    zoneStatuses,
    connectionStates,
    lastUpdated,
    zones
  };
};
