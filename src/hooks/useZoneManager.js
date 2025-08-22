import { useState, useEffect, useCallback } from 'react';
import { connectMainSSE, connectZoneSSE } from '../services/sse';
import { zoneStatusData, zoneStatusDataV2, zoneStatusDataV3, zoneStatusDataV4 } from '../dummy';
import { ZONE_INFO, SENSOR_STATUS, CONNECTION_STATE } from '../types/sensor';
import { COMMON_ZONE_CONFIG, isRealtimeZone } from '../config/zoneConfig';

export const useZoneManager = () => {
  const [zoneStatuses, setZoneStatuses] = useState({
    zone_A: SENSOR_STATUS.CONNECTING,
    zone_A02: SENSOR_STATUS.YELLOW,
    zone_B: SENSOR_STATUS.CONNECTING,
    zone_B02: SENSOR_STATUS.RED,
    zone_B03: SENSOR_STATUS.GREEN,
    zone_B04: SENSOR_STATUS.YELLOW,
    zone_C01: SENSOR_STATUS.GREEN,
    zone_C02: SENSOR_STATUS.GREEN
  });

  const [connectionStates, setConnectionStates] = useState({
    mainSSE: CONNECTION_STATE.DISCONNECTED,
    zoneSSE: {}
  });

  const [lastUpdated, setLastUpdated] = useState({});

  // 더미 데이터 순환 업데이트
  const updateDummyData = useCallback(() => {
    const dummyDataSets = [zoneStatusData, zoneStatusDataV2, zoneStatusDataV3, zoneStatusDataV4];
    const currentDataIndex = Math.floor((Date.now() / COMMON_ZONE_CONFIG.DATA_UPDATE_INTERVAL) % dummyDataSets.length);
    const currentDummyData = dummyDataSets[currentDataIndex];
    const updateTime = new Date().toLocaleTimeString();
    
    currentDummyData.data.forEach(zone => {
      setZoneStatuses(prevStatuses => ({
        ...prevStatuses,
        [zone.zoneName]: zone.status
      }));
      
      setLastUpdated(prev => ({
        ...prev,
        [zone.zoneName]: updateTime
      }));
    });
  }, []);

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
            if (data?.code === 'OK' && Array.isArray(data.data)) {
              const updateTime = new Date().toLocaleTimeString();
              
              data.data.forEach(zone => {
                if (zone.zoneName && zone.status) {
                  // 실시간 데이터를 사용하는 Zone만 처리
                  if (isRealtimeZone(zone.zoneName.replace('zone_', ''))) {
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

  // 개별 Zone SSE 연결
  const connectZoneSSEHandler = useCallback((zoneId) => {
    try {
      setConnectionStates(prev => ({
        ...prev,
        zoneSSE: {
          ...prev.zoneSSE,
          [zoneId]: CONNECTION_STATE.CONNECTING
        }
      }));
      
      return connectZoneSSE(zoneId, {
        onOpen: () => {
          setConnectionStates(prev => ({
            ...prev,
            zoneSSE: {
              ...prev.zoneSSE,
              [zoneId]: CONNECTION_STATE.CONNECTED
            }
          }));
        },
        onMessage: (data) => {
          try {
            if (data?.code === 'OK' && data.data) {
              const zoneData = data.data;
              const updateTime = new Date().toLocaleTimeString();
              
              if (zoneData.zoneName && zoneData.status) {
                setZoneStatuses(prevStatuses => ({
                  ...prevStatuses,
                  [zoneData.zoneName]: zoneData.status
                }));
                
                setLastUpdated(prev => ({
                  ...prev,
                  [zoneData.zoneName]: updateTime
                }));
              }
            }
          } catch (error) {
            console.error(`${zoneId} Zone SSE 데이터 처리 오류:`, error);
          }
        },
        onError: (error) => {
          console.error(`${zoneId} Zone SSE 연결 오류:`, error);
          setConnectionStates(prev => ({
            ...prev,
            zoneSSE: {
              ...prev.zoneSSE,
              [zoneId]: CONNECTION_STATE.ERROR
            }
          }));
        }
      });
    } catch (error) {
      console.error(`${zoneId} Zone SSE 연결 실패:`, error);
      setConnectionStates(prev => ({
        ...prev,
        zoneSSE: {
          ...prev.zoneSSE,
          [zoneId]: CONNECTION_STATE.ERROR
        }
      }));
      return null;
    }
  }, []);

  // 초기화
  useEffect(() => {
    let disconnectMainSSE = null;
    let disconnectZoneSSE = {};
    let dummyInterval = null;

    // 더미 데이터 초기 설정
    updateDummyData();
    
    // 더미 데이터 주기적 업데이트
    dummyInterval = setInterval(updateDummyData, COMMON_ZONE_CONFIG.DATA_UPDATE_INTERVAL);

    // 메인 SSE 연결
    disconnectMainSSE = connectMainSSEHandler();

    // 실시간 데이터를 사용하는 Zone들만 개별 SSE 연결
    COMMON_ZONE_CONFIG.REALTIME_DATA_ZONES.forEach(zoneId => {
      const disconnect = connectZoneSSEHandler(zoneId);
      if (disconnect) disconnectZoneSSE[zoneId] = disconnect;
    });

    // 클린업
    return () => {
      if (dummyInterval) clearInterval(dummyInterval);
      
      if (disconnectMainSSE) {
        try {
          disconnectMainSSE();
        } catch (error) {
          console.error('메인 SSE 연결 해제 오류:', error);
        }
      }
      
      Object.entries(disconnectZoneSSE).forEach(([zoneId, disconnect]) => {
        try {
          disconnect();
        } catch (error) {
          console.error(`${zoneId} Zone SSE 연결 해제 오류:`, error);
        }
      });
    };
  }, [updateDummyData, connectMainSSEHandler, connectZoneSSEHandler]);

  // Zone 정보 배열 반환
  const zones = Object.values(ZONE_INFO);

  return {
    zoneStatuses,
    connectionStates,
    lastUpdated,
    zones
  };
};
