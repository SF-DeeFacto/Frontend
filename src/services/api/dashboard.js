// 대시보드 관련 API 서비스 - 공통 API 클라이언트 사용

import api from './client';

// 대시보드 데이터 조회
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('대시보드 데이터 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '대시보드 데이터를 가져올 수 없습니다.'
    };
  }
};

// 센서 데이터 조회
export const getSensorData = async (params = {}) => {
  try {
    const response = await api.get('/dashboard/sensor', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('센서 데이터 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '센서 데이터를 가져올 수 없습니다.'
    };
  }
};

// 알람 데이터 조회
export const getAlarmData = async (params = {}) => {
  try {
    const response = await api.get('/dashboard/alarm', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('알람 데이터 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '알람 데이터를 가져올 수 없습니다.'
    };
  }
};

// 통계 데이터 조회
export const getStatisticsData = async (params = {}) => {
  try {
    const response = await api.get('/dashboard/statistics', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('통계 데이터 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '통계 데이터를 가져올 수 없습니다.'
    };
  }
};

// 대시보드 API 객체
export const dashboardApi = {
  getDashboardData,
  getSensorData,
  getAlarmData,
  getStatisticsData
};
