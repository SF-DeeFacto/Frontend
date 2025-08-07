// Zone별 설정 관리
export const zoneConfig = {
  'B01': {
    name: 'Zone B01',
    description: 'B01 구역 모니터링',
    modelType: 'B01',
    sensors: {
      temperature: [
        { sensor_id: 'B01_TEMP_01', name: '온도 센서 1', location: '입구' },
        { sensor_id: 'B01_TEMP_02', name: '온도 센서 2', location: '중앙' }
      ],
      humidity: [
        { sensor_id: 'B01_HUMI_01', name: '습도 센서 1', location: '입구' },
        { sensor_id: 'B01_HUMI_02', name: '습도 센서 2', location: '중앙' }
      ],
      esd: [
        { sensor_id: 'B01_ESD_01', name: '정전기 센서 1', location: '작업대' }
      ],
      particle: [
        { sensor_id: 'B01_PART_01', name: '먼지 센서 1', location: '환기구' }
      ],
      windDir: [
        { sensor_id: 'B01_WIND_01', name: '풍향 센서 1', location: '외부' }
      ]
    },
    thresholds: {
      temperature: { min: 18, max: 28, warning: 25 },
      humidity: { min: 30, max: 70, warning: 60 },
      esd: { min: 0, max: 50, warning: 30 },
      particle: { min: 0, max: 100, warning: 50 },
      windDir: { min: 0, max: 360, warning: null }
    }
  },
  // 다른 Zone들 추가 예정
  // 'A01': {
  //   name: 'Zone A01',
  //   description: 'A01 구역 모니터링',
  //   modelType: 'A01',
  //   sensors: {
  //     temperature: [
  //       { sensor_id: 'A01_TEMP_01', name: '온도 센서 1', location: '입구' }
  //     ],
  //     humidity: [
  //       { sensor_id: 'A01_HUMI_01', name: '습도 센서 1', location: '입구' }
  //     ],
  //     // ... 다른 센서들
  //   }
  // }
};

// Zone ID로 설정 가져오기
export const getZoneConfig = (zoneId) => {
  return zoneConfig[zoneId?.toUpperCase()] || null;
};

// 모든 Zone ID 목록 가져오기
export const getAllZoneIds = () => {
  return Object.keys(zoneConfig);
};

// Zone이 존재하는지 확인
export const isZoneExists = (zoneId) => {
  return zoneId?.toUpperCase() in zoneConfig;
}; 