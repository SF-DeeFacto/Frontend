// 센서 API 서비스
import { dashboardApiClient } from '../index';
import { handleApiError } from '../../utils/unifiedErrorHandler';

export const sensorApi = {
  // 센서 목록 조회
  getSensors: async (params = {}) => {
    const { sensorType, zoneId, page = 0, size = 10 } = params;
    
    try {
      const queryParams = new URLSearchParams();
      if (sensorType && sensorType !== 'all') {
        queryParams.append('sensorType', sensorType);
      }
      if (zoneId && zoneId !== 'all') {
        queryParams.append('zoneId', zoneId);
      }
      queryParams.append('page', page);
      queryParams.append('size', size);
      
      const url = `/home/setting/sensor?${queryParams.toString()}`;
      const response = await dashboardApiClient.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorInfo = handleApiError(error, '센서 목록 조회');
      return {
        success: false,
        error: errorInfo.userMessage
      };
    }
  }
};

export default sensorApi;


