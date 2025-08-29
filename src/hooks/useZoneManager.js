/**
 * SSE API 연동 완료:
 * - 모든 Zone에서 실시간 SSE 데이터 사용
 * - 더미 데이터 완전 제거
 * - 백엔드 연결 상태에 따른 정확한 데이터 표시
 */
import { useState, useEffect, useCallback } from 'react';
import { connectMainSSE, connectZoneSSE } from '../services/sse';
import { ZONE_INFO, SENSOR_STATUS, CONNECTION_STATE } from '../types/sensor';
import { COMMON_ZONE_CONFIG, isRealtimeZone } from '../config/zoneConfig';

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
      // console.log('메인 SSE 연결 시작...'); // 디버깅 로그 추가
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: CONNECTION_STATE.CONNECTING
      }));

      return connectMainSSE({
        onMessage: (data) => {
          try {
            // console.log('메인 SSE 데이터 수신:', data); // 디버깅 로그 추가
            
            if (data?.code === 'OK' && Array.isArray(data.data)) {
              const updateTime = new Date().toLocaleTimeString();
              // console.log('Zone 데이터 배열:', data.data); // 디버깅 로그 추가
              
              data.data.forEach(zone => {
                if (zone.zoneName && zone.status) {
                  // 실시간 데이터를 사용하는 Zone만 처리
                  // zoneName이 "A01", "B01" 형태로 오므로 그대로 사용
                  if (isRealtimeZone(zone.zoneName.toLowerCase())) {
                    // console.log(`Zone 상태 업데이트: ${zone.zoneName} = ${zone.status}`); // 디버깅 로그 추가
                    
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
              // console.log('올바르지 않은 데이터 형식:', data); // 디버깅 로그 추가
            }
          } catch (error) {
            console.error('메인 SSE 데이터 처리 오류:', error);
          }
        },
        onOpen: () => {
          // console.log('메인 SSE 연결 성공!'); // 디버깅 로그 추가
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

  // 개별 Zone SSE 연결 (현재 사용하지 않음)
  // const connectZoneSSEHandler = useCallback((zoneId) => {
  //   try {
  //     setConnectionStates(prev => ({
  //       ...prev,
  //       zoneSSE: {
  //         ...prev.zoneSSE,
  //         [zoneId]: CONNECTION_STATE.CONNECTING
  //       }
  //     }));
      
  //     return connectZoneSSE(zoneId, {
  //       onOpen: () => {
  //         setConnectionStates(prev => ({
  //           ...prev,
  //           zoneSSE: {
  //             ...prev.zoneSSE,
  //             [zoneId]: CONNECTION_STATE.CONNECTED
  //           }
  //         }));
  //       },
  //       onMessage: (data) => {
  //         try {
  //           console.log(`${zoneId} Zone SSE 데이터 수신:`, data); // 디버깅 로그 추가
          
  //           if (data?.code === 'OK' && data.data) {
  //             const zoneData = data.data;
  //             const updateTime = new Date().toLocaleTimeString();
            
  //             if (zoneData.zoneName && zoneData.status) {
  //               console.log(`개별 Zone 상태 업데이트: ${zoneData.zoneName} = ${zoneData.status}`); // 디버깅 로그 추가
              
  //               // zoneName이 "A01", "B01" 형태로 오므로 그대로 사용
  //               setZoneStatuses(prevStatuses => ({
  //                 ...prevStatuses,
  //                 [zoneData.zoneName]: zoneData.status
  //               }));
              
  //               setLastUpdated(prev => ({
  //                 ...prev,
  //                 [zoneData.zoneName]: updateTime
  //               }));
  //             } else {
  //               console.log('Zone 데이터에 zoneName 또는 status가 없음:', zoneData); // 디버깅 로그 추가
  //             }
  //           } else {
  //             console.log(`${zoneId} Zone 올바르지 않은 데이터 형식:`, data); // 디버깅 로그 추가
  //           }
  //         } catch (error) {
  //           console.error(`${zoneId} Zone SSE 데이터 처리 오류:`, error);
  //         }
  //       },
  //       onError: (error) => {
  //         console.error(`${zoneId} Zone SSE 연결 오류:`, error);
  //         setConnectionStates(prev => ({
  //           ...prev,
  //           zoneSSE: {
  //             ...prev.zoneSSE,
  //             [zoneId]: CONNECTION_STATE.ERROR
  //           }
  //         }));
  //       }
  //     });
  //   } catch (error) {
  //     console.error(`${zoneId} Zone SSE 연결 실패:`, error);
  //     setConnectionStates(prev => ({
  //       ...prev,
  //       zoneSSE: {
  //         ...prev.zoneSSE,
  //         [zoneId]: CONNECTION_STATE.ERROR
  //       }
  //     }));
  //     return null;
  //   }
  // }, []);

  // 초기화
  useEffect(() => {
    let disconnectMainSSE = null;
    // let disconnectZoneSSE = {}; // 개별 Zone SSE 연결 제거

    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    if (!token) {
      // console.log('토큰이 없어 SSE 연결을 건너뜁니다.');
      return;
    }

    // 메인 SSE 연결만 사용
    disconnectMainSSE = connectMainSSEHandler();

    // 개별 Zone SSE 연결 제거
    // COMMON_ZONE_CONFIG.REALTIME_DATA_ZONES.forEach(zoneId => {
    //   const disconnect = connectZoneSSEHandler(zoneId);
    //   if (disconnect) disconnectZoneSSE[zoneId] = disconnect;
    // });

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
      
      // 개별 Zone SSE 연결 해제 제거
      // Object.entries(disconnectZoneSSE).forEach(([zoneId, disconnect]) => {
      //   try {
      //     disconnect();
      //   } catch (error) {
      //     console.error(`${zoneId} Zone SSE 연결 해제 오류:`, error);
      //   }
      // });
    };
  }, [connectMainSSEHandler]); // connectZoneSSEHandler 제거

  // Zone 상태 변경 감지 (디버깅용)
  // useEffect(() => {
  //   console.log('현재 Zone 상태:', zoneStatuses);
  // }, [zoneStatuses]);

  // Zone 정보 배열 반환
  const zones = Object.values(ZONE_INFO);

  return {
    zoneStatuses,
    connectionStates,
    lastUpdated,
    zones
  };
};
