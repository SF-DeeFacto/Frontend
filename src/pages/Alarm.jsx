import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { notificationApi } from '../services/api/notification_api';
import { getFilteredAlarms, shouldResetPage } from '../utils/alarmFilters';
import { useAlarmData } from '../hooks/useAlarmData';
import { useAlarmPolling } from '../hooks/useAlarmPolling';
import { handleApiError } from '../utils/unifiedErrorHandler';
import AlarmFilters from '../components/features/alarm/AlarmFilters';
import AlarmCard from '../components/features/alarm/AlarmCard';
import { SectionLoading } from '../components/ui';
import { useUnifiedLoading } from '../hooks';
import { LOADING_TEXTS } from '../config';
import Pagination from '../components/ui/Pagination';
import Text from '../components/ui/Text';

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
  const [alarmType, setAlarmType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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

  // 초기 데이터 로드
  useEffect(() => {
    fetchAlarms(currentPage);
  }, [fetchAlarms, currentPage]);

  // 필터링된 알림 목록 (메모이제이션)
  const filteredAlarms = useMemo(() => {
    return getFilteredAlarms(alarms, alarmType, statusFilter);
  }, [alarms, alarmType, statusFilter]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((newType, newStatus) => {
    if (shouldResetPage(alarmType, statusFilter, newType, newStatus)) {
      changePage(0);
    }
    setAlarmType(newType);
    setStatusFilter(newStatus);
  }, [alarmType, statusFilter, changePage]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 상단 필터 섹션 - 항상 표시 */}
      <AlarmFilters
        alarmType={alarmType}
        setAlarmType={(type) => handleFilterChange(type, statusFilter)}
        statusFilter={statusFilter}
        setStatusFilter={(status) => handleFilterChange(alarmType, status)}
        onMarkAllAsRead={markAllAsRead}
        hasUnreadAlarms={hasUnreadAlarms}
      />

      {/* 알림 리스트 섹션 - 로딩 상태 적용 */}
      <SectionLoading 
        loading={loading}
        loadingText={LOADING_TEXTS.PAGES.ALARM}
        error={error}
        errorText={error}
        size="md"
        showHeader={false}
      >
        <div className="space-y-4">
        {filteredAlarms.map((alarm, index) => (
          <div 
            key={alarm.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
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
      </SectionLoading>
    </div>
  );
};

export default Alarm; 