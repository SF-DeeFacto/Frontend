import { SENSOR_STATUS } from '../../types/sensor';
import { SENSOR_TYPE_CONFIG } from '../../config/sensorConfig';
import { ZONE_DETAILED_CONFIG } from '../../config/zoneConfig';

// 센서 상태 랜덤 생성
const generateRandomStatus = () => {
  const statuses = [SENSOR_STATUS.GREEN, SENSOR_STATUS.YELLOW, SENSOR_STATUS.RED];
  const weights = [0.7, 0.2, 0.1]; // GREEN: 70%, YELLOW: 20%, RED: 10%
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return statuses[i];
    }
  }
  
  return SENSOR_STATUS.GREEN;
};

// 센서 값 생성 (센서 타입별)
const generateSensorValue = (sensorType) => {
  const config = SENSOR_TYPE_CONFIG[sensorType];
  if (!config) return { value: 0 };

  switch (sensorType) {
    case 'temperature':
      // 온도: 18-32°C 범위
      return { value: 18 + Math.random() * 14 };
    
    case 'humidity':
      // 습도: 30-80% 범위
      return { value: 30 + Math.random() * 50 };
    
    case 'esd':
      // 정전기: 0-50V 범위
      return { value: Math.random() * 50 };
    
    case 'particle':
      // 먼지: 0.1, 0.3, 0.5μm 각각 0-30μg/m³ 범위
      return {
        '0.1': Math.random() * 30,
        '0.3': Math.random() * 25,
        '0.5': Math.random() * 20
      };
    
    case 'windDir':
      // 풍향: 0-360° 범위
      return { value: Math.random() * 360 };
    
    default:
      return { value: 0 };
  }
};

// 센서 ID 생성
const generateSensorId = (zoneId, sensorType, index = 1) => {
  const zonePrefix = zoneId.toUpperCase();
  const typePrefix = sensorType.toUpperCase();
  return `${zonePrefix}_${typePrefix}_${String(index).padStart(2, '0')}`;
};

// Zone별 센서 데이터 생성
const generateZoneSensors = (zoneId) => {
  const sensors = [];
  let sensorIndex = 1;

  Object.entries(SENSOR_TYPE_CONFIG).forEach(([sensorType, config]) => {
    // Zone 설정에서 센서 개수 확인
    const zoneConfig = ZONE_DETAILED_CONFIG[zoneId.toUpperCase()];
    const sensorCount = zoneConfig?.sensors?.[sensorType]?.length || 1;

    for (let i = 0; i < sensorCount; i++) {
      const sensorId = generateSensorId(zoneId, sensorType, sensorIndex);
      const status = generateRandomStatus();
      const values = generateSensorValue(sensorType);
      
      sensors.push({
        sensorId,
        sensorType,
        sensorStatus: status,
        timestamp: new Date().toISOString(),
        values
      });
      
      sensorIndex++;
    }
  });

  return sensors;
};

// Zone 데이터 생성
export const generateZoneData = (zoneId, dataPoints = 3) => {
  const zoneData = [];
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(Date.now() - i * 5000).toISOString(); // 5초 간격
    
    zoneData.push({
      timestamp,
      sensors: generateZoneSensors(zoneId).map(sensor => ({
        ...sensor,
        timestamp: new Date(Date.now() - i * 5000 + Math.random() * 1000).toISOString()
      }))
    });
  }
  
  return zoneData;
};

// 모든 Zone 데이터 생성
export const generateAllZoneData = () => {
  const allZoneData = {};
  
  Object.keys(ZONE_DETAILED_CONFIG).forEach(zoneId => {
    allZoneData[zoneId.toLowerCase()] = generateZoneData(zoneId);
  });
  
  return allZoneData;
};

// 특정 Zone의 데이터 가져오기
export const getZoneData = (zoneId) => {
  return generateZoneData(zoneId);
};

// 더미 데이터 업데이트 (실시간 시뮬레이션)
export const getUpdatedZoneData = (zoneId) => {
  return generateZoneData(zoneId, 1); // 최신 데이터 1개만
};

// 기존 호환성을 위한 함수들
export const a01ZoneData = () => generateZoneData('A01');
export const getUpdatedA01Data = () => getUpdatedZoneData('A01');

// 기본 더미 데이터 (기존 코드와의 호환성 유지)
export const zoneData = generateAllZoneData();
