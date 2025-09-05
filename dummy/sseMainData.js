/**
 * 메인 SSE API (/dashboard-api/home/status) 더미 데이터
 * 전체 Zone 상태 정보를 반환하는 SSE 데이터
 */

// Zone 상태 상수 (실제 API 형식에 맞춤)
const ZONE_STATUS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW', 
  RED: 'RED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED'
};

// 메인 SSE 응답 데이터 구조 (3D 모델 형식에 맞춤)
export const mainSSEDummyData = {
  code: 'SUCCESS',
  message: '요청 성공',
  data: [
    {
      zoneName: 'A01',
      status: ZONE_STATUS.GREEN
    },
    {
      zoneName: 'A02', 
      status: ZONE_STATUS.GREEN
    },
    {
      zoneName: 'B01',
      status: ZONE_STATUS.YELLOW
    },
    {
      zoneName: 'B02',
      status: ZONE_STATUS.RED
    },
    {
      zoneName: 'B03',
      status: ZONE_STATUS.GREEN
    },
    {
      zoneName: 'B04',
      status: ZONE_STATUS.YELLOW
    },
    {
      zoneName: 'C01',
      status: ZONE_STATUS.GREEN
    },
    {
      zoneName: 'C02',
      status: ZONE_STATUS.RED
    }
  ]
};

// 실시간 상태 변화를 시뮬레이션하는 함수
export const generateMainSSEUpdate = () => {
  const zones = ['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'];
  const statuses = [ZONE_STATUS.GREEN, ZONE_STATUS.YELLOW, ZONE_STATUS.RED];
  
  const randomZone = zones[Math.floor(Math.random() * zones.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    code: 'SUCCESS',
    message: '요청 성공',
    data: [
      {
        zoneName: randomZone,
        status: randomStatus
      }
    ]
  };
};

// SSE 연결 성공 응답
export const sseConnectionSuccess = {
  code: 'SUCCESS',
  message: 'SSE connection established',
  timestamp: new Date().toISOString(),
  connectionId: `conn_${Date.now()}`,
  heartbeatInterval: 30000
};

// SSE 연결 오류 응답
export const sseConnectionError = {
  code: 'ERROR',
  message: 'SSE connection failed',
  timestamp: new Date().toISOString(),
  error: 'Connection timeout'
};

export default {
  mainSSEDummyData,
  generateMainSSEUpdate,
  sseConnectionSuccess,
  sseConnectionError,
  ZONE_STATUS
};
