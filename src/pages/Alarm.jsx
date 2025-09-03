import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { notificationApi } from '../services/api/notification_api';
import { getFilteredAlarms, shouldResetPage } from '../utils/alarmFilters';
import { useAlarmData } from '../hooks/useAlarmData';
import { useAlarmPolling } from '../hooks/useAlarmPolling';
import { handleApiError } from '../utils/unifiedErrorHandler';
import AlarmFilters from '../components/alarm/AlarmFilters';
import AlarmCard from '../components/alarm/AlarmCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Text from '../components/common/Text';

// 빈 상태 컴포넌트
const EmptyState = () => (
  <div className="text-center py-12">
    <Text variant="body" size="lg" color="gray-500">
      해당 조건의 알림이 없습니다.
    </Text>
  </div>
);

// 페이지네이션 컴포넌트
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`px-3 py-2 rounded-lg transition-colors ${
          currentPage === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        이전
      </button>

      {/* 페이지 번호들 */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-lg transition-colors ${
            page === '...'
              ? 'bg-transparent text-gray-400 cursor-default'
              : page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {page === '...' ? '...' : page + 1}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`px-3 py-2 rounded-lg transition-colors ${
          currentPage === totalPages - 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        다음
      </button>
    </div>
  );
});

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
    <div className="space-y-6">
      {/* 로딩 및 에러 상태 표시 */}
      {loading && <div className="text-sm text-gray-500">로딩 중...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* 상단 필터 섹션 */}
      <AlarmFilters
        alarmType={alarmType}
        setAlarmType={(type) => handleFilterChange(type, statusFilter)}
        statusFilter={statusFilter}
        setStatusFilter={(status) => handleFilterChange(alarmType, status)}
        onMarkAllAsRead={markAllAsRead}
        hasUnreadAlarms={hasUnreadAlarms}
      />

      {/* 알림 리스트 */}
      <div className="space-y-3">
        {filteredAlarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            alarm={alarm}
            onMarkAsRead={markAsRead}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredAlarms.length === 0 && <EmptyState />}

      {/* 페이지 정보 및 페이지네이션 */}
      {filteredAlarms.length > 0 && (
        <>
          <div className="text-center text-sm text-gray-500 mt-4">
            총 {totalElements}개의 알림 중 {(currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}번째 알림
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