/**
 * 존별 SSE API (/dashboard-api/home/zone?zoneId=${zoneId}) 더미 데이터
 * 특정 Zone의 센서 데이터를 반환하는 SSE 데이터
 */

// 센서 타입 상수 (실제 API 형식에 맞춤)
const SENSOR_TYPES = {
  // TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity', 
  WIND_DIRECTION: 'winddirection',
  STATIC_ELECTRICITY: 'electrostatic',
  PARTICLE: 'particle'
};

// 센서 상태 상수 (실제 API 형식에 맞춤)
const SENSOR_STATUS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED',
  OFFLINE: 'OFFLINE'
};

// 센서 데이터 생성 함수 (실제 API 형식에 맞춤)
const generateSensorData = (sensorType, sensorId, zoneId) => {
  const baseData = {
    sensorId: sensorId,
    sensorType: sensorType,
    sensorStatus: SENSOR_STATUS.GREEN,
    timestamp: new Date().toISOString()
  };

  switch (sensorType) {
    // case SENSOR_TYPES.TEMPERATURE:
    //   return {
    //     ...baseData,
    //     values: {
    //       value: Math.random() * 10 + 20 // 20-30도
    //     }
    //   };
    
    // case SENSOR_TYPES.HUMIDITY:
    //   return {
    //     ...baseData,
    //     values: {
    //       value: Math.random() * 20 + 40 // 40-60%
    //     }
    //   };
    
    // case SENSOR_TYPES.WIND_DIRECTION:
    //   return {
    //     ...baseData,
    //     values: {
    //       value: Math.random() * 360 - 180 // -180 ~ 180도
    //     }
    //   };
    
    // case SENSOR_TYPES.STATIC_ELECTRICITY:
    //   return {
    //     ...baseData,
    //     values: {
    //       value: Math.random() * 1000 + 100 // 100-1100V
    //     }
    //   };
    
    // case SENSOR_TYPES.PARTICLE:
    //   return {
    //     ...baseData,
    //     values: {
    //       '0.1': Math.random() * 1000, // 0.1μm 파티클
    //       '0.3': Math.random() * 500,  // 0.3μm 파티클
    //       '0.5': Math.random() * 100   // 0.5μm 파티클
    //     }
    //   };
    
    default:
      return {
        ...baseData,
        values: {
          value: Math.random() * 100,
          unit: 'unit'
        }
      };
  }
};

// Zone별 센서 데이터 생성
const generateZoneSensorData = (zoneId) => {
  const sensors = [];
  
  // 각 센서 타입별로 2-3개씩 센서 생성
  Object.values(SENSOR_TYPES).forEach(sensorType => {
    const sensorCount = Math.floor(Math.random() * 2) + 2; // 2-3개
    
    for (let i = 1; i <= sensorCount; i++) {
      const sensorId = `${sensorType}_${zoneId}_${i.toString().padStart(2, '0')}`;
      sensors.push(generateSensorData(sensorType, sensorId, zoneId));
    }
  });
  
  return sensors;
};

// Zone별 SSE 응답 데이터 생성 (실제 API 형식에 맞춤)
export const generateZoneSSEData = (zoneId) => {
  const sensors = generateZoneSensorData(zoneId);
  
  return {
    code: 'OK',
    message: '요청 성공',
    data: [
      {
        timestamp: new Date().toISOString(),
        sensors: sensors
      }
    ]
  };
};

// 실시간 센서 데이터 업데이트 생성
export const generateZoneSSEUpdate = (zoneId) => {
  const sensors = generateZoneSensorData(zoneId);
  
  // 일부 센서의 상태를 랜덤하게 변경
  sensors.forEach(sensor => {
    if (Math.random() < 0.3) { // 30% 확률로 상태 변경
      const statuses = Object.values(SENSOR_STATUS);
      sensor.sensorStatus = statuses[Math.floor(Math.random() * statuses.length)];
    }
  });
  
  return {
    code: 'SUCCESS',
    message: `Zone ${zoneId} sensor data updated`,
    timestamp: new Date().toISOString(),
    data: [
      {
        timestamp: new Date().toISOString(),
        zoneId: zoneId,
        zoneName: `Zone ${zoneId}`,
        sensors: sensors
      }
    ]
  };
};

// 특정 센서 타입별 데이터만 반환
export const generateSensorTypeData = (zoneId, sensorType) => {
  const sensors = generateZoneSensorData(zoneId).filter(
    sensor => sensor.sensorType === sensorType
  );
  
  return {
    code: 'SUCCESS',
    message: `Zone ${zoneId} ${sensorType} sensor data retrieved`,
    timestamp: new Date().toISOString(),
    data: [
      {
        timestamp: new Date().toISOString(),
        zoneId: zoneId,
        zoneName: `Zone ${zoneId}`,
        sensors: sensors
      }
    ]
  };
};

// 모든 Zone의 센서 데이터 생성
export const allZonesSSEData = () => {
  const zones = ['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'];
  const result = {};
  
  zones.forEach(zoneId => {
    result[zoneId] = generateZoneSSEData(zoneId);
  });
  
  return result;
};

// Zone별 센서 개수 통계
export const getZoneSensorStats = () => {
  const zones = ['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'];
  const stats = {};
  
  zones.forEach(zoneId => {
    const sensors = generateZoneSensorData(zoneId);
    const typeCount = {};
    
    sensors.forEach(sensor => {
      typeCount[sensor.sensorType] = (typeCount[sensor.sensorType] || 0) + 1;
    });
    
    stats[zoneId] = {
      totalSensors: sensors.length,
      sensorTypes: typeCount,
      lastUpdate: new Date().toISOString()
    };
  });
  
  return stats;
};

export default {
  generateZoneSSEData,
  generateZoneSSEUpdate,
  generateSensorTypeData,
  allZonesSSEData,
  getZoneSensorStats,
  SENSOR_TYPES,
  SENSOR_STATUS
};
