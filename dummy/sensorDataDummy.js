/**
 * 센서 데이터 더미 생성기
 * 온도, 습도, 풍향, 정전기, 파티클 센서의 상세 데이터를 생성
 */

// 센서 타입별 상세 설정
const SENSOR_CONFIGS = {
  temperature: {
    name: '온도 센서',
    unit: '°C',
    normalRange: { min: 20, max: 25 },
    warningRange: { min: 15, max: 30 },
    criticalRange: { min: 10, max: 35 },
    precision: 1,
    updateInterval: 5000 // 5초마다 업데이트
  },
  humidity: {
    name: '습도 센서',
    unit: '%',
    normalRange: { min: 45, max: 55 },
    warningRange: { min: 40, max: 60 },
    criticalRange: { min: 30, max: 70 },
    precision: 1,
    updateInterval: 5000
  },
  windDirection: {
    name: '풍향 센서',
    unit: '°',
    normalRange: { min: 0, max: 360 },
    warningRange: { min: 0, max: 360 },
    criticalRange: { min: 0, max: 360 },
    precision: 0,
    updateInterval: 10000
  },
  staticElectricity: {
    name: '정전기 센서',
    unit: 'V',
    normalRange: { min: 100, max: 500 },
    warningRange: { min: 50, max: 800 },
    criticalRange: { min: 0, max: 1000 },
    precision: 0,
    updateInterval: 3000
  },
  particle: {
    name: '파티클 센서',
    unit: 'count/m³',
    normalRange: { '0.1': { min: 0, max: 1000 }, '0.3': { min: 0, max: 500 }, '0.5': { min: 0, max: 100 } },
    warningRange: { '0.1': { min: 0, max: 2000 }, '0.3': { min: 0, max: 1000 }, '0.5': { min: 0, max: 200 } },
    criticalRange: { '0.1': { min: 0, max: 5000 }, '0.3': { min: 0, max: 2500 }, '0.5': { min: 0, max: 500 } },
    precision: 0,
    updateInterval: 8000
  }
};

// 센서 상태 결정 함수
const determineSensorStatus = (sensorType, value) => {
  const config = SENSOR_CONFIGS[sensorType];
  
  if (!config) return 'UNKNOWN';
  
  if (sensorType === 'particle') {
    // 파티클 센서는 여러 값 중 하나라도 임계값을 초과하면 경고
    for (const [size, range] of Object.entries(value)) {
      if (value[size] > config.criticalRange[size].max) {
        return 'CRITICAL';
      }
      if (value[size] > config.warningRange[size].max) {
        return 'WARNING';
      }
    }
    return 'NORMAL';
  } else {
    // 단일 값 센서
    if (value > config.criticalRange.max || value < config.criticalRange.min) {
      return 'CRITICAL';
    }
    if (value > config.warningRange.max || value < config.warningRange.min) {
      return 'WARNING';
    }
    return 'NORMAL';
  }
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
    temperature: 3,
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

// 센서 임계값 설정 데이터
export const generateThresholdData = (sensorType) => {
  const config = SENSOR_CONFIGS[sensorType];
  
  if (!config) return null;
  
  return {
    sensorType: sensorType,
    thresholds: {
      normal: config.normalRange,
      warning: config.warningRange,
      critical: config.criticalRange
    },
    unit: config.unit,
    precision: config.precision,
    updateInterval: config.updateInterval
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
