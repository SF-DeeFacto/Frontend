import { apiGet, apiPost } from './index.js';

// 사용자 서비스 API
export const userService = {
  // 현재 로그인한 사용자의 프로필 정보 조회
  getProfile: async () => {
    try {
      const response = await apiGet('/user/info/profile');
      return response.data;
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      throw error;
    }
  },

  // 사용자 목록 조회 (관리자용) - 기본 메서드
  getUsers: async (page = 0, size = 10, name = '', email = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(name && { name }),
        ...(email && { email })
      });
      
      const response = await apiGet(`/user/info/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
      throw error;
    }
  },

  // 사용자 검색 (페이징 포함) - 향상된 검색 메서드
  searchUsers: async (searchParams = {}) => {
    try {
      const { page = 0, size = 10, name = '', email = '', employeeId = '' } = searchParams;
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(name && { name }),
        ...(email && { email }),
        ...(employeeId && { employeeId })
      });
      
      console.log('searchUsers 호출:', `/user/info/search?${params}`); // 디버깅용
      
      const response = await apiGet(`/user/info/search?${params}`);
      return response;
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      throw error;
    }
  },

  // 사용자 등록 (관리자용)
  registerUser: async (userData) => {
    try {
      console.log('registerUser 호출:', userData); // 디버깅용
      console.log('등록 API 호출:', '/auth/register'); // 디버깅용
      
      const response = await apiPost('/auth/register', userData);
      
      console.log('등록 응답:', response); // 디버깅용
      return response.data;
    } catch (error) {
      console.error('사용자 등록 오류:', error);
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // 사용자 정보 수정 (관리자용)
  updateUser: async (userData) => {
    try {
      const response = await apiPost('/user/info/change', userData);
      return response.data;
    } catch (error) {
      console.error('사용자 정보 수정 오류:', error);
      throw error;
    }
  },

  // 사용자 삭제 (관리자용)
  deleteUser: async (employeeId) => {
    try {
      const response = await apiPost('/user/delete', { employeeId });
      return response.data;
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      throw error;
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      const response = await apiPost('/user/info/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      throw error;
    }
  }
}; 