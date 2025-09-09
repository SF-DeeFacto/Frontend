import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { notificationApi } from '../services/api/notification_api';
import { getFilteredAlarms, shouldResetPage } from '../utils/alarmFilters';
import { useAlarmData } from '../hooks/useAlarmData';
import { useAlarmPolling } from '../hooks/useAlarmPolling';
import { handleApiError } from '../utils/unifiedErrorHandler';
import AlarmFilters from '../components/alarm/AlarmFilters';
import AlarmCard from '../components/alarm/AlarmCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import Text from '../components/common/Text';

// 빈 상태 컴포넌트
const EmptyState = () => (
  <div className="text-center py-12">
    <Text variant="body" size="lg" color="gray-500" className="dark:text-neutral-400">
      해당 조건의 알림이 없습니다.
    </Text>
  </div>
);


// 메인 알림 컴포넌트
const Alarm = () => {
  const [alarmType, setAlarmType] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [readStatusFilter, setReadStatusFilter] = useState('전체');
  const pageSize = 7;

  // 커스텀 훅 사용
  const {
    alarms,
    loading,
    currentPage,
    totalPages,
    totalElements,
    error,
    fetchAlarms,
    updateAlarmsForPolling,
    changePage,
    markAsRead,
    toggleFavorite,
    markAllAsRead,
    hasUnreadAlarms
  } = useAlarmData(pageSize);

  // 헤더 알림 카운터 업데이트
  const updateHeaderAlarmCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadNotificationCount();
      if (response && response.data !== undefined) {
        localStorage.setItem('unread_alarm_count', response.data.toString());
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'unread_alarm_count',
          newValue: response.data.toString(),
          oldValue: localStorage.getItem('unread_alarm_count')
        }));
      }
    } catch (error) {
      const errorInfo = handleApiError(error, '알림 카운터 업데이트');
      console.warn('알림 카운터 업데이트 실패:', errorInfo.message);
    }
  }, []);

  // 폴링 훅 사용
  const { pollingStatus } = useAlarmPolling(
    () => updateAlarmsForPolling(currentPage),
    updateHeaderAlarmCount,
    currentPage,
    30000
  );

  // 필터에 따른 데이터 로드
  useEffect(() => {
    const filters = {};
    
    // 읽음 상태 필터 설정
    if (readStatusFilter === '읽음') {
      filters.isRead = true;
    } else if (readStatusFilter === '안읽음') {
      filters.isRead = false;
    }
    
    // 즐겨찾기 필터 설정
    if (statusFilter === '즐겨찾기') {
      filters.isFlagged = true;
    }
    
    console.log('필터 변경으로 인한 데이터 재로드:', { filters, currentPage });
    fetchAlarms(currentPage, filters);
  }, [fetchAlarms, currentPage, readStatusFilter, statusFilter]);

  // 서버에서 필터링된 알림 목록 (클라이언트 사이드 필터링 제거)
  const filteredAlarms = useMemo(() => {
    // 알림 타입만 클라이언트에서 필터링 (서버에서 지원하지 않을 수 있음)
    let filtered = alarms;
    
    if (alarmType && alarmType !== '전체') {
      filtered = alarms.filter(alarm => {
        const alarmNotiType = alarm.notiType || alarm.type;
        return alarmNotiType === alarmType || (alarmType === '알림' && alarmNotiType === 'ALERT');
      });
    }
    
    console.log('클라이언트 필터링 결과:', { 
      alarmType, 
      totalAlarms: alarms.length, 
      filteredCount: filtered.length 
    });
    
    return filtered;
  }, [alarms, alarmType]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((newType, newStatus, newReadStatus) => {
    if (shouldResetPage(alarmType, statusFilter, readStatusFilter, newType, newStatus, newReadStatus)) {
      changePage(0);
    }
    setAlarmType(newType);
    setStatusFilter(newStatus);
    setReadStatusFilter(newReadStatus);
  }, [alarmType, statusFilter, readStatusFilter, changePage]);

  return (
    <div className="space-y-8">
      {/* 로딩 및 에러 상태 표시 */}
      {loading && (
        <LoadingSpinner 
          size="md" 
          text="알림을 불러오는 중..." 
          className="py-8"
        />
      )}
      {error && (
        <div className="modern-card p-4 border-l-4 border-l-danger-500 bg-danger-50/50 dark:bg-danger-900/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <Text variant="body" size="sm" color="danger-600" className="font-medium dark:text-danger-400">
              {error}
            </Text>
          </div>
        </div>
      )}

      {/* 상단 필터 섹션 */}
      <AlarmFilters
        alarmType={alarmType}
        setAlarmType={(type) => handleFilterChange(type, statusFilter, readStatusFilter)}
        statusFilter={statusFilter}
        setStatusFilter={(status) => handleFilterChange(alarmType, status, readStatusFilter)}
        readStatusFilter={readStatusFilter}
        setReadStatusFilter={(readStatus) => handleFilterChange(alarmType, statusFilter, readStatus)}
        onMarkAllAsRead={markAllAsRead}
        hasUnreadAlarms={hasUnreadAlarms}
      />

      {/* 알림 리스트 */}
      <div className="space-y-4">
        {filteredAlarms.map((alarm, index) => (
          <div 
            key={alarm.id} 
            className="transition-all duration-200 ease-in-out"
            style={{ 
              opacity: 1,
              transform: 'translateY(0)',
              transitionDelay: `${index * 20}ms`
            }}
          >
            <AlarmCard
              alarm={alarm}
              onMarkAsRead={markAsRead}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredAlarms.length === 0 && !loading && (
        <div className="modern-card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            </svg>
          </div>
          <Text variant="body" size="lg" color="secondary-500" className="font-medium dark:text-neutral-300">
            해당 조건의 알림이 없습니다
          </Text>
          <Text variant="body" size="sm" color="secondary-400" className="mt-2 dark:text-neutral-400">
            다른 필터 조건을 선택해보세요
          </Text>
        </div>
      )}

      {/* 페이지 정보 및 페이지네이션 */}
      {filteredAlarms.length > 0 && (
        <>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 rounded-xl px-4 py-2 backdrop-blur-sm border border-brand-medium/40 dark:border-neutral-600/40 shadow-soft">
              <div className="w-2 h-2 bg-brand-main rounded-full"></div>
              <Text variant="body" size="sm" color="secondary-600" className="font-medium dark:text-neutral-300">
                총 {totalElements}개 중 {(currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}번째 알림
              </Text>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </>
      )}
    </div>
  );
};

export default Alarm; 