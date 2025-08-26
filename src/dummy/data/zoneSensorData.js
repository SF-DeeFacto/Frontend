// 각 존별 센서 데이터 데미데이터
// 실제 센서에서 들어오는 데이터 구조와 동일하게 구성

export const zoneSensorData = {
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
  b01: [
    {
      zoneId: 'B01',
      zoneName: 'Zone B01',
      timestamp: new Date().toISOString(),
      sensors: [
        { sensorId: 'B01_TEMP_01', sensorType: 'temperature', sensorStatus: 'normal', values: { value: 24.5 }, timestamp: new Date().toISOString() },
        { sensorId: 'B01_HUMI_01', sensorType: 'humidity', sensorStatus: 'normal', values: { value: 49.2 }, timestamp: new Date().toISOString() },
        { sensorId: 'B01_LPM_01', sensorType: 'particle', sensorStatus: 'normal', values: { '0.1': 13.50, '0.3': 10.20, '0.5': 4.80 }, timestamp: new Date().toISOString() },
        { sensorId: 'B01_ESD_01', sensorType: 'esd', sensorStatus: 'normal', values: { value: 15.3 }, timestamp: new Date().toISOString() },
        { sensorId: 'B01_WD_01', sensorType: 'windDir', sensorStatus: 'normal', values: { value: 195.0 }, timestamp: new Date().toISOString() }
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

// 특정 존의 센서 데이터 가져오기
export const getZoneSensorData = (zoneId) => {
  const lowerZoneId = zoneId.toLowerCase();
  return zoneSensorData[lowerZoneId] || null;
};

// 모든 존의 센서 데이터 가져오기
export const getAllZoneSensorData = () => {
  return zoneSensorData;
};

// 특정 존의 특정 센서 타입 데이터만 가져오기
export const getZoneSensorDataByType = (zoneId, sensorType) => {
  const zoneData = getZoneSensorData(zoneId);
  if (!zoneData || !zoneData[0]) return null;
  
  return zoneData[0].sensors.filter(sensor => sensor.sensorType === sensorType);
};

// 센서 상태별로 필터링
export const getZoneSensorDataByStatus = (zoneId, sensorStatus) => {
  const zoneData = getZoneSensorData(zoneId);
  if (!zoneData || !zoneData[0]) return null;
  
  return zoneData[0].sensors.filter(sensor => sensor.sensorStatus === sensorStatus);
};

// 센서 데이터 업데이트 (타임스탬프만 갱신)
export const getUpdatedZoneSensorData = (zoneId) => {
  const zoneData = getZoneSensorData(zoneId);
  if (!zoneData || !zoneData[0]) return null;
  
  const updatedData = JSON.parse(JSON.stringify(zoneData[0]));
  updatedData.timestamp = new Date().toISOString();
  updatedData.sensors.forEach(sensor => {
    sensor.timestamp = new Date().toISOString();
  });
  
  return [updatedData];
};

// 기본 내보내기
export default zoneSensorData;
