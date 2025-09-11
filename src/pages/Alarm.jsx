import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { notificationApi } from '../services/api/notification_api';
import { getFilteredAlarms, shouldResetPage } from '../utils/alarmFilters';
import { mapAlarmList } from '../utils/alarmMapper';
import { useAlarmData } from '../hooks/useAlarmData';
import { useAlarmPolling } from '../hooks/useAlarmPolling';
import { handleApiError } from '../utils/unifiedErrorHandler';
import AlarmFilters from '../components/alarm/AlarmFilters';
import AlarmCard from '../components/alarm/AlarmCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import Text from '../components/common/Text';
import EmptyState from '../components/common/EmptyState';

// 메인 알림 컴포넌트
const Alarm = () => {
  const [alarmType, setAlarmType] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [readStatusFilter, setReadStatusFilter] = useState('전체');
  const pageSize = 7;

  // 커스텀 훅 사용
  const {
    alarms,
    setAlarms,
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

  // 폴링을 위한 알림 업데이트 (필터 적용)
  const updateAlarmsWithFilters = useCallback(async () => {
    const filters = {};
    
    if (readStatusFilter === '읽음') {
      filters.isRead = true;
    } else if (readStatusFilter === '안읽음') {
      filters.isRead = false;
    }
    
    if (statusFilter === '즐겨찾기') {
      filters.isFlagged = true;
    }
    
    // 알림 타입 필터 설정 (서버로 전송)
    if (alarmType === '알림') {
      filters.notiType = 'ALERT';
    } else if (alarmType === '리포트') {
      filters.notiType = 'REPORT';
    }
    
    return updateAlarmsForPolling(currentPage, filters);
  }, [updateAlarmsForPolling, currentPage, readStatusFilter, statusFilter, alarmType]);

  // 폴링 훅 사용
  const { pollingStatus } = useAlarmPolling(
    updateAlarmsWithFilters,
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
    
    // 알림 타입 필터 설정 (서버로 전송)
    if (alarmType === '알림') {
      filters.notiType = 'ALERT';
    } else if (alarmType === '리포트') {
      filters.notiType = 'REPORT';
    }
    
    console.log('필터 변경으로 인한 데이터 재로드:', { filters, currentPage, alarmType });
    fetchAlarms(currentPage, filters);
  }, [fetchAlarms, currentPage, readStatusFilter, statusFilter, alarmType]);

  // 서버에서 필터링된 알림 목록 (서버 필터링이 안 될 경우 클라이언트에서 백업 필터링)
  const filteredAlarms = useMemo(() => {
    let filtered = alarms;
    
    // 서버에서 notiType 필터링이 제대로 안 될 경우를 대비한 클라이언트 필터링
    if (alarmType && alarmType !== '전체') {
      filtered = alarms.filter(alarm => {
        const alarmNotiType = alarm.notiType || alarm.type;
        if (alarmType === '알림') {
          return alarmNotiType === 'ALERT';
        } else if (alarmType === '리포트') {
          return alarmNotiType === 'REPORT';
        }
        return true;
      });
    }
    
    console.log('필터링 결과:', { 
      alarmType, 
      totalAlarms: alarms.length,
      filteredCount: filtered.length,
      sampleData: filtered.slice(0, 3).map(item => ({ 
        id: item.id, 
        notiType: item.notiType, 
        type: item.type 
      }))
    });
    
    return filtered;
  }, [alarms, alarmType]);

  // 필터링 후 7개 미만일 때 추가 데이터 로드
  const loadMoreIfNeeded = useCallback(async () => {
    if (filteredAlarms.length < pageSize && currentPage < totalPages - 1) {
      console.log('필터링 후 7개 미만, 다음 페이지 로드 시도');
      const nextPage = currentPage + 1;
      const filters = {};
      
      if (readStatusFilter === '읽음') {
        filters.isRead = true;
      } else if (readStatusFilter === '안읽음') {
        filters.isRead = false;
      }
      
      if (statusFilter === '즐겨찾기') {
        filters.isFlagged = true;
      }
      
      // 알림 타입 필터 설정 (서버로 전송)
      if (alarmType === '알림') {
        filters.notiType = 'ALERT';
      } else if (alarmType === '리포트') {
        filters.notiType = 'REPORT';
      }
      
      try {
        const response = await notificationApi.getNotifications(nextPage, pageSize, filters.isRead, filters.isFlagged, filters.notiType);
        const { alarms: newAlarms } = mapAlarmList(response);
        
        // 현재 알림에 새 알림 추가
        setAlarms(prev => [...prev, ...newAlarms]);
        
        // 서버에서 이미 필터링되었으므로 클라이언트 필터링은 불필요
        // 여전히 7개 미만이면 재귀적으로 더 로드
        if (filteredAlarms.length + newAlarms.length < pageSize && nextPage < totalPages - 1) {
          setTimeout(() => loadMoreIfNeeded(), 100);
        }
      } catch (error) {
        console.warn('추가 데이터 로드 실패:', error);
      }
    }
  }, [filteredAlarms.length, currentPage, totalPages, pageSize, readStatusFilter, statusFilter, alarmType]);

  // 필터링 후 7개 미만일 때 추가 로드
  useEffect(() => {
    if (!loading && filteredAlarms.length < pageSize && currentPage < totalPages - 1) {
      loadMoreIfNeeded();
    }
  }, [filteredAlarms.length, loading, currentPage, totalPages, loadMoreIfNeeded]);

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
      {/* 에러 상태 표시 */}
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
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner 
              size="md" 
              variant="primary"
              text="알림 리스트를 불러오는 중..." 
            />
          </div>
        ) : (
          filteredAlarms.map((alarm, index) => (
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
          ))
        )}
      </div>

      {/* 빈 상태 */}
      {filteredAlarms.length === 0 && !loading && (
        <EmptyState />
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