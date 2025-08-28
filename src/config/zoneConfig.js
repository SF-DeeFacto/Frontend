import { ZONE_INFO } from '../types/sensor';

// Zone별 상세 설정
export const ZONE_DETAILED_CONFIG = {
  'A01': {
    name: 'Zone A01',
    description: 'A01 구역 모니터링',
    modelType: 'A01',
    sensors: {
      temperature: [
        { sensor_id: 'A01_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'A01_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'A01_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'A01_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'A01_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  },
  'A02': {
    name: 'Zone A02',
    description: 'A02 구역 모니터링',
    modelType: 'A02',
    sensors: {
      temperature: [
        { sensor_id: 'A02_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'A02_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'A02_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'A02_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'A02_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  },
  'B01': {
    name: 'Zone B01',
    description: 'B01 구역 모니터링',
    modelType: 'B01',
    sensors: {
      temperature: [
        { sensor_id: 'TEMP-001' },
        { sensor_id: 'TEMP-002' }
      ],
      humidity: [
        { sensor_id: 'HUM-001' }
      ],
      esd: [
        { sensor_id: 'ESD-002' }
      ],
      particle: [
        { sensor_id: 'LPM-002' }
      ],
      windDir: [
        { sensor_id: 'WD-002' }
      ]
    }
  },
  'B02': {
    name: 'Zone B02',
    description: 'B02 구역 모니터링',
    modelType: 'B02',
    sensors: {
      temperature: [
        { sensor_id: 'B02_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'B02_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'B02_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'B02_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'B02_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  },
  'B03': {
    name: 'Zone B03',
    description: 'B03 구역 모니터링',
    modelType: 'B03',
    sensors: {
      temperature: [
        { sensor_id: 'B03_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'B03_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'B03_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'B03_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'B03_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  },
  'B04': {
    name: 'Zone B04',
    description: 'B04 구역 모니터링',
    modelType: 'B04',
    sensors: {
      temperature: [
        { sensor_id: 'B04_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'B04_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'B04_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'B04_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'B04_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  },
  'C01': {
    name: 'Zone C01',
    description: 'C01 구역 모니터링',
    modelType: 'C01',
    sensors: {
      temperature: [
        { sensor_id: 'C01_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'C01_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'C01_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'C01_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'C01_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  },
  'C02': {
    name: 'Zone C02',
    description: 'C02 구역 모니터링',
    modelType: 'C02',
    sensors: {
      temperature: [
        { sensor_id: 'C02_TEMP_01', name: '온도 센서 1', location: '입구' }
      ],
      humidity: [
        { sensor_id: 'C02_HUMI_01', name: '습도 센서 1', location: '입구' }
      ],
      esd: [
        { sensor_id: 'C02_ESD_01', name: '정전기 센서 1', location: '중앙' }
      ],
      particle: [
        { sensor_id: 'C02_LPM_01', name: '먼지 센서 1', location: '출구' }
      ],
      windDir: [
        { sensor_id: 'C02_WD_01', name: '풍향 센서 1', location: '상단' }
      ]
    }
  }
};

// 공통 임계값 설정 (모든 Zone에 동일 적용)
export const DEFAULT_THRESHOLDS = {
  temperature: { min: 18, max: 28, warning: 25 },
  humidity: { min: 30, max: 70, warning: 60 },
  esd: { min: 0, max: 50, warning: 30 },
  particle: { min: 0, max: 100, warning: 50 },
  windDir: { min: 0, max: 360, warning: null }
};

// 공통 설정
export const COMMON_ZONE_CONFIG = {
  // 데이터 업데이트 간격
  DATA_UPDATE_INTERVAL: 5000, // 5초
  
  // Zone 변경 디바운스 시간
  ZONE_CHANGE_DEBOUNCE: 1000, // 1초
  
  // 더미 데이터를 사용하는 Zone 목록
  DUMMY_DATA_ZONES: ['a01', 'a02', 'b01', 'b02', 'b03', 'b04', 'c01', 'c02'],
  
  // 실시간 데이터를 사용하는 Zone 목록 - 모든 존 포함
  REALTIME_DATA_ZONES: ['a01', 'a02', 'b01', 'b02', 'b03', 'b04', 'c01', 'c02'],
  
  // 기본 임계값
  DEFAULT_THRESHOLDS
};

// Zone ID로 설정 가져오기
export const getZoneConfig = (zoneId) => {
  const upperZoneId = zoneId?.toUpperCase();
  return ZONE_DETAILED_CONFIG[upperZoneId] || null;
};

// 모든 Zone ID 목록 가져오기
export const getAllZoneIds = () => {
  return Object.keys(ZONE_DETAILED_CONFIG);
};

// Zone이 존재하는지 확인
export const isZoneExists = (zoneId) => {
  const upperZoneId = zoneId?.toUpperCase();
  return upperZoneId in ZONE_DETAILED_CONFIG;
};

// Zone의 센서 목록 가져오기
export const getZoneSensors = (zoneId) => {
  const config = getZoneConfig(zoneId);
  return config?.sensors || {};
};

// Zone의 임계값 가져오기 (모든 Zone이 동일한 임계값 사용)
export const getZoneThresholds = (zoneId) => {
  return DEFAULT_THRESHOLDS;
};

// Zone이 실시간 데이터를 사용하는지 확인
export const isRealtimeZone = (zoneId) => {
  const upperZoneId = zoneId?.toLowerCase();
  return COMMON_ZONE_CONFIG.REALTIME_DATA_ZONES.includes(upperZoneId);
};

// Zone이 더미 데이터를 사용하는지 확인
export const isDummyZone = (zoneId) => {
  const upperZoneId = zoneId?.toLowerCase();
  return COMMON_ZONE_CONFIG.DUMMY_DATA_ZONES.includes(upperZoneId);
}; 