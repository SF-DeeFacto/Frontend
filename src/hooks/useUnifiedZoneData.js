import { useState, useEffect, useCallback } from 'react';
import { groupSensorData, formatTime } from '../utils/sensorUtils';
import { CONNECTION_STATE } from '../types/sensor';
import { dashboardApi } from '../services/api/dashboard_api';
import { mapToComponentFormat } from '../utils/zoneDataMapper';
import { unifiedSSEManager, subscribeToZone } from '../services/unifiedSSEManager';

/**
 * 통합 존 데이터 훅
 * 메인 SSE 연결을 통해 모든 존 데이터를 수신하고, 필요한 존 데이터만 필터링하여 제공
 */
export const useUnifiedZoneData = (zoneId) => {
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATE.CONNECTING);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [subscription, setSubscription] = useState(null);

  /**
   * Zone의 센서 데이터를 가져오는 함수 (초기 로딩용)
   */
  const getZoneSensorDataCallback = useCallback(async () => {
    try {
      const upperZoneId = zoneId.toUpperCase();
      console.log(`🔄 ${upperZoneId} 존 초기 API 호출 시작...`);
      
      const response = await dashboardApi.getZoneData(upperZoneId);
      console.log(`📡 ${upperZoneId} 존 초기 API 응답:`, {
        response,
        hasData: !!response?.data,
        dataLength: response?.data?.length || 0,
        timestamp: new Date().toLocaleTimeString()
      });
      
      if (response && response.data && response.data.length > 0) {
        const mappedData = mapToComponentFormat(response, upperZoneId);
        console.log(`🔄 ${upperZoneId} 존 초기 데이터 매핑 결과:`, {
          mappedData,
          hasFirstElement: !!mappedData?.[0],
          hasSensors: !!mappedData?.[0]?.sensors,
          sensorsLength: mappedData?.[0]?.sensors?.length || 0,
          timestamp: new Date().toLocaleTimeString()
        });
        
        if (mappedData && mappedData[0]) {
          const sensors = {};
          mappedData[0].sensors.forEach(sensor => {
            sensors[sensor.sensorId] = sensor;
          });
          
          console.log(`✅ ${upperZoneId} 존 초기 API 데이터 처리 완료:`, {
            센서개수: Object.keys(sensors).length,
            센서목록: Object.keys(sensors),
            센서데이터: sensors,
            timestamp: new Date().toLocaleTimeString()
          });
          return sensors;
        }
      } else {
        console.log(`🔄 ${upperZoneId} 존 - 초기 API 응답에 데이터 없음:`, {
          response,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      console.error(`❌ ${zoneId} 존 초기 API 호출 실패:`, {
        error: error.message,
        errorType: error.name,
        stack: error.stack,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    console.log(`🔄 ${zoneId} 존 - 초기 데이터 없음 (빈 객체 반환)`);
    return {};
  }, [zoneId]);

  /**
   * 센서 데이터 업데이트 함수
   */
  const updateSensorData = useCallback(async () => {
    console.log(`🔄 ${zoneId}존 센서 데이터 업데이트 시작...`);
    const rawSensorData = await getZoneSensorDataCallback();
    const groupedSensors = groupSensorData(rawSensorData);
    
    console.log(`📊 ${zoneId}존 센서 데이터 그룹화 완료:`, {
      원본데이터: rawSensorData,
      그룹화된데이터: groupedSensors,
      센서타입별개수: Object.keys(groupedSensors).map(type => ({
        타입: type,
        개수: groupedSensors[type]?.length || 0
      })),
      timestamp: new Date().toLocaleTimeString()
    });
    
    setSensorData(groupedSensors);
    setLastUpdated(new Date().toLocaleTimeString());
    console.log(`✅ ${zoneId}존 센서 데이터 설정 완료:`, {
      센서데이터: groupedSensors,
      업데이트시간: new Date().toLocaleTimeString()
    });
  }, [getZoneSensorDataCallback, zoneId]);

  /**
   * SSE 데이터 처리 함수
   */
  const handleSSEData = useCallback((data) => {
    const upperZoneId = zoneId.toUpperCase();
    console.log(`📨 ${upperZoneId} 존 SSE 데이터 처리 시작:`, {
      원본데이터: data,
      zoneId: upperZoneId,
      timestamp: new Date().toLocaleTimeString()
    });

    try {
      if (data && data.data && data.data.length > 0) {
        // 해당 존의 데이터만 필터링
        const zoneData = data.data.find(zone => 
          zone.zoneName?.toUpperCase() === upperZoneId
        );

        if (zoneData) {
          console.log(`✅ ${upperZoneId} 존 데이터 발견:`, {
            zoneData,
            timestamp: new Date().toLocaleTimeString()
          });

          // 백엔드 응답을 컴포넌트 형식으로 변환
          const mappedData = mapToComponentFormat({ data: [zoneData] }, upperZoneId);
          console.log(`🔄 ${upperZoneId} 존 SSE 데이터 매핑 결과:`, {
            mappedData,
            hasFirstElement: !!mappedData?.[0],
            hasSensors: !!mappedData?.[0]?.sensors,
            sensorsLength: mappedData?.[0]?.sensors?.length || 0,
            timestamp: new Date().toLocaleTimeString()
          });

          if (mappedData && mappedData[0] && mappedData[0].sensors) {
            const sensors = {};
            if (Array.isArray(mappedData[0].sensors)) {
              mappedData[0].sensors.forEach(sensor => {
                sensors[sensor.sensorId] = sensor;
                console.log(`센서 추가: ${sensor.sensorId} (${sensor.sensorType}) - SSE 데이터`);
              });
            }

            const groupedSensors = groupSensorData(sensors);
            console.log(`📊 ${upperZoneId}존 SSE 데이터 그룹화 결과:`, {
              원본센서: sensors,
              그룹화된센서: groupedSensors,
              센서타입별개수: Object.keys(groupedSensors).map(type => ({
                타입: type,
                개수: groupedSensors[type]?.length || 0
              })),
              timestamp: new Date().toLocaleTimeString()
            });

            setSensorData(groupedSensors);
            setLastUpdated(new Date().toLocaleTimeString());
            console.log(`✅ ${upperZoneId}존 SSE 데이터로 센서 데이터 업데이트 완료:`, {
              센서데이터: groupedSensors,
              업데이트시간: new Date().toLocaleTimeString()
            });
          } else {
            console.warn(`${upperZoneId}존 SSE 데이터 구조가 예상과 다름:`, {
              mappedData,
              문제점: 'mappedData[0].sensors가 없거나 잘못된 형식',
              timestamp: new Date().toLocaleTimeString()
            });
          }
        } else {
          console.log(`${upperZoneId} 존 데이터가 SSE 스트림에 없음:`, {
            전체데이터: data.data,
            찾는존: upperZoneId,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } else {
        console.log(`${upperZoneId}존 SSE 데이터가 비어있음:`, {
          data,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      console.error(`${upperZoneId}존 SSE 데이터 처리 오류:`, {
        error: error.message,
        errorType: error.name,
        stack: error.stack,
        원본데이터: data,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }, [zoneId]);

  // 초기화 및 데이터 설정
  useEffect(() => {
    console.log(`🔄 ${zoneId} Zone 변경 감지, 통합 SSE 관리자 사용:`, {
      zoneId,
      timestamp: new Date().toLocaleTimeString()
    });
    
    setSensorData({});
    setIsLoading(true);
    setConnectionState(CONNECTION_STATE.CONNECTING);
    
    const upperZoneId = zoneId.toUpperCase();
    
    // 1. 초기 데이터 로딩 (비동기 처리)
    const initializeZone = async () => {
      try {
        await updateSensorData();
        
        // 2. SSE 구독 설정 (메인 연결을 통해 데이터 수신)
        console.log(`${upperZoneId} 존 - SSE 구독 설정 시작`);
        
        const unsubscribe = subscribeToZone(upperZoneId, handleSSEData);
        setSubscription(unsubscribe);
        
        // 3. 연결 상태 업데이트
        setConnectionState(CONNECTION_STATE.CONNECTED);
        setIsLoading(false);
        
        console.log(`${upperZoneId} 존 - 통합 SSE 구독 설정 완료:`, {
          zoneId: upperZoneId,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error(`${upperZoneId} 존 초기화 실패:`, {
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        });
        
        // 에러 발생 시에도 로딩 상태 해제
        setConnectionState(CONNECTION_STATE.ERROR);
        setIsLoading(false);
      }
    };
    
    initializeZone();
    
    return () => {
      console.log(`🔌 ${upperZoneId} 존 SSE 구독 해제:`, {
        zoneId: upperZoneId,
        timestamp: new Date().toLocaleTimeString()
      });
      
      if (subscription) {
        subscription();
      }
    };
  }, [zoneId, updateSensorData, handleSSEData]);

  // 연결 상태 모니터링
  useEffect(() => {
    const checkConnectionState = () => {
      const mainState = unifiedSSEManager.getConnectionState('main');
      const zoneState = unifiedSSEManager.getConnectionState(zoneId.toUpperCase());
      
      console.log(`${zoneId} 존 연결 상태 체크:`, {
        메인SSE: mainState,
        존SSE: zoneState,
        timestamp: new Date().toLocaleTimeString()
      });
      
      if (mainState === 'connected') {
        setConnectionState(CONNECTION_STATE.CONNECTED);
      } else if (mainState === 'error') {
        setConnectionState(CONNECTION_STATE.ERROR);
      } else if (mainState === 'connecting') {
        setConnectionState(CONNECTION_STATE.CONNECTING);
      }
    };

    // 초기 상태 체크
    checkConnectionState();
    
    // 주기적 상태 체크
    const interval = setInterval(checkConnectionState, 10000); // 10초마다
    
    return () => clearInterval(interval);
  }, [zoneId]);

  return {
    sensorData,
    isLoading,
    connectionState,
    lastUpdated: formatTime(lastUpdated),
    updateSensorData,
    // 추가 정보
    connectionStates: unifiedSSEManager.getAllConnectionStates(),
    mainConnectionState: unifiedSSEManager.getConnectionState('main')
  };
};
