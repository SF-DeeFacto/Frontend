// TODO: 더미 데이터 - 나중에 삭제 (시작)
// 이 파일 전체를 삭제하고 실제 API 연동으로 교체
// 모든 Zone의 센서 데이터
export const zoneData = {
  a01: [
    {
      zoneId: 'A01',
      zoneName: 'Zone A01',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'A01_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 25.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_TEMP_02', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 26.9 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 58.1 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_HUMI_02', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 41.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 12.7 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_ESD_02', sensorType: 'esd', sensorStatus: 'normal', values: { value: 11.7 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_ESD_03', sensorType: 'esd', sensorStatus: 'normal', values: { value: 18.5 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_ESD_04', sensorType: 'esd', sensorStatus: 'normal', values: { value: 10.2 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 14.40, '0.3': 12.00, '0.5': 4.60 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_LPM_02', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 11.20, '0.3': 9.90, '0.5': 6.10 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 228.0 }, timestamp: new Date().toISOString() },
        { sensorId: 'A01_WD_02', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 3.6 }, timestamp: new Date().toISOString() }
      ]
    }
  ],
  a02: [
    {
      zoneId: 'A02',
      zoneName: 'Zone A02',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'A02_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 24.8 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_TEMP_02', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 25.2 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 52.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_HUMI_02', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 48.7 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 13.20, '0.3': 10.80, '0.5': 5.40 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_LPM_02', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 15.60, '0.3': 12.40, '0.5': 6.80 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 14.2 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_ESD_02', sensorType: 'esd', sensorStatus: 'normal', values: { value: 13.8 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 180.5 }, timestamp: new Date().toISOString() },
        { sensorId: 'A02_WD_02', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 185.2 }, timestamp: new Date().toISOString() }
      ]
    }
  ],
  b02: [
    {
      zoneId: 'B02',
      zoneName: 'Zone B02',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'B02_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 23.5 }, timestamp: new Date().toISOString() },
        { sensorId: 'B02_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 45.8 }, timestamp: new Date().toISOString() },
        { sensorId: 'B02_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 12.80, '0.3': 9.60, '0.5': 4.20 }, timestamp: new Date().toISOString() },
        { sensorId: 'B02_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 16.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'B02_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 270.0 }, timestamp: new Date().toISOString() }
      ]
    }
  ],
  b03: [
    {
      zoneId: 'B03',
      zoneName: 'Zone B03',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'B03_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 26.1 }, timestamp: new Date().toISOString() },
        { sensorId: 'B03_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 51.2 }, timestamp: new Date().toISOString() },
        { sensorId: 'B03_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 14.90, '0.3': 11.30, '0.5': 5.70 }, timestamp: new Date().toISOString() },
        { sensorId: 'B03_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 15.8 }, timestamp: new Date().toISOString() },
        { sensorId: 'B03_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 90.5 }, timestamp: new Date().toISOString() }
      ]
    }
  ],
  b04: [
    {
      zoneId: 'B04',
      zoneName: 'Zone B04',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'B04_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 24.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'B04_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 47.9 }, timestamp: new Date().toISOString() },
        { sensorId: 'B04_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 13.70, '0.3': 10.50, '0.5': 4.90 }, timestamp: new Date().toISOString() },
        { sensorId: 'B04_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 17.1 }, timestamp: new Date().toISOString() },
        { sensorId: 'B04_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 135.8 }, timestamp: new Date().toISOString() }
      ]
    }
  ],
  c01: [
    {
      zoneId: 'C01',
      zoneName: 'Zone C01',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'C01_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 25.7 }, timestamp: new Date().toISOString() },
        { sensorId: 'C01_TEMP_02', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 26.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'C01_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 53.4 }, timestamp: new Date().toISOString() },
        { sensorId: 'C01_HUMI_02', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 49.8 }, timestamp: new Date().toISOString() },
        { sensorId: 'C01_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 13.5 }, timestamp: new Date().toISOString() },
        { sensorId: 'C01_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 315.2 }, timestamp: new Date().toISOString() }
      ]
    }
  ],
  c02: [
    {
      zoneId: 'C02',
      zoneName: 'Zone C02',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'C02_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 24.9 }, timestamp: new Date().toISOString() },
        { sensorId: 'C02_TEMP_02', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 25.1 }, timestamp: new Date().toISOString() },
        { sensorId: 'C02_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 50.2 }, timestamp: new Date().toISOString() },
        { sensorId: 'C02_HUMI_02', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 48.6 }, timestamp: new Date().toISOString() },
        { sensorId: 'C02_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 12.50, '0.3': 9.80, '0.5': 4.50 }, timestamp: new Date().toISOString() },
        { sensorId: 'C02_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 14.7 }, timestamp: new Date().toISOString() },
        { sensorId: 'C02_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 225.0 }, timestamp: new Date().toISOString() }
      ]
    }
  ]
};

// 특정 Zone의 데이터 가져오기
export const getZoneData = (zoneId) => {
  const zoneKey = zoneId.toLowerCase();
  return zoneData[zoneKey] || [];
};

// TODO: 더미 데이터 - 나중에 삭제 (시작)
// 이 파일 전체를 삭제하고 실제 API 연동으로 교체
// 더미 데이터 업데이트 (실시간 시뮬레이션)
export const getUpdatedZoneData = (zoneId) => {
  const zoneKey = zoneId?.toLowerCase();
  const baseData = zoneData[zoneKey];
  
  if (!baseData || baseData.length === 0) return [];
  
  return baseData.map(zone => ({
    ...zone,
    timestamp: new Date().toISOString(),
    sensors: zone.sensors.map(sensor => ({
      ...sensor,
      timestamp: new Date().toISOString(),
      values: sensor.sensorType === 'particle' 
        ? {
            '0.1': Math.max(0, sensor.values['0.1'] + (Math.random() - 0.5) * 2),
            '0.3': Math.max(0, sensor.values['0.3'] + (Math.random() - 0.5) * 2),
            '0.5': Math.max(0, sensor.values['0.5'] + (Math.random() - 0.5) * 1)
          }
        : { value: Math.max(0, sensor.values.value + (Math.random() - 0.5) * 2) }
    }))
  }));
};

// 기존 A01 함수들 (하위 호환성 유지)
export const a01ZoneData = zoneData.a01;
export const getUpdatedA01Data = () => getUpdatedZoneData('a01');

// TODO: 더미 데이터 - 나중에 삭제 (끝)
