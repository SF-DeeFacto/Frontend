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
  
  // 새로운 데이터 구조에서는 notiType을 사용
  const alarmNotiType = alarm.notiType || alarm.type;
  const isMatch = alarmNotiType === alarmType || (alarmType === '알림' && alarmNotiType === 'ALERT');
  
  console.log(`타입 필터 체크: ${alarmType} vs ${alarmNotiType} = ${isMatch}`, alarm);
  return isMatch;
};

/**
 * 즐겨찾기 필터 조건 생성
 */
export const createFavoriteFilter = (statusFilter) => (alarm) => {
  // 빈 값이거나 '전체' 선택 시 모든 상태 표시
  if (!statusFilter || statusFilter === '전체') {
    return true;
  }
  
  const isMatch = statusFilter === '즐겨찾기' ? (alarm.isFavorite || alarm.flagStatus) : true;
  console.log(`즐겨찾기 필터 체크: ${statusFilter} vs isFavorite:${alarm.isFavorite}, flagStatus:${alarm.flagStatus} = ${isMatch}`, alarm);
  return isMatch;
};

/**
 * 읽음 상태 필터 조건 생성
 */
export const createReadStatusFilter = (readStatusFilter) => (alarm) => {
  // 빈 값이거나 '전체' 선택 시 모든 상태 표시
  if (!readStatusFilter || readStatusFilter === '전체') {
    return true;
  }
  
  // 안전한 boolean 변환
  const isRead = Boolean(alarm.isRead);
  const readStatus = Boolean(alarm.readStatus);
  
  let isMatch = false;
  switch (readStatusFilter) {
    case '안읽음':
      // 안읽음: 둘 다 false인 경우
      isMatch = !isRead && !readStatus;
      break;
    case '읽음':
      // 읽음: 둘 중 하나라도 true인 경우
      isMatch = isRead || readStatus;
      break;
    default:
      isMatch = true;
  }
  
  console.log(`읽음 상태 필터 체크: ${readStatusFilter} vs isRead:${isRead}, readStatus:${readStatus} = ${isMatch}`, {
    id: alarm.id,
    isRead: alarm.isRead,
    readStatus: alarm.readStatus,
    status: alarm.status
  });
  return isMatch;
};

/**
 * 복합 필터 조건 생성
 */
export const createCombinedFilter = (alarmType, statusFilter, readStatusFilter) => (alarm) => {
  const typeMatch = createTypeFilter(alarmType)(alarm);
  const favoriteMatch = createFavoriteFilter(statusFilter)(alarm);
  const readStatusMatch = createReadStatusFilter(readStatusFilter)(alarm);
  
  return typeMatch && favoriteMatch && readStatusMatch;
};

/**
 * 필터링된 알림 목록 반환 (메모이제이션용)
 */
export const getFilteredAlarms = (alarms, alarmType, statusFilter, readStatusFilter) => {
  if (!alarms || alarms.length === 0) {
    return [];
  }
  
  const filterPredicate = createCombinedFilter(alarmType, statusFilter, readStatusFilter);
  return alarms.filter(filterPredicate);
};

/**
 * 필터 상태 유효성 검사
 */
export const validateFilters = (alarmType, statusFilter, readStatusFilter) => {
  const validTypes = ['', '전체', '알림', '리포트', 'ALERT'];
  const validStatuses = ['', '전체', '즐겨찾기'];
  const validReadStatuses = ['', '전체', '안읽음', '읽음'];
  
  return {
    isValid: validTypes.includes(alarmType) && validStatuses.includes(statusFilter) && validReadStatuses.includes(readStatusFilter),
    errors: {
      type: validTypes.includes(alarmType) ? null : '유효하지 않은 알림 유형입니다.',
      status: validStatuses.includes(statusFilter) ? null : '유효하지 않은 즐겨찾기 필터입니다.',
      readStatus: validReadStatuses.includes(readStatusFilter) ? null : '유효하지 않은 읽음 상태 필터입니다.'
    }
  };
};

/**
 * 필터 변경 시 페이지 리셋이 필요한지 확인
 */
export const shouldResetPage = (oldType, oldStatus, oldReadStatus, newType, newStatus, newReadStatus) => {
  return oldType !== newType || oldStatus !== newStatus || oldReadStatus !== newReadStatus;
};
