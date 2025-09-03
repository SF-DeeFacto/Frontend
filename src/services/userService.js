import { apiGet, apiPost } from './index.js';
import { handleApiError } from '../utils/unifiedErrorHandler';

// 사용자 서비스 API
export const userService = {
  // 현재 로그인한 사용자의 프로필 정보 조회
  getProfile: async () => {
    try {
      const response = await apiGet('/user/info/profile');
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '프로필 조회');
      throw new Error(errorInfo.userMessage);
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
      const errorInfo = handleApiError(error, '사용자 목록 조회');
      throw new Error(errorInfo.userMessage);
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
      
      const response = await apiGet(`/user/info/search?${params}`);
      return response;
    } catch (error) {
      const errorInfo = handleApiError(error, '사용자 검색');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 사용자 등록 (관리자용)
  registerUser: async (userData) => {
    try {
      const response = await apiPost('/auth/register', userData);
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '사용자 등록');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 사용자 정보 수정 (관리자용)
  updateUser: async (userData) => {
    try {
      const response = await apiPost('/user/info/change', userData);
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '사용자 정보 수정');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 사용자 삭제 (관리자용)
  deleteUser: async (employeeId) => {
    try {
      const response = await apiPost('/user/delete', { employeeId });
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '사용자 삭제');
      throw new Error(errorInfo.userMessage);
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      const response = await apiPost('/user/info/password', passwordData);
      return response.data;
    } catch (error) {
      const errorInfo = handleApiError(error, '비밀번호 변경');
      throw new Error(errorInfo.userMessage);
    }
  }
}; 