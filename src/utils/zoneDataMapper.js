// 백엔드 API 응답을 프론트엔드 형식으로 변환하는 유틸리티

// 센서 타입 매핑 (백엔드 → 프론트엔드)
const SENSOR_TYPE_MAPPING = {
  'temperature': 'temperature',
  'humidity': 'humidity', 
  'electrostatic': 'esd',        // 백엔드: electrostatic → 프론트: esd
  'particle': 'particle',
  'winddirection': 'windDir'     // 백엔드: winddirection → 프론트: windDir
};

// 백엔드 센서 데이터를 프론트엔드 형식으로 변환
export const mapBackendSensorData = (backendSensor) => {
  // 백엔드 센서 타입을 프론트엔드 타입으로 매핑
  const mappedSensorType = SENSOR_TYPE_MAPPING[backendSensor.sensorType] || backendSensor.sensorType;
  
  const mappedSensor = {
    sensorId: backendSensor.sensorId || backendSensor.sensor_id,
    sensorType: mappedSensorType,  // 매핑된 타입 사용
    sensorStatus: backendSensor.sensorStatus || backendSensor.status || 'normal',
    timestamp: backendSensor.timestamp,
    values: backendSensor.values || {}
  };

  // console.log(`센서 매핑: ${mappedSensor.sensorId} (${backendSensor.sensorType} → ${mappedSensor.sensorType}) - 원본 값:`, backendSensor.values);
  return mappedSensor;
};

// 백엔드 존 데이터를 프론트엔드 형식으로 변환
export const mapBackendZoneData = (backendZoneData, zoneId) => {
  if (!backendZoneData || !backendZoneData.data || !Array.isArray(backendZoneData.data)) {
    return null;
  }

  // 모든 센서 데이터를 하나의 배열로 통합하고 매핑
  const mappedSensors = [];
  backendZoneData.data.forEach(dataPoint => {
    if (dataPoint.sensors && Array.isArray(dataPoint.sensors)) {
      dataPoint.sensors.forEach(sensor => {
        const mappedSensor = mapBackendSensorData(sensor);
        mappedSensors.push({
          ...mappedSensor,
          timestamp: dataPoint.timestamp // 존 타임스탬프 사용
        });
      });
    }
  });

  // console.log(`📊 ${zoneId} 존 - 매핑된 센서 ${mappedSensors.length}개:`, 
  //   mappedSensors.map(s => `${s.sensorId}(${s.sensorType})`).join(', '));

  return {
    zoneId: zoneId,
    zoneName: `Zone ${zoneId}`,
    timestamp: new Date().toISOString(),
    sensors: mappedSensors // 매핑된 센서 배열 반환
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
