import { apiGet, apiPost } from '../../services/api.js';
import { 
  dummyUsers, 
  validateUserCredentials,
  getUserById,
  getUserByEmployeeId,
  generateDummyUsers 
} from '../data/userGenerator';

// 사용자 서비스 API (API 실패 시 더미 데이터 폴백)
export const userService = {
  // 현재 로그인한 사용자의 프로필 정보 조회
  getProfile: async () => {
    try {
      const response = await apiGet('/user/info/profile');
      return response.data;
    } catch (error) {
      console.log('프로필 조회 API 실패, 더미 데이터로 폴백:', error.message);
      // 더미 사용자 데이터로 폴백
      const dummyUser = dummyUsers[0]; // 첫 번째 더미 사용자를 현재 사용자로 가정
      return {
        id: dummyUser.id,
        employee_id: dummyUser.employee_id,
        name: dummyUser.name,
        email: dummyUser.email,
        department: dummyUser.department,
        position: dummyUser.position,
        role: dummyUser.role
      };
    }
  },

  // 사용자 목록 조회 (관리자용)
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
      console.log('사용자 목록 조회 API 실패, 더미 데이터로 폴백:', error.message);
      // 더미 사용자 데이터로 폴백
      let filteredUsers = [...dummyUsers];
      
      if (name) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      
      if (email) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(email.toLowerCase())
        );
      }
      
      // 페이지네이션 적용
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      return {
        content: paginatedUsers,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
        currentPage: page,
        size: size
      };
    }
  },

  // 사용자 등록 (관리자용)
  registerUser: async (userData) => {
    try {
      const response = await apiPost('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.log('사용자 등록 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 사용자가 등록되었습니다.',
        data: {
          id: Date.now(),
          ...userData
        }
      };
    }
  },

  // 사용자 정보 수정 (관리자용)
  updateUser: async (userData) => {
    try {
      const response = await apiPost('/user/info/change', userData);
      return response.data;
    } catch (error) {
      console.log('사용자 정보 수정 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 사용자 정보가 수정되었습니다.',
        data: userData
      };
    }
  },

  // 사용자 삭제 (관리자용)
  deleteUser: async (employeeId) => {
    try {
      const response = await apiPost('/user/delete', { employeeId });
      return response.data;
    } catch (error) {
      console.log('사용자 삭제 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 사용자가 삭제되었습니다.',
        data: { employeeId }
      };
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      const response = await apiPost('/user/info/password', passwordData);
      return response.data;
    } catch (error) {
      console.log('비밀번호 변경 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 비밀번호가 변경되었습니다.',
        data: { success: true }
      };
    }
  }
};
