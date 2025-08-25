// 센서 상태 타입
export const SENSOR_STATUS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW', 
  RED: 'RED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED'
};

// 센서 타입
export const SENSOR_TYPE = {
  PARTICLE: 'particle',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  GAS: 'gas'
};

// Zone 정보 타입
export const ZONE_INFO = {
  //  A01: { id: 'a01', name: 'Zone A01', zone_name: 'zone_A' },
  A01: { id: 'a01', name: 'Zone A01', zone_name: 'zone_A01' },
  A02: { id: 'a02', name: 'Zone A02', zone_name: 'zone_A02' },
  B01: { id: 'b01', name: 'Zone B01', zone_name: 'zone_B01' },
  B02: { id: 'b02', name: 'Zone B02', zone_name: 'zone_B02' },
  B03: { id: 'b03', name: 'Zone B03', zone_name: 'zone_B03' },
  B04: { id: 'b04', name: 'Zone B04', zone_name: 'zone_B04' },
  C01: { id: 'c01', name: 'Zone C01', zone_name: 'zone_C01' },
  C02: { id: 'c02', name: 'Zone C02', zone_name: 'zone_C02' }
};

// 연결 상태 타입
export const CONNECTION_STATE = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};
