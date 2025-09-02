// 백엔드 API 응답을 프론트엔드 형식으로 변환하는 유틸리티
// 백엔드 데이터 구조를 그대로 사용

/**
 * 백엔드 센서 데이터를 그대로 사용 (변환 없음)
 */
export const mapBackendSensorData = (backendSensor) => {
  // 백엔드 데이터를 그대로 사용
  return {
    sensorId: backendSensor.sensorId,
    sensorType: backendSensor.sensorType,
    sensorStatus: backendSensor.sensorStatus,
    timestamp: backendSensor.timestamp,
    values: backendSensor.values
  };
};

/**
 * 백엔드 존 데이터를 프론트엔드 형식으로 변환
 */
export const mapBackendZoneData = (backendZoneData, zoneId) => {
  if (!backendZoneData?.data || !Array.isArray(backendZoneData.data)) {
    console.log('❌ 백엔드 데이터가 없거나 잘못된 형식');
    return null;
  }

  console.log(`📊 ${zoneId} 존 - 데이터 포인트 ${backendZoneData.data.length}개 처리 시작`);

  // 모든 데이터 포인트의 센서들을 하나로 통합
  const allSensors = [];
  const sensorIds = new Set(); // 중복 방지

  backendZoneData.data.forEach((dataPoint, index) => {
    if (dataPoint.sensors?.length > 0) {
      console.log(`${index + 1}번째 포인트: ${dataPoint.sensors.length}개 센서`);
      
      dataPoint.sensors.forEach(sensor => {
        if (!sensorIds.has(sensor.sensorId)) {
          sensorIds.add(sensor.sensorId);
          const convertedSensor = mapBackendSensorData(sensor);
          allSensors.push(convertedSensor);
          console.log(`✅ 센서 추가: ${sensor.sensorId}`);
        } else {
          console.log(`⚠️ 중복 센서 건너뜀: ${sensor.sensorId}`);
        }
      });
    }
  });

  console.log(`📊 ${zoneId} 존 - 총 ${allSensors.length}개 센서 처리 완료`);

  return {
    zoneId: zoneId,
    zoneName: `Zone ${zoneId}`,
    timestamp: new Date().toISOString(),
    sensors: allSensors
  };
};

/**
 * 센서 데이터를 기존 컴포넌트 형식과 호환되도록 변환
 */
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
