import { useState, useEffect, useCallback } from 'react';
import { groupSensorData, formatTime } from '../utils/sensorUtils';
import { CONNECTION_STATE } from '../types/sensor';
import { dashboardApi } from '../services/api/dashboard_api';
import { connectZoneSSE } from '../services/sse';
import { mapToComponentFormat } from '../utils/zoneDataMapper';

export const useZoneSensorData = (zoneId) => {
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATE.CONNECTING);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Zone의 센서 데이터를 가져오는 함수
   * 모든 존에 대해 실제 API 사용
   */
  const getZoneSensorDataCallback = useCallback(async () => {
    try {
      // zoneId를 대문자로 변환하여 API 호출
      const upperZoneId = zoneId.toUpperCase();
      const response = await dashboardApi.getZoneData(upperZoneId);
      if (response && response.data && response.data.length > 0) {
        // 백엔드 응답을 컴포넌트 형식으로 변환
        const mappedData = mapToComponentFormat(response, upperZoneId);
        if (mappedData && mappedData[0]) {
          const sensors = {};
          mappedData[0].sensors.forEach(sensor => {
            sensors[sensor.sensorId] = sensor;
          });
          
          console.log(`🔄 ${upperZoneId} 존 실제 API 데이터 가져옴 (센서 개수: ${Object.keys(sensors).length}개)`);
          return sensors;
        }
      }
    } catch (error) {
      console.error(`${zoneId} 존 API 호출 실패:`, error);
      // API 실패 시 빈 데이터 반환
    }
    
    // API 실패 시 빈 데이터 반환
    console.log(`🔄 ${zoneId} 존 - 데이터 없음`);
    return {};
  }, [zoneId]);

  /**
   * 센서 데이터 업데이트 함수
   */
  const updateSensorData = useCallback(async () => {
    const rawSensorData = await getZoneSensorDataCallback();
    const groupedSensors = groupSensorData(rawSensorData);
    
    setSensorData(groupedSensors);
    setLastUpdated(new Date().toLocaleTimeString());
    console.log(`${zoneId}존 센서 데이터 설정 완료:`, groupedSensors);
  }, [getZoneSensorDataCallback, zoneId]);

  // 초기화 및 데이터 설정
  useEffect(() => {
    // Zone이 변경될 때마다 상태 초기화
    console.log(`🔄 ${zoneId} Zone 변경 감지, 상태 초기화`);
    setSensorData({});
    setIsLoading(true);
    setConnectionState(CONNECTION_STATE.CONNECTING);
    
    // 모든 존에 대해 SSE 연결 시작
    const upperZoneId = zoneId.toUpperCase();
    console.log(`${upperZoneId} 존 - SSE 연결 시작`);
    setConnectionState(CONNECTION_STATE.CONNECTING);
    
    // SSE 연결 시작 (존별로, 대문자로)
    const disconnectSSE = connectZoneSSE(upperZoneId, {
      onOpen: (event) => {
        console.log(`✅ ${upperZoneId} 존 SSE 연결 성공`);
        setConnectionState(CONNECTION_STATE.CONNECTED);
        setIsLoading(false);
      },
      
      onMessage: (data) => {
        console.log(`📨 ${upperZoneId} 존 SSE 데이터 수신:`, data);
        // SSE 데이터 수신 시 직접 데이터 처리
        try {
          if (data && data.data && data.data.length > 0) {
            // 백엔드 응답을 컴포넌트 형식으로 변환
            const mappedData = mapToComponentFormat(data, upperZoneId);
            console.log('매핑된 데이터:', mappedData);
            
                                      if (mappedData && mappedData[0] && mappedData[0].sensors) {
               const sensors = {};
               // sensors는 이제 항상 배열
                                if (Array.isArray(mappedData[0].sensors)) {
                   mappedData[0].sensors.forEach(sensor => {
                     sensors[sensor.sensorId] = sensor;
                     console.log(`센서 추가: ${sensor.sensorId} (${sensor.sensorType}) - 매핑됨`);
                   });
                 }
               
               const groupedSensors = groupSensorData(sensors);
               console.log('그룹화된 센서 데이터:', groupedSensors);
               setSensorData(groupedSensors);
               setLastUpdated(new Date().toLocaleTimeString());
               console.log(`${upperZoneId}존 SSE 데이터로 센서 데이터 업데이트 완료:`, groupedSensors);
             } else {
              console.warn(`${upperZoneId}존 SSE 데이터 구조가 예상과 다름:`, mappedData);
            }
          }
        } catch (error) {
          console.error(`${upperZoneId}존 SSE 데이터 처리 오류:`, error);
          console.error('원본 데이터:', data);
        }
      },
      
      onError: (error) => {
        console.error(`❌ ${upperZoneId} 존 SSE 연결 오류:`, error);
      }
    });
    
    return () => {
      disconnectSSE();
    };
  }, [zoneId, updateSensorData]);

  return {
    sensorData,
    isLoading,
    connectionState,
    lastUpdated: formatTime(lastUpdated),
    updateSensorData
  };
};
