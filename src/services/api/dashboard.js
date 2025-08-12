// Dashboard API 서비스
import { getAvailableBackendConfig } from '../../config/backendConfig';

// Dashboard API 클라이언트 생성
const createDashboardClient = async () => {
  const config = await getAvailableBackendConfig();
  if (!config) {
    throw new Error('API Gateway 연결 불가');
  }
  
  return {
    baseURL: config.baseURL,
    target: config.target
  };
};

// Dashboard API 함수들
export const dashboardApi = {
  // 대시보드 초기 데이터 조회
  getDashboardData: async () => {
    try {
      const client = await createDashboardClient();
      const response = await fetch(`${client.baseURL}/home/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('대시보드 데이터 조회 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('대시보드 데이터 조회 실패:', response.status);
        return { success: false, error: '대시보드 데이터 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error('대시보드 데이터 조회 오류:', error);
      return { success: false, error: '대시보드 데이터 조회 중 오류가 발생했습니다.' };
    }
  },

  // 특정 구역 데이터 조회
  getZoneData: async (zoneId) => {
    try {
      const client = await createDashboardClient();
      const response = await fetch(`${client.baseURL}/home/zone/${zoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`구역 데이터 조회 성공 (${zoneId}):`, data);
        return { success: true, data: data.data || data };
      } else {
        console.error(`구역 데이터 조회 실패 (${zoneId}):`, response.status);
        return { success: false, error: '구역 데이터 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error(`구역 데이터 조회 오류 (${zoneId}):`, error);
      return { success: false, error: '구역 데이터 조회 중 오류가 발생했습니다.' };
    }
  },

  // 대시보드 설정 업데이트
  updateDashboardSettings: async (settings) => {
    try {
      const client = await createDashboardClient();
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(`${client.baseURL}/home/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('대시보드 설정 업데이트 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('대시보드 설정 업데이트 실패:', response.status);
        return { success: false, error: '대시보드 설정 업데이트에 실패했습니다.' };
      }
    } catch (error) {
      console.error('대시보드 설정 업데이트 오류:', error);
      return { success: false, error: '대시보드 설정 업데이트 중 오류가 발생했습니다.' };
    }
  },

  // 알림 조회
  getNotifications: async () => {
    try {
      const client = await createDashboardClient();
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(`${client.baseURL}/home/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('알림 조회 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('알림 조회 실패:', response.status);
        return { success: false, error: '알림 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error('알림 조회 오류:', error);
      return { success: false, error: '알림 조회 중 오류가 발생했습니다.' };
    }
  }
};
