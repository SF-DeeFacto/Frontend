import { useState, useEffect, useCallback, useRef } from 'react';
import { groupSensorData, formatTime, SensorDataDebouncer } from '../utils/sensorUtils';
import { CONNECTION_STATE } from '../types/sensor';
import { dashboardApi } from '../services/api/dashboard_api';
import { connectZoneSSE } from '../services/sse';

export const useZoneSensorData = (zoneId) => {
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATE.CONNECTING);
  const [lastUpdated, setLastUpdated] = useState(null);
  const debouncerRef = useRef(null);

  /**
   * Zone의 센서 데이터를 가져오는 함수
   */
  const getZoneSensorDataCallback = useCallback(async () => {
    try {
      // zoneId를 대문자로 변환하여 API 호출
      const upperZoneId = zoneId.toUpperCase();
      const response = await dashboardApi.getZoneData(upperZoneId);
      if (response && response.data && response.data.length > 0) {
        console.log(`🔄 ${upperZoneId} 존 실제 API 데이터 가져옴`);
        return response;
      }
    } catch (error) {
      console.error(`${zoneId} 존 API 호출 실패:`, error);
    }
    
    // API 실패 시 빈 데이터 반환
    console.log(`🔄 ${zoneId} 존 - 데이터 없음`);
    return { data: [] };
  }, [zoneId]);

  /**
   * 센서 데이터 업데이트 함수
   */
  const updateSensorData = useCallback(async () => {
    const backendData = await getZoneSensorDataCallback();
    const groupedSensors = groupSensorData(backendData);
    
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
    
    // 디바운서 초기화 (500ms 지연)
    if (debouncerRef.current) {
      debouncerRef.current.destroy();
    }
    debouncerRef.current = new SensorDataDebouncer(500);
    
    // 디바운싱된 데이터 업데이트 콜백 등록 (스마트 업데이트)
    debouncerRef.current.addCallback((newData, oldData) => {
      if (newData && newData.data && newData.data.length > 0) {
        const groupedSensors = groupSensorData(newData);
        
        // 기존 데이터와 비교하여 실제 변경사항만 업데이트
        setSensorData(prevData => {
          // 실제로 변경된 센서만 업데이트
          const updatedData = { ...prevData };
          
          Object.keys(groupedSensors).forEach(sensorType => {
            const newSensors = groupedSensors[sensorType];
            const oldSensors = prevData[sensorType] || [];
            
            // 센서 개수가 다르거나 값이 변경된 경우만 업데이트
            if (newSensors.length !== oldSensors.length) {
              updatedData[sensorType] = newSensors;
            } else {
              // 각 센서의 값 변경 확인
              const hasChanges = newSensors.some((newSensor, index) => {
                const oldSensor = oldSensors[index];
                return !oldSensor || 
                       newSensor.sensorStatus !== oldSensor.sensorStatus ||
                       JSON.stringify(newSensor.values) !== JSON.stringify(oldSensor.values);
              });
              
              if (hasChanges) {
                updatedData[sensorType] = newSensors;
              }
            }
          });
          
          return updatedData;
        });
        
        setLastUpdated(new Date().toLocaleTimeString());
        console.log(`${zoneId}존 스마트 센서 데이터 업데이트 완료:`, {
          센서데이터: groupedSensors,
          업데이트시간: new Date().toLocaleTimeString()
        });
      }
    });
    
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
        console.log(`📨 ${upperZoneId} 존 SSE 데이터 수신:`, {
          원본데이터: data,
          dataKeys: Object.keys(data || {}),
          hasData: !!data?.data,
          dataLength: data?.data?.length || 0,
          timestamp: new Date().toLocaleTimeString()
        });
        
        // SSE 데이터 수신 시 디바운싱 적용
        try {
          if (data && data.data && data.data.length > 0) {
            console.log(`📊 ${upperZoneId} 존 - SSE 데이터 수신 (디바운싱 적용):`, {
              전체데이터: data.data,
              첫번째데이터: data.data[0],
              첫번째데이터키: Object.keys(data.data[0] || {}),
              timestamp: new Date().toLocaleTimeString()
            });

            // 디바운싱을 통해 데이터 업데이트
            if (debouncerRef.current) {
              debouncerRef.current.update(data);
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
      },
      
      onError: (error) => {
        console.error(`❌ ${upperZoneId} 존 SSE 연결 오류:`, error);
      }
    });
    
    return () => {
      disconnectSSE();
      // 디바운서 정리
      if (debouncerRef.current) {
        debouncerRef.current.destroy();
        debouncerRef.current = null;
      }
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
