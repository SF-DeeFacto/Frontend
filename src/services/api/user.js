// 사용자 관련 API 서비스 - 공통 API 클라이언트 사용

import api from './client';

// 사용자 프로필 조회
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '사용자 정보를 가져올 수 없습니다.'
    };
  }
};

// 사용자 정보 수정
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user/profile', userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '사용자 정보 수정에 실패했습니다.'
    };
  }
};

// 비밀번호 변경
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/user/password', passwordData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
    };
  }
};

// 사용자 목록 조회 (관리자용)
export const getUserList = async (params = {}) => {
  try {
    const response = await api.get('/user/list', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '사용자 목록을 가져올 수 없습니다.'
    };
  }
};

// 사용자 생성 (관리자용)
export const createUser = async (userData) => {
  try {
    const response = await api.post('/user', userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 생성 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '사용자 생성에 실패했습니다.'
    };
  }
};

// 사용자 수정 (관리자용)
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/user/${userId}`, userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 수정 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '사용자 수정에 실패했습니다.'
    };
  }
};

// 사용자 삭제 (관리자용)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '사용자 삭제에 실패했습니다.'
    };
  }
};

// 사용자 API 객체
export const userApi = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserList,
  createUser,
  updateUser,
  deleteUser
};
