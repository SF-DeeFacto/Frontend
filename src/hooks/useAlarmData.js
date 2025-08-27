import { useState, useCallback } from 'react';
import { notificationApi } from '../services/api/notification_api';
import { mapAlarmList } from '../utils/alarmMapper';
import { handleAlarmApiError, showErrorAlert } from '../utils/errorHandler';

/**
 * 알림 데이터 관리 커스텀 훅
 */
export const useAlarmData = (pageSize = 7) => {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  /**
   * 알림 목록 가져오기
   */
  const fetchAlarms = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationApi.getNotifications(page, pageSize);
      const { alarms: newAlarms, totalPages: newTotalPages, totalElements: newTotalElements } = mapAlarmList(response);
      
      setAlarms(newAlarms);
      setTotalPages(newTotalPages);
      setTotalElements(newTotalElements);
      setCurrentPage(page);
      
      console.log(`알림 ${newAlarms.length}개 로드됨 (총 ${newTotalElements}개)`);
      
      return { alarms: newAlarms, totalPages: newTotalPages, totalElements: newTotalElements };
    } catch (error) {
      console.error('알림 조회 실패', error);
      setError('알림 목록을 불러오는 중 오류가 발생했습니다.');
      
      // 에러 발생 시 빈 상태로 설정
      setAlarms([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  /**
   * 폴링을 위한 알림 업데이트
   */
  const updateAlarmsForPolling = useCallback(async (page) => {
    try {
      const response = await notificationApi.getNotifications(page, pageSize);
      const { alarms: newAlarms, totalPages: newTotalPages, totalElements: newTotalElements } = mapAlarmList(response);
      
      setAlarms(newAlarms);
      setTotalPages(newTotalPages);
      setTotalElements(newTotalElements);
      
      return { alarms: newAlarms, totalPages: newTotalPages, totalElements: newTotalElements };
    } catch (error) {
      console.error('폴링 중 알림 업데이트 실패:', error);
      // 폴링 에러는 사용자에게 알리지 않음
      throw error;
    }
  }, [pageSize]);

  /**
   * 페이지 변경
   */
  const changePage = useCallback((newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      // 페이지 변경 시 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  /**
   * 알림 읽음 처리
   */
  const markAsRead = useCallback(async (alarmId) => {
    try {
      await notificationApi.markNotificationAsRead(alarmId);
      
      // 로컬 상태 업데이트
      setAlarms(prev => 
        prev.map(alarm => 
          alarm.id === alarmId 
            ? { ...alarm, isRead: true, status: '읽음' }
            : alarm
        )
      );
      
      console.log(`알림 ${alarmId} 읽음 처리 완료`);
      return true;
    } catch (error) {
      const errorInfo = handleAlarmApiError(error, '알림 읽음 처리');
      showErrorAlert(errorInfo);
      throw error;
    }
  }, []);

  /**
   * 즐겨찾기 토글
   */
  const toggleFavorite = useCallback(async (alarmId) => {
    try {
      await notificationApi.toggleNotificationFavorite(alarmId);
      
      // 로컬 상태 업데이트
      setAlarms(prev => 
        prev.map(alarm => 
          alarm.id === alarmId 
            ? { ...alarm, isFavorite: !alarm.isFavorite }
            : alarm
        )
      );
      
      console.log(`알림 ${alarmId} 즐겨찾기 토글 완료`);
      return true;
    } catch (error) {
      const errorInfo = handleAlarmApiError(error, '즐겨찾기 처리');
      showErrorAlert(errorInfo);
      throw error;
    }
  }, []);

  /**
   * 전체 읽음 처리
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllNotificationsAsRead();
      
      // 로컬 상태 업데이트
      setAlarms(prev => 
        prev.map(alarm => 
          alarm.isRead 
            ? alarm 
            : { ...alarm, isRead: true, status: '읽음' }
        )
      );
      
      console.log('모든 알림을 전체 읽음 처리 완료');
      return true;
    } catch (error) {
      const errorInfo = handleAlarmApiError(error, '전체 읽음 처리');
      showErrorAlert(errorInfo);
      throw error;
    }
  }, []);

  return {
    // 상태
    alarms,
    loading,
    currentPage,
    totalPages,
    totalElements,
    error,
    
    // 액션
    fetchAlarms,
    updateAlarmsForPolling,
    changePage,
    markAsRead,
    toggleFavorite,
    markAllAsRead,
    
    // 유틸리티
    hasUnreadAlarms: alarms.some(alarm => !alarm.isRead)
  };
};
