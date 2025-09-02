// 센서 API 서비스
import { dashboardApiClient } from '../index';

export const sensorApi = {
  // 센서 목록 조회
  getSensors: async (params = {}) => {
    const { sensorType, zoneId, page = 0, size = 10 } = params;
    console.log('센서 목록 조회 시작', { sensorType, zoneId, page, size });
    
    try {
      const queryParams = new URLSearchParams();
      if (sensorType && sensorType !== 'all') {
        queryParams.append('sensorType', sensorType);
        console.log('센서 타입 파라미터 추가:', sensorType);
      }
      if (zoneId && zoneId !== 'all') {
        queryParams.append('zoneId', zoneId);
        console.log('구역 파라미터 추가:', zoneId);
      }
      queryParams.append('page', page);
      queryParams.append('size', size);
      
      const url = `/home/setting/sensor?${queryParams.toString()}`;
      console.log('최종 API URL:', url);
      
      const response = await dashboardApiClient.get(url);
      console.log('센서 목록 조회 성공:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('센서 목록 조회 실패:', error);
      return {
        success: false,
        error: error.message || '센서 목록을 가져오는데 실패했습니다.'
      };
    }
  }
};

export default sensorApi;


