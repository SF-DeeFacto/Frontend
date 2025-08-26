import { getZoneConfig } from '../../config/zoneConfig';
import { generateZoneSensorData, generateZoneStatus } from '../data/zoneDataGenerator';

// Zone별 센서 데이터 관리 서비스 (API 실패 시 더미 데이터 폴백)
class ZoneService {
  constructor() {
    this.sensorData = new Map();
    this.eventSource = null;
    this.isConnected = false;
    this.fallbackMode = false;
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
          this.fallbackMode = false;
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
        this.handleFallback(zoneId, callback);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('센서 데이터 스트림 오류:', error);
      this.isConnected = false;
      this.fallbackMode = true;
      
      // 더미 데이터로 폴백
      this.handleFallback(zoneId, callback);
      
      // 연결 재시도
      setTimeout(() => {
        if (!this.isConnected && this.fallbackMode) {
          this.subscribeToZoneData(zoneId, callback);
        }
      }, 5000);
    };

    this.eventSource.onopen = () => {
      console.log(`${zoneId} Zone 센서 데이터 스트림 연결됨`);
      this.isConnected = true;
      this.fallbackMode = false;
    };
  }

  // API 실패 시 더미 데이터로 폴백
  handleFallback(zoneId, callback) {
    console.log(`${zoneId} Zone API 실패, 더미 데이터로 폴백`);
    
    // 더미 센서 데이터 생성
    const dummyData = generateZoneSensorData(zoneId);
    const groupedSensors = this.groupSensorsByType(dummyData);
    
    callback(groupedSensors);
    
    // 주기적으로 더미 데이터 업데이트 (실시간 효과)
    if (!this.fallbackInterval) {
      this.fallbackInterval = setInterval(() => {
        if (this.fallbackMode) {
          const updatedData = generateZoneSensorData(zoneId);
          const updatedGroupedSensors = this.groupSensorsByType(updatedData);
          callback(updatedGroupedSensors);
        }
      }, 5000); // 5초마다 업데이트
    }
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
    
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    
    this.fallbackMode = false;
  }

  // Zone별 기본 센서 설정 (백엔드 형식에 맞춘 임시 데이터)
  getZoneDefaultSensors(zoneId) {
    try {
      const zoneConfig = getZoneConfig(zoneId);
      if (!zoneConfig) {
        return this.generateDummyZoneSensors(zoneId);
      }

      // 설정에서 센서 정보를 가져와서 백엔드 형식에 맞춘 임시 데이터 생성
      const defaultSensors = {
        temperature: [],
        humidity: [],
        esd: [],
        particle: [],
        windDir: []
      };

      // 각 센서 타입별로 백엔드 형식에 맞춘 임시 데이터 생성
      Object.keys(zoneConfig.sensors).forEach(sensorType => {
        zoneConfig.sensors[sensorType].forEach(sensor => {
          // 백엔드 GenericSensorDataDto/ParticleSensorDataDto 형식에 맞춤
          const sensorData = {
            sensor_id: sensor.sensor_id,
            zone_id: zoneId,
            timestamp: new Date().toISOString(),
            sensor_type: sensorType
          };

          // 센서 타입별 기본값 설정 (백엔드 형식)
          switch (sensorType) {
            case 'temperature':
              sensorData.val = 23 + Math.random() * 5; // 23-28°C
              break;
            case 'humidity':
              sensorData.val = 40 + Math.random() * 20; // 40-60%
              break;
            case 'esd':
              sensorData.val = 10 + Math.random() * 20; // 10-30V
              break;
            case 'particle':
              // ParticleSensorDataDto 형식
              sensorData.val_0_1 = 10 + Math.random() * 10; // 10-20 μg/m³
              sensorData.val_0_3 = 5 + Math.random() * 8; // 5-13 μg/m³
              sensorData.val_0_5 = 3 + Math.random() * 5; // 3-8 μg/m³
              break;
            case 'windDir':
              sensorData.val = Math.random() * 360; // 0-360°
              break;
          }

          defaultSensors[sensorType].push(sensorData);
        });
      });

      return defaultSensors;
    } catch (error) {
      console.log('Zone 설정 조회 실패, 더미 데이터로 폴백:', error.message);
      return this.generateDummyZoneSensors(zoneId);
    }
  }

  // 더미 Zone 센서 데이터 생성
  generateDummyZoneSensors(zoneId) {
    return generateZoneSensorData(zoneId);
  }

  // Zone 상태 정보 가져오기 (API 실패 시 더미 데이터 폴백)
  async getZoneStatus(zoneId) {
    try {
      // 실제 API 호출 시도
      const response = await fetch(`/zone/status/${zoneId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('API 응답 실패');
      }
    } catch (error) {
      console.log('Zone 상태 조회 API 실패, 더미 데이터로 폴백:', error.message);
      // 더미 Zone 상태 데이터로 폴백
      return generateZoneStatus(zoneId);
    }
  }
}

export default new ZoneService();
