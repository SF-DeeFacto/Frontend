import { createAuthApiClient } from '../index';

const apiClient = createAuthApiClient();

// AI 추천 관련 API 서비스
export const aiRecommendService = {
  // 전체 AI 추천 조회 (모든 상태 포함)
  getRecommendations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // 모든 상태 추가
      queryParams.append('appliedStatus', 'APPROVED');
      queryParams.append('appliedStatus', 'REJECTED');
      queryParams.append('appliedStatus', 'PENDING');
      
      // 필터 파라미터 추가
      if (params.zoneId) {
        queryParams.append('zoneId', params.zoneId);
      }
      if (params.sensorType) {
        queryParams.append('sensorType', params.sensorType);
      }
      if (params.year) {
        queryParams.append('year', params.year);
      }
      if (params.month) {
        queryParams.append('month', params.month);
      }

      const url = `/home/setting/sensor/threshold/recommend?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      
      // 백엔드 응답 구조: { code, message, data: { content: [...] } }
      if (response.data && response.data.data && response.data.data.content) {
        return response.data.data.content;
      }
      
      return [];
    } catch (error) {
      console.error('AI 추천 조회 실패:', error);
      throw error;
    }
  },

  // 상태별 AI 추천 조회
  getRecommendationsByStatus: async (statuses = [], params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // 상태 파라미터 추가 (배열로 처리)
      statuses.forEach(status => {
        queryParams.append('appliedStatus', status);
      });
      
      // 필터 파라미터 추가
      if (params.zoneId) {
        queryParams.append('zoneId', params.zoneId);
      }
      if (params.sensorType) {
        queryParams.append('sensorType', params.sensorType);
      }
      if (params.year) {
        queryParams.append('year', params.year);
      }
      if (params.month) {
        queryParams.append('month', params.month);
      }

      const url = `/home/setting/sensor/threshold/recommend?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      
      // 백엔드 응답 구조: { code, message, data: { content: [...] } }
      if (response.data && response.data.data && response.data.data.content) {
        return response.data.data.content;
      }
      
      return [];
    } catch (error) {
      console.error('상태별 AI 추천 조회 실패:', error);
      throw error;
    }
  },

  // 승인된 AI 추천 조회
  getApprovedRecommendations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('appliedStatus', 'APPROVED');
      
      // 필터 파라미터 추가
      if (params.zoneId) {
        queryParams.append('zoneId', params.zoneId);
      }
      if (params.sensorType) {
        queryParams.append('sensorType', params.sensorType);
      }
      if (params.year) {
        queryParams.append('year', params.year);
      }
      if (params.month) {
        queryParams.append('month', params.month);
      }

      const url = `/home/setting/sensor/threshold/recommend?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      
      // 백엔드 응답 구조: { code, message, data: { content: [...] } }
      if (response.data && response.data.data && response.data.data.content) {
        return response.data.data.content;
      }
      
      return [];
    } catch (error) {
      console.error('승인된 AI 추천 조회 실패:', error);
      throw error;
    }
  },

  // 거부된 AI 추천 조회
  getRejectedRecommendations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('appliedStatus', 'REJECTED');
      
      // 필터 파라미터 추가
      if (params.zoneId) {
        queryParams.append('zoneId', params.zoneId);
      }
      if (params.sensorType) {
        queryParams.append('sensorType', params.sensorType);
      }
      if (params.year) {
        queryParams.append('year', params.year);
      }
      if (params.month) {
        queryParams.append('month', params.month);
      }

      const url = `/home/setting/sensor/threshold/recommend?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      
      // 백엔드 응답 구조: { code, message, data: { content: [...] } }
      if (response.data && response.data.data && response.data.data.content) {
        return response.data.data.content;
      }
      
      return [];
    } catch (error) {
      console.error('거부된 AI 추천 조회 실패:', error);
      throw error;
    }
  },

  // AI 추천 승인/거부 처리
  updateRecommendationStatus: async (recommendationId, action, reason = '') => {
    try {
      // 액션 값을 백엔드 스펙에 맞게 변환
      const statusMapping = {
        'APPROVE': 'APPROVED',
        'REJECT': 'REJECTED'
      };
      
      const appliedStatus = statusMapping[action] || action;
      
      // 올바른 요청 데이터 형태
      const requestData = {
        recommendId: recommendationId,  // 'id'가 아닌 'recommendId' 사용
        appliedStatus: appliedStatus
      };

      console.log('추천 ID:', recommendationId);
      console.log('원본 액션:', action);
      console.log('변환된 상태:', appliedStatus);
      console.log('POST 요청 데이터:', requestData);

      const response = await apiClient.post('/home/setting/sensor/threshold/recommend/update', requestData);
      
      console.log('API 응답 성공:', response.data);
      
      // 응답 검증
      if (response.data && response.data.code === 'SUCCESS') {
        console.log('처리 완료:', response.data.data);
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('AI 추천 상태 업데이트 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data
      });
      
      // 백엔드 에러 메시지가 있다면 표시
      if (error.response?.data) {
        console.error('백엔드 에러 응답:', error.response.data);
      }
      
      throw error;
    }
  },

  // 일괄 승인/거부 처리
  bulkUpdateRecommendations: async (recommendationIds, action, reason = '') => {
    try {
      const requestData = {
        ids: recommendationIds,
        action: action, // 'APPROVE' 또는 'REJECT'
        reason: reason
      };

      const response = await apiClient.put('/home/setting/sensor/threshold/recommend/update', requestData);
      return response.data;
    } catch (error) {
      console.error('AI 추천 일괄 처리 실패:', error);
      throw error;
    }
  }
};

export default aiRecommendService;
