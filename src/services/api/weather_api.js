// 날씨 API 서비스
import { dashboardApiClient } from '../index';
import { handleApiError } from '../../utils/unifiedErrorHandler';

export const weatherApi = {
  // 현재 날씨 정보 조회
  getCurrentWeather: async () => {
    try {
      const response = await dashboardApiClient.get('/home/weather');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorInfo = handleApiError(error, '날씨 정보 조회');
      return {
        success: false,
        error: errorInfo.userMessage
      };
    }
  },

  // 날씨 정보 새로고침
  refreshWeather: async () => {
    try {
      const response = await dashboardApiClient.get('/home/weather', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorInfo = handleApiError(error, '날씨 정보 새로고침');
      return {
        success: false,
        error: errorInfo.userMessage
      };
    }
  }
};
