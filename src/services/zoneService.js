import { getZoneConfig } from '../config/zoneConfig';

// Zone별 센서 데이터 관리 서비스
class ZoneService {
  constructor() {
    this.sensorData = new Map();
    this.eventSource = null;
    this.isConnected = false;
  }

  // Zone별 센서 데이터 구독 (백엔드 API 연결)
  subscribeToZoneData(zoneId, callback) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    // 백엔드 API 엔드포인트로 연결
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/sensor-stream`;
    
    this.eventSource = new EventSource(apiUrl);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success && data.data) {
          // Zone별로 센서 데이터 필터링 (백엔드 데이터 형식)
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

export default new ZoneService(); 