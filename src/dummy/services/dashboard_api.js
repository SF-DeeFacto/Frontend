// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// API 실패 시 더미 데이터로 폴백하는 기능이 추가되었습니다.

// SSE 관련 함수들을 sse.js에서 import
import { connectMainSSE, connectZoneSSE, SSE_URLS } from '../../services/sse';

// Dashboard 백엔드 API 클라이언트 import
import { dashboardApiClient } from '../../services/index';

// 더미 데이터 생성 함수들 import
import { generateDummyDashboardData, generateDummyZoneData } from '../data/zoneDataGenerator';

// 일반 HTTP API 함수들 (API 실패 시 더미 데이터 폴백)
export const dashboardApi = {
  // 대시보드 초기 데이터 조회
  getDashboardData: async () => {
    console.log('대시보드 데이터 조회 시작');
    try {
      const response = await dashboardApiClient.get('/home/dashboard');
      console.log('대시보드 데이터 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.log('대시보드 데이터 조회 API 실패, 더미 데이터로 폴백:', error.message);
      // 더미 대시보드 데이터로 폴백
      const dummyData = generateDummyDashboardData();
      return {
        success: true,
        message: '더미 환경에서 대시보드 데이터를 제공합니다.',
        data: dummyData
      };
    }
  },

  // 특정 존 데이터 조회
  getZoneData: async (zoneId) => {
    console.log(`존 데이터 조회 시작: ${zoneId}`);
    try {
      const response = await dashboardApiClient.get(`/home/zone/${zoneId}`);
      console.log(`존 데이터 조회 성공 (${zoneId}):`, response.data);
      return response.data;
    } catch (error) {
      console.log(`존 데이터 조회 API 실패 (${zoneId}), 더미 데이터로 폴백:`, error.message);
      // 더미 Zone 데이터로 폴백
      const dummyZoneData = generateDummyZoneData(zoneId);
      return {
        success: true,
        message: `더미 환경에서 ${zoneId} Zone 데이터를 제공합니다.`,
        data: dummyZoneData
      };
    }
  },

  // 대시보드 설정 업데이트
  updateDashboardSettings: async (settings) => {
    console.log('대시보드 설정 업데이트 시작:', settings);
    try {
      const response = await dashboardApiClient.put('/home/settings', settings);
      console.log('대시보드 설정 업데이트 성공:', response.data);
      return response.data;
    } catch (error) {
      console.log('대시보드 설정 업데이트 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 대시보드 설정이 업데이트되었습니다.',
        data: {
          settings: settings,
          updatedAt: new Date().toISOString()
        }
      };
    }
  },

  // 알림 조회
  getNotifications: async () => {
    console.log('알림 조회 시작');
    try {
      const response = await dashboardApiClient.get('/home/notifications');
      console.log('알림 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.log('알림 조회 API 실패:', error.message);
      throw new Error('알림 조회에 실패했습니다.');
    }
  }
};

// SSE 연결 함수들을 다시 export (index.js에서 가져온 것들)
export { connectMainSSE, connectZoneSSE, SSE_URLS };
