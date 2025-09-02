// 날씨 API 서비스
import { dashboardApiClient } from '../index';

export const weatherApi = {
  // 현재 날씨 정보 조회
  getCurrentWeather: async () => {
    console.log('🚀 날씨 정보 조회 시작');
    console.log('⏰ 요청 시작 시간:', new Date().toLocaleTimeString());
    try {
      const response = await dashboardApiClient.get('/home/weather');
      console.log('✅ 날씨 정보 조회 성공:', response.data);
      console.log('⏱️ 응답까지 소요 시간:', new Date().toLocaleTimeString());
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 날씨 정보 조회 실패:', error);
      console.error('⏱️ 실패까지 소요 시간:', new Date().toLocaleTimeString());
      return {
        success: false,
        error: error.message || '날씨 정보를 가져오는데 실패했습니다.'
      };
    }
  },

  // 날씨 정보 새로고침
  refreshWeather: async () => {
    console.log('🚀 날씨 정보 새로고침 시작');
    console.log('⏰ 요청 시작 시간:', new Date().toLocaleTimeString());
    try {
      const response = await dashboardApiClient.get('/home/weather', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('✅ 날씨 정보 새로고침 성공:', response.data);
      console.log('⏱️ 응답까지 소요 시간:', new Date().toLocaleTimeString());
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ 날씨 정보 새로고침 실패:', error);
      console.error('⏱️ 실패까지 소요 시간:', new Date().toLocaleTimeString());
      return {
        success: false,
        error: error.message || '날씨 정보를 새로고침하는데 실패했습니다.'
      };
    }
  }
};
