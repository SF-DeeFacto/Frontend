// 백엔드 API 응답을 프론트엔드 형식으로 변환하는 유틸리티

// 센서 타입 매핑 (백엔드 -> 프론트엔드)
const SENSOR_TYPE_MAPPING = {
  'temperature': 'temperature',
  'humidity': 'humidity',
  'electrostatic': 'esd',
  'particle': 'particle',
  'winddirection': 'windDir'
};

// 센서 상태 매핑 (백엔드 -> 프론트엔드)
const SENSOR_STATUS_MAPPING = {
  'GREEN': 'normal',
  'YELLOW': 'warning',
  'RED': 'error'
};

// 백엔드 센서 데이터를 프론트엔드 형식으로 변환
export const mapBackendSensorData = (backendSensor) => {
  const mappedSensor = {
    sensorId: backendSensor.sensorId,
    sensorType: SENSOR_TYPE_MAPPING[backendSensor.sensorType] || backendSensor.sensorType,
    sensorStatus: SENSOR_STATUS_MAPPING[backendSensor.sensorStatus] || backendSensor.sensorStatus,
    timestamp: backendSensor.timestamp,
    values: { ...backendSensor.values }
  };

  console.log(`센서 매핑: ${backendSensor.sensorType} → ${mappedSensor.sensorType}, ${backendSensor.sensorStatus} → ${mappedSensor.sensorStatus}`);
  return mappedSensor;
};

// 백엔드 존 데이터를 프론트엔드 형식으로 변환
export const mapBackendZoneData = (backendZoneData, zoneId) => {
  if (!backendZoneData || !backendZoneData.data || !Array.isArray(backendZoneData.data)) {
    return null;
  }

  // 모든 센서 데이터를 하나의 배열로 통합
  const allSensors = [];
  backendZoneData.data.forEach(dataPoint => {
    if (dataPoint.sensors && Array.isArray(dataPoint.sensors)) {
      dataPoint.sensors.forEach(sensor => {
        allSensors.push({
          ...sensor,
          timestamp: dataPoint.timestamp // 존 타임스탬프 사용
        });
      });
    }
  });

  // 센서 타입별로 그룹화
  const groupedSensors = {
    temperature: [],
    humidity: [],
    esd: [],
    particle: [],
    windDir: []
  };

  allSensors.forEach(sensor => {
    const mappedSensor = mapBackendSensorData(sensor);
    const sensorType = mappedSensor.sensorType;
    
    console.log(`센서 그룹화: ${sensor.sensorId} (${sensor.sensorType} → ${sensorType})`);
    
    if (groupedSensors[sensorType]) {
      groupedSensors[sensorType].push(mappedSensor);
      console.log(`✅ ${sensorType} 그룹에 추가됨`);
    } else {
      console.warn(`❌ ${sensorType} 그룹이 존재하지 않음`);
    }
  });

  return {
    zoneId: zoneId,
    zoneName: `Zone ${zoneId}`,
    timestamp: new Date().toISOString(),
    sensors: allSensors.map(sensor => mapBackendSensorData(sensor)) // 매핑된 센서 데이터 반환
  };
};

// 센서 데이터를 기존 컴포넌트 형식과 호환되도록 변환
export const mapToComponentFormat = (backendZoneData, zoneId) => {
  const mappedData = mapBackendZoneData(backendZoneData, zoneId);
  if (!mappedData) return null;

  // 컴포넌트에서 사용하는 형식으로 변환
  return [mappedData];
};

export default {
  mapBackendSensorData,
  mapBackendZoneData,
  mapToComponentFormat
};
