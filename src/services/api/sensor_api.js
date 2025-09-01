// 센서 API 서비스
import { dashboardApiClient } from '../index';

export const sensorApi = {
  // 센서 목록 조회
  getSensors: async () => {
    console.log('센서 목록 조회 시작');
    try {
      const response = await dashboardApiClient.get('/home/setting/sensor');
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


