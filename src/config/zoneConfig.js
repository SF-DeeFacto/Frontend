/**
 * Zone 관련 통합 설정 파일
 * 모든 Zone 관련 하드코딩을 중앙에서 관리
 */

// ==================== Zone 기본 정보 ====================
export const ZONE_CONFIG = {
  // Zone 기본 데이터
  ZONES: [
    { id: 'A01', name: 'Zone A01', displayName: 'A01', zoneName: 'zone_A01' },
    { id: 'A02', name: 'Zone A02', displayName: 'A02', zoneName: 'zone_A02' },
    { id: 'B01', name: 'Zone B01', displayName: 'B01', zoneName: 'zone_B01' },
    { id: 'B02', name: 'Zone B02', displayName: 'B02', zoneName: 'zone_B02' },
    { id: 'B03', name: 'Zone B03', displayName: 'B03', zoneName: 'zone_B03' },
    { id: 'B04', name: 'Zone B04', displayName: 'B04', zoneName: 'zone_B04' },
    { id: 'C01', name: 'Zone C01', displayName: 'C01', zoneName: 'zone_C01' },
    { id: 'C02', name: 'Zone C02', displayName: 'C02', zoneName: 'zone_C02' }
  ],

  // Zone ID 목록
  ZONE_IDS: ['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'],

  // Zone 그룹별 분류
  ZONE_GROUPS: {
    A: ['A01', 'A02'],
    B: ['B01', 'B02', 'B03', 'B04'],
    C: ['C01', 'C02']
  },

  // Zone 위치 분류 (UI 배치용)
  ZONE_POSITIONS: {
    LEFT: ['A01', 'A02', 'B01', 'B02'],
    RIGHT: ['B03', 'B04', 'C01', 'C02']
  }
};

// Zone 정보 타입 (기존 types/sensor.js에서 이동)
export const ZONE_INFO = ZONE_CONFIG.ZONES.reduce((acc, zone) => {
  acc[zone.id] = {
    id: zone.id.toLowerCase(),
    name: zone.name,
    zone_name: zone.zoneName
  };
  return acc;
}, {});

// ==================== Zone 매핑 ====================
export const ZONE_MAPPING = {
  // 소문자 → 대문자 Zone ID
  LOWER_TO_UPPER: {
    'a01': 'A01', 'a02': 'A02',
    'b01': 'B01', 'b02': 'B02', 'b03': 'B03', 'b04': 'B04',
    'c01': 'C01', 'c02': 'C02'
  },

  // 대문자 → 소문자 Zone ID
  UPPER_TO_LOWER: {
    'A01': 'a01', 'A02': 'a02',
    'B01': 'b01', 'B02': 'b02', 'B03': 'b03', 'B04': 'b04',
    'C01': 'c01', 'C02': 'c02'
  },

  // Zone ID → Zone 이름
  ID_TO_NAME: {
    'A01': 'Zone A01', 'A02': 'Zone A02',
    'B01': 'Zone B01', 'B02': 'Zone B02', 'B03': 'Zone B03', 'B04': 'Zone B04',
    'C01': 'Zone C01', 'C02': 'Zone C02'
  },

  // Zone ID → Zone 상태 키 (API용)
  ID_TO_STATUS_KEY: {
    'A01': 'zone_A01', 'A02': 'zone_A02',
    'B01': 'zone_B01', 'B02': 'zone_B02', 'B03': 'zone_B03', 'B04': 'zone_B04',
    'C01': 'zone_C01', 'C02': 'zone_C02'
  },

  // Zone ID → 모델 경로
  ID_TO_MODEL_PATH: {
    'A01': '/models/A01.glb',
    'A02': '/models/A02.glb',
    'B01': '/models/B01.glb',
    'B02': '/models/B02.glb',
    'B03': '/models/B03.glb',
    'B04': '/models/B04.glb',
    'C01': '/models/C01.glb',
    'C02': '/models/C02.glb'
  }
};

// ==================== Zone 유틸리티 함수 ====================
export const ZoneUtils = {
  // Zone ID로 Zone 정보 찾기
  getZoneById: (zoneId) => {
    return ZONE_CONFIG.ZONES.find(zone => zone.id === zoneId);
  },

  // Zone ID로 Zone 이름 가져오기
  getZoneName: (zoneId) => {
    return ZONE_MAPPING.ID_TO_NAME[zoneId] || `Zone ${zoneId}`;
  },

  // Zone ID로 Zone 상태 키 가져오기
  getZoneStatusKey: (zoneId) => {
    return ZONE_MAPPING.ID_TO_STATUS_KEY[zoneId];
  },

  // Zone ID로 모델 경로 가져오기
  getZoneModelPath: (zoneId) => {
    return ZONE_MAPPING.ID_TO_MODEL_PATH[zoneId];
  },

  // Zone이 왼쪽에 위치하는지 확인
  isLeftZone: (zoneId) => {
    return ZONE_CONFIG.ZONE_POSITIONS.LEFT.includes(zoneId);
  },

  // Zone이 오른쪽에 위치하는지 확인
  isRightZone: (zoneId) => {
    return ZONE_CONFIG.ZONE_POSITIONS.RIGHT.includes(zoneId);
  },

  // Zone 그룹 가져오기
  getZoneGroup: (zoneId) => {
    for (const [group, zones] of Object.entries(ZONE_CONFIG.ZONE_GROUPS)) {
      if (zones.includes(zoneId)) {
        return group;
      }
    }
    return null;
  },

  // 모든 Zone 메뉴 아이템 생성
  getAllZoneMenuItems: () => {
    return ZONE_CONFIG.ZONES.map(zone => ({
      label: zone.displayName,
      path: `/home/zone/${zone.id.toLowerCase()}`,
      zoneId: zone.id.toLowerCase()
    }));
  }
};

// ==================== 기존 상수와의 호환성 ====================
// 기존 코드와의 호환성을 위한 export
export const ZONES = ZONE_CONFIG.ZONES.reduce((acc, zone) => {
  acc[zone.id] = zone.displayName;
  return acc;
}, { ALL: '전체' });

export const ZONE_LIST = ZONE_CONFIG.ZONE_IDS;

export const ZONE_MAPPING_LEGACY = ZONE_MAPPING.LOWER_TO_UPPER;

export default {
  ZONE_CONFIG,
  ZONE_MAPPING,
  ZoneUtils,
  // 기존 호환성
  ZONES,
  ZONE_LIST,
  ZONE_MAPPING_LEGACY
};
