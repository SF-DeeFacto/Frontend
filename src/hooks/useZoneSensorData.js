import { useState, useEffect, useCallback, useRef } from 'react';
import { groupSensorData, formatTime, SensorDataDebouncer } from '../utils/sensorUtils';
import { CONNECTION_STATE } from '../types/sensor';
import { handleSSEError } from '../utils/unifiedErrorHandler';

import { connectZoneSSE } from '../services/sse';

export const useZoneSensorData = (zoneId) => {
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATE.CONNECTING);
  const [lastUpdated, setLastUpdated] = useState(null);
  const debouncerRef = useRef(null);



  /**
   * 센서 데이터 업데이트 함수 (SSE 데이터용)
   */
  const updateSensorDataFromSSE = useCallback((backendData) => {
    const groupedSensors = groupSensorData(backendData);
    
    setSensorData(prevData => {
      // 이전 데이터를 유지하면서 새로운 데이터로 업데이트
      const updatedData = { ...prevData };
      
      Object.keys(groupedSensors).forEach(sensorType => {
        const newSensors = groupedSensors[sensorType];
        const oldSensors = prevData[sensorType] || [];
        
        // 새로운 센서 데이터가 있으면 업데이트, 없으면 이전 데이터 유지
        if (newSensors && newSensors.length > 0) {
          updatedData[sensorType] = newSensors;
        }
        // 새로운 센서 데이터가 없으면 이전 데이터 유지 (삭제하지 않음)
      });
      
      return updatedData;
    });
    
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // 초기화 및 데이터 설정
  useEffect(() => {
    // Zone이 변경될 때마다 상태 초기화
    setSensorData({});
    setIsLoading(true);
    setConnectionState(CONNECTION_STATE.CONNECTING);
    
    // 디바운서 초기화 (300ms 지연으로 단축)
    if (debouncerRef.current) {
      debouncerRef.current.destroy();
    }
    debouncerRef.current = new SensorDataDebouncer(300);
    
    // 디바운싱된 데이터 업데이트 콜백 등록
    debouncerRef.current.addCallback((newData) => {
      if (newData && newData.data && newData.data.length > 0) {
        updateSensorDataFromSSE(newData);
      }
    });
    

    
    // SSE 연결 시작
    const upperZoneId = zoneId.toUpperCase();
    setConnectionState(CONNECTION_STATE.CONNECTING);
    
    const disconnectSSE = connectZoneSSE(upperZoneId, {
      onOpen: (event) => {
        setConnectionState(CONNECTION_STATE.CONNECTED);
        setIsLoading(false);
      },
      
      onMessage: (data) => {
        // SSE 데이터 수신 시 디바운싱 적용
        if (data && data.data && data.data.length > 0) {
          if (debouncerRef.current) {
            debouncerRef.current.update(data);
          }
        }
      },
      
      onError: (error) => {
        const errorInfo = handleSSEError(error, { 
          zoneId, 
          context: 'Zone 센서 데이터 SSE 연결' 
        });
        
        setConnectionState(CONNECTION_STATE.ERROR);
        setIsLoading(false);
        // 연결 오류 시에도 이전 센서 데이터는 유지
        console.warn(`Zone ${zoneId} SSE 연결 오류:`, errorInfo.message);
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
  }, [zoneId, updateSensorDataFromSSE]);

  return {
    sensorData,
    isLoading,
    connectionState,
    lastUpdated: formatTime(lastUpdated)
  };
};
