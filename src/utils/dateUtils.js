/**
 * 날짜 및 시간 관련 유틸리티 함수들
 */

/**
 * 상대적 시간 표시 (예: "3분 전", "2시간 전")
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 2592000) { // 30일
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
};

/**
 * 한국 시간으로 변환
 */
export const toKoreaTime = (timestamp) => {
  if (!timestamp) return null;
  
  const utcDate = new Date(timestamp);
  return new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
};

/**
 * 날짜 포맷팅
 */
export const formatDate = (timestamp, format = 'YYYY-MM-DD') => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  switch (format) {
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0];
    case 'YYYY-MM-DD HH:mm':
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'YYYY-MM-DD HH:mm:ss':
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    case 'MM-DD HH:mm':
      return date.toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return date.toLocaleString('ko-KR');
  }
};

/**
 * 시간만 포맷팅 (HH:mm:ss)
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * 메시지 내 시간을 한국 시간으로 변환
 */
export const convertMessageTime = (message, timestamp) => {
  if (!message || !timestamp) return message;
  
  const koreaTime = toKoreaTime(timestamp);
  if (!koreaTime) return message;
  
  // [YYYY-MM-DD HH:MM:SS] 형식의 시간을 찾아서 변환
  const timePattern = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/;
  const match = message.match(timePattern);
  
  if (match) {
    const koreaTimeString = koreaTime.toISOString().replace('T', ' ').substring(0, 19);
    return message.replace(timePattern, `[${koreaTimeString}]`);
  }
  
  return message;
};

/**
 * 현재 시간을 한국 시간으로 반환
 */
export const getCurrentKoreaTime = () => {
  return toKoreaTime(new Date());
};

/**
 * 두 날짜 간의 차이를 초 단위로 계산
 */
export const getTimeDifferenceInSeconds = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / 1000);
};

/**
 * 날짜가 유효한지 확인
 */
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

/**
 * ISO 문자열을 한국 시간으로 변환하여 포맷팅
 */
export const formatISOTime = (isoString, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  if (!isValidDate(date)) return '';
  
  return formatDate(date, format);
};
