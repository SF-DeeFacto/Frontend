// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 우선 만들어둔 dashboard_api 파일에 SSE 연결 방법을 작성합니다.

// SSE 관련 함수들을 sse.js에서 import
import { connectMainSSE, connectZoneSSE, SSE_URLS } from '../sse';

// Dashboard 백엔드 API 클라이언트 import
import { dashboardApiClient } from '../index';



// 일반 HTTP API 함수들
export const dashboardApi = {
  // 대시보드 초기 데이터 조회
  getDashboardData: async () => {
    console.log('🚀 대시보드 데이터 조회 시작');
    try {
      const response = await dashboardApiClient.get('/home/dashboard');
      console.log('✅ 대시보드 데이터 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 대시보드 데이터 조회 실패:', error);
      throw error;
    }
  },

  // 특정 존 데이터 조회
  getZoneData: async (zoneId) => {
    console.log(`🚀 존 데이터 조회 시작: ${zoneId}`);
    try {
      const response = await dashboardApiClient.get(`/home/zone?zoneId=${zoneId}`);
      console.log(`✅ 존 데이터 조회 성공 (${zoneId}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ 존 데이터 조회 실패 (${zoneId}):`, error);
      throw error;
    }
  },



  // 대시보드 설정 업데이트
  updateDashboardSettings: async (settings) => {
    console.log('🚀 대시보드 설정 업데이트 시작:', settings);
    try {
      const response = await dashboardApiClient.put('/home/settings', settings);
      console.log('✅ 대시보드 설정 업데이트 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 대시보드 설정 업데이트 실패:', error);
      throw error;
    }
  }
};
