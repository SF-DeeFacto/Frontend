/**
 * 알림 필터링 유틸리티
 */

/**
 * 알림 유형 필터 조건 생성
 */
export const createTypeFilter = (alarmType) => (alarm) => {
  // 빈 값이거나 '전체' 선택 시 모든 타입 표시
  if (!alarmType || alarmType === '전체') {
    return true;
  }
  
  return alarm.type === alarmType;
};

/**
 * 알림 상태 필터 조건 생성
 */
export const createStatusFilter = (statusFilter) => (alarm) => {
  // 빈 값이거나 '전체' 선택 시 모든 상태 표시
  if (!statusFilter || statusFilter === '전체') {
    return true;
  }
  
  switch (statusFilter) {
    case '즐겨찾기':
      return alarm.isFavorite;
    case '안읽음':
      return !alarm.isRead;
    case '읽음':
      return alarm.isRead;
    default:
      return true;
  }
};

/**
 * 복합 필터 조건 생성
 */
export const createCombinedFilter = (alarmType, statusFilter) => (alarm) => {
  const typeMatch = createTypeFilter(alarmType)(alarm);
  const statusMatch = createStatusFilter(statusFilter)(alarm);
  
  return typeMatch && statusMatch;
};

/**
 * 필터링된 알림 목록 반환 (메모이제이션용)
 */
export const getFilteredAlarms = (alarms, alarmType, statusFilter) => {
  if (!alarms || alarms.length === 0) {
    return [];
  }
  
  const filterPredicate = createCombinedFilter(alarmType, statusFilter);
  return alarms.filter(filterPredicate);
};

/**
 * 필터 상태 유효성 검사
 */
export const validateFilters = (alarmType, statusFilter) => {
  const validTypes = ['', '전체', '알림', '리포트'];
  const validStatuses = ['', '전체', '즐겨찾기', '안읽음', '읽음'];
  
  return {
    isValid: validTypes.includes(alarmType) && validStatuses.includes(statusFilter),
    errors: {
      type: validTypes.includes(alarmType) ? null : '유효하지 않은 알림 유형입니다.',
      status: validStatuses.includes(statusFilter) ? null : '유효하지 않은 상태 필터입니다.'
    }
  };
};

/**
 * 필터 변경 시 페이지 리셋이 필요한지 확인
 */
export const shouldResetPage = (oldType, oldStatus, newType, newStatus) => {
  return oldType !== newType || oldStatus !== newStatus;
};
