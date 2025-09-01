// 임계치(Threshold) API 서비스
import { dashboardApiClient } from '../index';

export const thresholdApi = {
  // 임계치 목록 조회 (zoneId 생략 시 전체)
  getThresholds: async () => {
    console.log('임계치 목록 조회 시작 (all)');
    try {
      const response = await dashboardApiClient.get('/home/setting/sensor/threshold');
      console.log('임계치 목록 조회 성공:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('임계치 목록 조회 실패:', error);
      return {
        success: false,
        error: error.message || '임계치 목록을 가져오는데 실패했습니다.'
      };
    }
  },

  // 임계치 단건/유형 업데이트
  updateThreshold: async (payload) => {
    console.log('임계치 업데이트 시작:', payload);
    try {
      const response = await dashboardApiClient.post('/home/setting/sensor/threshold/update', payload);
      console.log('임계치 업데이트 성공:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('임계치 업데이트 실패:', error);
      return {
        success: false,
        error: error.message || '임계치 업데이트에 실패했습니다.'
      };
    }
  }
};

export default thresholdApi;


