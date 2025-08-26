import { useState, useEffect, useCallback } from 'react';
import { getZoneSensorData } from '../dummy/data/zoneSensorData';
import { groupSensorData, formatTime } from '../utils/sensorUtils';
import { CONNECTION_STATE } from '../types/sensor';
import { COMMON_ZONE_CONFIG } from '../config/zoneConfig';

export const useZoneSensorData = (zoneId) => {
  const [sensorData, setSensorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATE.CONNECTING);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Zone의 센서 데이터를 가져오는 함수
   * 새로 만든 zoneSensorData에서 데이터를 가져옴
   */
  const getZoneSensorDataCallback = useCallback(() => {
    const zoneDataObj = getZoneSensorData(zoneId);
    if (!zoneDataObj || zoneDataObj.length === 0) return {};
    
    // zoneSensorData는 배열의 첫 번째 요소에 모든 센서가 들어있음
    const currentData = zoneDataObj[0];
    
    const sensors = {};
    currentData.sensors.forEach(sensor => {
      sensors[sensor.sensorId] = sensor;
    });
    
    console.log(`🔄 ${zoneId} 존 센서 데이터 가져옴 (센서 개수: ${currentData.sensors.length}개)`);
    return sensors;
  }, [zoneId]);

  /**
   * 센서 데이터 업데이트 함수
   */
  const updateSensorData = useCallback(() => {
    const rawSensorData = getZoneSensorDataCallback();
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
    
    // zoneSensorData 사용
    console.log(`${zoneId}존 - zoneSensorData 사용`);
    setConnectionState(CONNECTION_STATE.CONNECTED);
    setIsLoading(false);
    
    // 초기 데이터 설정
    updateSensorData();
    
    // 주기적으로 데이터 업데이트 (타임스탬프 갱신)
    const intervalId = setInterval(updateSensorData, COMMON_ZONE_CONFIG.DATA_UPDATE_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [zoneId, updateSensorData]);

  return {
    sensorData,
    isLoading,
    connectionState,
    lastUpdated: formatTime(lastUpdated),
    updateSensorData
  };
};
