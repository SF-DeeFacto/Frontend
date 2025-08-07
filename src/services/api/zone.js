import { dashboardApiClient } from '../index';

// 존 상태 조회
export const getZoneStatus = async () => {
  try {
    const response = await dashboardApiClient.get('/api/home/status');
    return response.data;
  } catch (error) {
    console.error('Zone status fetch error:', error);
    throw error;
  }
};

// 특정 존 상태 조회 (필요시)
export const getZoneStatusById = async (zoneId) => {
  try {
    const response = await dashboardApiClient.get(`/api/zone/${zoneId}/status`);
    return response.data;
  } catch (error) {
    console.error('Zone status fetch error:', error);
    throw error;
  }
};
