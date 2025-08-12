// 사용자 관련 API 서비스
import { getAvailableBackendConfig } from '../../config/backendConfig';

// 사용자 API 클라이언트 생성
const createUserClient = async () => {
  const config = await getAvailableBackendConfig();
  if (!config) {
    throw new Error('API Gateway 연결 불가');
  }

  return {
    baseURL: config.target, // 직접 API Gateway URL 사용
    target: config.target
  };
};

// 사용자 API 함수들
export const userApi = {
  // 사용자 프로필 정보 조회
  getUserProfile: async () => {
    try {
      const client = await createUserClient();
      const accessToken = localStorage.getItem('access_token');
      const employeeId = localStorage.getItem('employeeId');

      if (!accessToken || !employeeId) {
        return { success: false, error: '인증 정보가 없습니다.' };
      }

      const response = await fetch(`${client.baseURL}/user/info/profile`, { // 직접 API Gateway 호출
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Employee-Id': employeeId,
          'X-Role': 'USER'
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('사용자 프로필 조회 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('사용자 프로필 조회 실패:', response.status);
        return { success: false, error: '사용자 프로필 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error);
      return { success: false, error: '사용자 프로필 조회 중 오류가 발생했습니다.' };
    }
  },

  // 사용자 프로필 정보 수정
  updateUserProfile: async (profileData) => {
    try {
      const client = await createUserClient();
      const accessToken = localStorage.getItem('access_token');
      const employeeId = localStorage.getItem('employeeId');

      if (!accessToken || !employeeId) {
        return { success: false, error: '인증 정보가 없습니다.' };
      }

      const response = await fetch(`${client.baseURL}/user/info/profile`, { // 직접 API Gateway 호출
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Employee-Id': employeeId,
          'X-Role': 'USER'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('사용자 프로필 수정 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('사용자 프로필 수정 실패:', response.status);
        return { success: false, error: '사용자 프로필 수정에 실패했습니다.' };
      }
    } catch (error) {
      console.error('사용자 프로필 수정 오류:', error);
      return { success: false, error: '사용자 프로필 수정 중 오류가 발생했습니다.' };
    }
  },

  // 사용자 목록 조회 (관리자용)
  getUserList: async () => {
    try {
      const client = await createUserClient();
      const accessToken = localStorage.getItem('access_token');
      const employeeId = localStorage.getItem('employeeId');

      if (!accessToken || !employeeId) {
        return { success: false, error: '인증 정보가 없습니다.' };
      }

      const response = await fetch(`${client.baseURL}/user/list`, { // 직접 API Gateway 호출
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Employee-Id': employeeId,
          'X-Role': 'ADMIN'
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('사용자 목록 조회 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('사용자 목록 조회 실패:', response.status);
        return { success: false, error: '사용자 목록 조회에 실패했습니다.' };
      }
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
      return { success: false, error: '사용자 목록 조회 중 오류가 발생했습니다.' };
    }
  },

  // 사용자 역할 수정 (관리자용)
  updateUserRole: async (targetEmployeeId, newRole) => {
    try {
      const client = await createUserClient();
      const accessToken = localStorage.getItem('access_token');
      const employeeId = localStorage.getItem('employeeId');

      if (!accessToken || !employeeId) {
        return { success: false, error: '인증 정보가 없습니다.' };
      }

      const response = await fetch(`${client.baseURL}/user/role`, { // 직접 API Gateway 호출
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Employee-Id': employeeId,
          'X-Role': 'ADMIN'
        },
        body: JSON.stringify({
          employeeId: targetEmployeeId,
          role: newRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('사용자 역할 수정 성공:', data);
        return { success: true, data: data.data || data };
      } else {
        console.error('사용자 역할 수정 실패:', response.status);
        return { success: false, error: '사용자 역할 수정에 실패했습니다.' };
      }
    } catch (error) {
      console.error('사용자 역할 수정 오류:', error);
      return { success: false, error: '사용자 역할 수정 중 오류가 발생했습니다.' };
    }
  }
};
