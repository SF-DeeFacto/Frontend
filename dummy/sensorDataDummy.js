/**
 * 센서 데이터 더미 생성기
 * 온도, 습도, 풍향, 정전기, 파티클 센서의 상세 데이터를 생성
 */

// 센서 타입별 기본 설정 (더미 데이터용)
// 실제 운영에서는 백엔드에서 상태값을 보내주므로 임계값 계산 불필요
const SENSOR_CONFIGS = {
  // temperature: {
  //   name: '온도 센서',
  //   unit: '°C',
  //   precision: 1,
  //   updateInterval: 5000
  // },
  humidity: {
    name: '습도 센서',
    unit: '%',
    precision: 1,
    updateInterval: 5000
  },
  windDirection: {
    name: '풍향 센서',
    unit: '°',
    precision: 0,
    updateInterval: 10000
  },
  staticElectricity: {
    name: '정전기 센서',
    unit: 'V',
    precision: 0,
    updateInterval: 3000
  },
  particle: {
    name: '파티클 센서',
    unit: 'count/m³',
    precision: 0,
    updateInterval: 8000
  }
};

// 센서 상태 결정 함수 (더미 데이터용 - 랜덤 상태 생성)
// 실제 운영에서는 백엔드에서 상태값을 받아서 사용
const determineSensorStatus = (sensorType, value) => {
  // 더미 데이터에서는 랜덤하게 상태 결정
  const statuses = ['GREEN', 'YELLOW', 'RED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// 센서 값 생성 함수
const generateSensorValue = (sensorType, zoneId, sensorId) => {
  const config = SENSOR_CONFIGS[sensorType];
  
  if (!config) return null;
  
  if (sensorType === 'particle') {
    const values = {};
    Object.keys(config.normalRange).forEach(size => {
      const range = config.normalRange[size];
      const baseValue = range.min + Math.random() * (range.max - range.min);
      // 10% 확률로 임계값 초과
      const multiplier = Math.random() < 0.1 ? 2.5 : 1;
      values[size] = Math.floor(baseValue * multiplier);
    });
    return values;
  } else {
    const range = config.normalRange;
    const baseValue = range.min + Math.random() * (range.max - range.min);
    // 10% 확률로 임계값 초과
    const multiplier = Math.random() < 0.1 ? 2 : 1;
    const value = baseValue * multiplier;
    return parseFloat(value.toFixed(config.precision));
  }
};

// 개별 센서 데이터 생성
export const generateSensorData = (sensorType, sensorId, zoneId, customValue = null) => {
  const config = SENSOR_CONFIGS[sensorType];
  const value = customValue || generateSensorValue(sensorType, zoneId, sensorId);
  const status = determineSensorStatus(sensorType, value);
  const timestamp = new Date().toISOString();
  
  const baseData = {
    sensorId: sensorId,
    sensorType: sensorType,
    sensorStatus: status,
    timestamp: timestamp,
    zoneId: zoneId,
    sensorName: config.name,
    unit: config.unit,
    updateInterval: config.updateInterval
  };
  
  if (sensorType === 'particle') {
    return {
      ...baseData,
      values: value,
      // 파티클 센서는 각 크기별 값도 개별 속성으로 제공
      val_0_1: value['0.1'],
      val_0_3: value['0.3'],
      val_0_5: value['0.5']
    };
  } else {
    return {
      ...baseData,
      values: {
        value: value,
        unit: config.unit
      },
      val: value
    };
  }
};

// Zone별 센서 데이터 생성
export const generateZoneSensorData = (zoneId, sensorCounts = {}) => {
  const defaultCounts = {
    // temperature: 3,
    humidity: 2,
    windDirection: 1,
    staticElectricity: 2,
    particle: 2
  };
  
  const counts = { ...defaultCounts, ...sensorCounts };
  const sensors = [];
  
  Object.entries(counts).forEach(([sensorType, count]) => {
    for (let i = 1; i <= count; i++) {
      const sensorId = `${sensorType}_${zoneId}_${i.toString().padStart(2, '0')}`;
      sensors.push(generateSensorData(sensorType, sensorId, zoneId));
    }
  });
  
  return sensors;
};

// 실시간 센서 데이터 업데이트
export const generateSensorUpdate = (sensorType, sensorId, zoneId) => {
  return generateSensorData(sensorType, sensorId, zoneId);
};

// 센서 데이터 히스토리 생성 (시간별)
export const generateSensorHistory = (sensorType, sensorId, zoneId, hours = 24) => {
  const history = [];
  const now = new Date();
  const config = SENSOR_CONFIGS[sensorType];
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const value = generateSensorValue(sensorType, zoneId, sensorId);
    
    history.push({
      ...generateSensorData(sensorType, sensorId, zoneId, value),
      timestamp: timestamp.toISOString()
    });
  }
  
  return history;
};

// 센서 통계 데이터 생성
export const generateSensorStats = (zoneId) => {
  const sensors = generateZoneSensorData(zoneId);
  const stats = {
    totalSensors: sensors.length,
    byType: {},
    byStatus: {},
    lastUpdate: new Date().toISOString()
  };
  
  sensors.forEach(sensor => {
    // 센서 타입별 통계
    if (!stats.byType[sensor.sensorType]) {
      stats.byType[sensor.sensorType] = 0;
    }
    stats.byType[sensor.sensorType]++;
    
    // 상태별 통계
    if (!stats.byStatus[sensor.sensorStatus]) {
      stats.byStatus[sensor.sensorStatus] = 0;
    }
    stats.byStatus[sensor.sensorStatus]++;
  });
  
  return stats;
};

// 센서 임계값 설정 데이터 (더미용 - 실제로는 백엔드에서 관리)
export const generateThresholdData = (sensorType) => {
  const config = SENSOR_CONFIGS[sensorType];
  
  if (!config) return null;
  
  return {
    sensorType: sensorType,
    unit: config.unit,
    precision: config.precision,
    updateInterval: config.updateInterval,
    note: '실제 임계값은 백엔드에서 관리됩니다'
  };
};

// 센서 캘리브레이션 데이터
export const generateCalibrationData = (sensorId, sensorType) => {
  const config = SENSOR_CONFIGS[sensorType];
  
  return {
    sensorId: sensorId,
    sensorType: sensorType,
    calibrationDate: new Date().toISOString(),
    calibrationValue: generateSensorValue(sensorType, 'CALIBRATION', sensorId),
    calibrationStatus: 'COMPLETED',
    nextCalibrationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30일 후
    technician: 'System Admin'
  };
};

// 센서 오류 데이터 생성
export const generateSensorError = (sensorId, sensorType, zoneId, errorType = 'CONNECTION_LOST') => {
  const errorTypes = {
    CONNECTION_LOST: '센서 연결 끊김',
    SENSOR_FAILURE: '센서 오류',
    CALIBRATION_NEEDED: '캘리브레이션 필요',
    MAINTENANCE_REQUIRED: '정비 필요',
    DATA_CORRUPTION: '데이터 손상'
  };
  
  return {
    sensorId: sensorId,
    sensorType: sensorType,
    zoneId: zoneId,
    sensorStatus: 'OFFLINE',
    timestamp: new Date().toISOString(),
    error: {
      type: errorType,
      message: errorTypes[errorType] || '알 수 없는 오류',
      code: `ERR_${errorType}`,
      timestamp: new Date().toISOString()
    },
    values: null
  };
};

export default {
  generateSensorData,
  generateZoneSensorData,
  generateSensorUpdate,
  generateSensorHistory,
  generateSensorStats,
  generateThresholdData,
  generateCalibrationData,
  generateSensorError,
  SENSOR_CONFIGS
};
