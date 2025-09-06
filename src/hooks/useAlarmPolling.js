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
  const [pollingStatus, setPollingStatus] = useState('폴링 대기 중...');

  /**
   * 폴링 실행
   */
  const executePolling = useCallback(async () => {
    try {
      // console.log('폴링: 알림 목록 및 카운터 자동 업데이트');
      setPollingStatus('폴링 중...');
      
      // 현재 페이지의 알림 목록 업데이트
      if (onPollingUpdate) {
        await onPollingUpdate();
      }
      
      // 헤더 알림 카운터 업데이트
      if (onHeaderUpdate) {
        await onHeaderUpdate();
      }
      
      setPollingStatus('폴링 완료');
      
      // 3초 후 상태 메시지 초기화
      setTimeout(() => {
        setPollingStatus('폴링 대기 중...');
      }, 3000);
      
    } catch (error) {
      console.error('폴링 실행 중 오류:', error);
      setPollingStatus('폴링 실패');
      
      // 5초 후 상태 메시지 초기화
      setTimeout(() => {
        setPollingStatus('폴링 대기 중...');
      }, 5000);
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
    pollingStatus,
    startPolling,
    stopPolling,
    restartPolling,
    changePollingInterval
  };
};
