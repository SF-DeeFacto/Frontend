import { useEffect, useRef, useCallback, useState } from 'react';
import { notificationApi } from '../services/api/notification_api';

/**
 * 알림 폴링 커스텀 훅
 */
export const useAlarmPolling = (
  onPollingUpdate, 
  onHeaderUpdate, 
  currentPage, 
  interval = 30000
) => {
  const intervalRef = useRef(null);

  /**
   * 폴링 실행
   */
  const executePolling = useCallback(async () => {
    try {
      // 현재 페이지의 알림 목록 업데이트
      if (onPollingUpdate) {
        await onPollingUpdate();
      }
      
      // 헤더 알림 카운터 업데이트
      if (onHeaderUpdate) {
        await onHeaderUpdate();
      }
      
    } catch (error) {
      console.error('폴링 실행 중 오류:', error);
    }
  }, [onPollingUpdate, onHeaderUpdate]);

  /**
   * 폴링 시작
   */
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(executePolling, interval);
    // console.log(`폴링 시작 (${interval / 1000}초 간격)`);
  }, [executePolling, interval]);

  /**
   * 폴링 중지
   */
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // console.log('폴링 중지');
    }
  }, []);

  /**
   * 폴링 재시작
   */
  const restartPolling = useCallback(() => {
    stopPolling();
    startPolling();
  }, [stopPolling, startPolling]);

  /**
   * 폴링 간격 변경
   */
  const changePollingInterval = useCallback((newInterval) => {
    interval = newInterval;
    restartPolling();
  }, [restartPolling]);

  // 폴링 설정 및 정리
  useEffect(() => {
    startPolling();
    
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  // currentPage가 변경될 때마다 폴링 재설정
  useEffect(() => {
    restartPolling();
  }, [currentPage, restartPolling]);

  return {
    startPolling,
    stopPolling,
    restartPolling,
    changePollingInterval
  };
};
