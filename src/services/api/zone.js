// Zone 관련 API 서비스
import { getZoneConfig } from '../../config/zoneConfig';
import { getAvailableBackendConfig } from '../../config/backendConfig';

// Zone API 클라이언트 생성
const createZoneClient = async () => {
  const config = await getAvailableBackendConfig();
  if (!config) {
    throw new Error('API Gateway 연결 불가');
  }
  
  return {
    baseURL: config.baseURL,
    target: config.target
  };
};

// Zone별 센서 데이터 관리 서비스
class ZoneService {
  constructor() {
    this.sensorData = new Map();
    this.eventSource = null;
    this.isConnected = false;
  }

  // Zone별 센서 데이터 구독 (Vite 프록시를 통한 연결)
  subscribeToZoneData(zoneId, callback) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    // Vite 프록시를 통한 센서 스트림 연결
    const apiUrl = `/api/sensor-stream`;
    
    this.eventSource = new EventSource(apiUrl);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success && data.data) {
          // Zone별로 센서 데이터 필터링 (API Gateway 데이터 형식)
          const zoneSensors = data.data.filter(sensor => 
            sensor.zone_id?.toUpperCase() === zoneId?.toUpperCase()
          );
          
          // 센서 타입별로 그룹화
          const groupedSensors = this.groupSensorsByType(zoneSensors);
          
          callback(groupedSensors);
        }
      } catch (error) {
        console.error('센서 데이터 파싱 오류:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('센서 데이터 스트림 오류:', error);
      this.isConnected = false;
      
      // 연결 재시도
      setTimeout(() => {
        if (!this.isConnected) {
          this.subscribeToZoneData(zoneId, callback);
        }
      }, 5000);
    };

    this.eventSource.onopen = () => {
      console.log(`${zoneId} Zone 센서 데이터 스트림 연결됨`);
      this.isConnected = true;
    };
  }

  // 센서 타입별로 그룹화
  groupSensorsByType(sensors) {
    const grouped = {
      temperature: [],
      humidity: [],
      esd: [],
      particle: [],
      windDir: []
    };

    sensors.forEach(sensor => {
      const type = sensor.sensor_type;
      if (grouped[type]) {
        grouped[type].push(sensor);
      }
    });

    return grouped;
  }

  // 연결 해제
  unsubscribe() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }
}

// Zone API 함수들
export const zoneApi = {
  // 구역 상태 목록 조회
  getZoneStatuses: async () => {
    try {
      const client = await createZoneClient();
      const response = await fetch(`${client.baseURL}/zone/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('구역 상태 목록 조회 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('구역 상태 목록 조회 실패:', response.status);
        return { success: false, error: '구역 상태 목록 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error('구역 상태 목록 조회 오류:', error);
      return { success: false, error: '구역 상태 목록 조회 중 오류가 발생했습니다.' };
    }
  },

  // 개별 구역 상태 조회
  getZoneStatus: async (zoneId) => {
    try {
      const client = await createZoneClient();
      const response = await fetch(`${client.baseURL}/zone/${zoneId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`구역 ${zoneId} 상태 조회 성공:`, data);
        return { success: true, data: data.data || data };
      } else {
        console.error(`구역 ${zoneId} 상태 조회 실패:`, response.status);
        return { success: false, error: '구역 상태 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error(`구역 ${zoneId} 상태 조회 오류:`, error);
      return { success: false, error: '구역 상태 조회 중 오류가 발생했습니다.' };
    }
  },

  // 구역 센서 데이터 스트림 구독
  subscribeToSensorData: (zoneId, callback) => {
    const zoneService = new ZoneService();
    zoneService.subscribeToZoneData(zoneId, callback);
    return zoneService;
  }
};

// 기존 함수들과의 호환성을 위한 export
export const fetchZoneStatuses = zoneApi.getZoneStatuses;
export const fetchZoneStatus = zoneApi.getZoneStatus;

// ZoneService 인스턴스 export
export default new ZoneService();
