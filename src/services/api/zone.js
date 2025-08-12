// 구역 관련 API 서비스 - 공통 API 클라이언트 사용

import api from './client';

// 구역 상태 목록 조회
export const getZoneStatuses = async () => {
  try {
    const response = await api.get('/zone/status');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 상태 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 상태 목록을 가져올 수 없습니다.'
    };
  }
};

// 개별 구역 상태 조회
export const getZoneStatus = async (zoneId) => {
  try {
    const response = await api.get(`/zone/${zoneId}/status`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 상태 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 상태를 가져올 수 없습니다.'
    };
  }
};

// 구역 목록 조회
export const getZoneList = async () => {
  try {
    const response = await api.get('/zone/list');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 목록을 가져올 수 없습니다.'
    };
  }
};

// 특정 구역 정보 조회
export const getZoneInfo = async (zoneId) => {
  try {
    const response = await api.get(`/zone/${zoneId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 정보 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 정보를 가져올 수 없습니다.'
    };
  }
};

// 구역 센서 데이터 조회
export const getZoneSensorData = async (zoneId, params = {}) => {
  try {
    const response = await api.get(`/zone/${zoneId}/sensor`, { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 센서 데이터 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 센서 데이터를 가져올 수 없습니다.'
    };
  }
};

// 구역 알람 데이터 조회
export const getZoneAlarmData = async (zoneId, params = {}) => {
  try {
    const response = await api.get(`/zone/${zoneId}/alarm`, { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 알람 데이터 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 알람 데이터를 가져올 수 없습니다.'
    };
  }
};

// 구역 설정 업데이트
export const updateZoneSettings = async (zoneId, settings) => {
  try {
    const response = await api.put(`/zone/${zoneId}/settings`, settings);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 설정 업데이트 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 설정 업데이트에 실패했습니다.'
    };
  }
};

// 구역 생성 (관리자용)
export const createZone = async (zoneData) => {
  try {
    const response = await api.post('/zone', zoneData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 생성 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 생성에 실패했습니다.'
    };
  }
};

// 구역 수정 (관리자용)
export const updateZone = async (zoneId, zoneData) => {
  try {
    const response = await api.put(`/zone/${zoneId}`, zoneData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 수정 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 수정에 실패했습니다.'
    };
  }
};

// 구역 삭제 (관리자용)
export const deleteZone = async (zoneId) => {
  try {
    const response = await api.delete(`/zone/${zoneId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('구역 삭제 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || '구역 삭제에 실패했습니다.'
    };
  }
};

// 기존 함수들과의 호환성을 위한 export (Home.jsx에서 사용)
export const fetchZoneStatuses = getZoneStatuses;
export const fetchZoneStatus = getZoneStatus;

// 구역 API 객체
export const zoneApi = {
  getZoneStatuses,
  getZoneStatus,
  getZoneList,
  getZoneInfo,
  getZoneSensorData,
  getZoneAlarmData,
  updateZoneSettings,
  createZone,
  updateZone,
  deleteZone
};
