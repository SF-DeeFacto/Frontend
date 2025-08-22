import { useState, useEffect, useCallback } from 'react';
import { zoneData } from '../dummy/data/zoneData';
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
   * 현재 시간을 기준으로 순환하는 더미 데이터를 반환
   */
  const getZoneSensorData = useCallback(() => {
    const zoneDataObj = zoneData[zoneId.toLowerCase()];
    if (!zoneDataObj || zoneDataObj.length === 0) return {};
    
    // 현재 시간을 기준으로 순환하는 데이터 선택
    const now = Date.now();
    const dataIndex = Math.floor((now / COMMON_ZONE_CONFIG.DATA_UPDATE_INTERVAL) % zoneDataObj.length);
    const currentData = zoneDataObj[dataIndex];
    
    const sensors = {};
    currentData.sensors.forEach(sensor => {
      sensors[sensor.sensorId] = sensor;
    });
    
    console.log(`🔄 ${zoneId} 데이터 인덱스 ${dataIndex} 사용 (${currentData.timestamp})`);
    return sensors;
  }, [zoneId]);

  /**
   * 센서 데이터 업데이트 함수
   */
  const updateSensorData = useCallback(() => {
    const rawSensorData = getZoneSensorData();
    const groupedSensors = groupSensorData(rawSensorData);
    
    setSensorData(groupedSensors);
    setLastUpdated(new Date().toLocaleTimeString());
    console.log(`${zoneId}존 더미데이터 설정 완료:`, groupedSensors);
  }, [getZoneSensorData, zoneId]);

  // 초기화 및 데이터 설정
  useEffect(() => {
    // Zone이 변경될 때마다 상태 초기화
    console.log(`🔄 ${zoneId} Zone 변경 감지, 상태 초기화`);
    setSensorData({});
    setIsLoading(true);
    setConnectionState(CONNECTION_STATE.CONNECTING);
    
    // 모든 Zone이 더미 데이터를 사용
    console.log(`${zoneId}존 - 더미데이터 사용`);
    setConnectionState(CONNECTION_STATE.CONNECTED);
    setIsLoading(false);
    
    // 초기 데이터 설정
    updateSensorData();
    
    // 주기적으로 더미데이터 업데이트
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
