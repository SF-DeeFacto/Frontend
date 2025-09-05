// 임계치(Threshold) API 서비스
import { dashboardApiClient } from '../index';
import { handleApiError } from '../../utils/unifiedErrorHandler';

export const thresholdApi = {
  // 임계치 목록 조회 (zoneId 생략 시 전체)
  getThresholds: async () => {
    try {
      const response = await dashboardApiClient.get('/home/setting/sensor/threshold');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorInfo = handleApiError(error, '임계치 목록 조회');
      return {
        success: false,
        error: errorInfo.userMessage
      };
    }
  },

  // 임계치 단건/유형 업데이트
  updateThreshold: async (payload) => {
    try {
      const response = await dashboardApiClient.post('/home/setting/sensor/threshold/update', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorInfo = handleApiError(error, '임계치 업데이트');
      return {
        success: false,
        error: errorInfo.userMessage
      };
    }
  }
};

export default thresholdApi;


