/**
 * 알림 데이터 처리 유틸리티 함수들
 * /noti/list와 /noti/sse/subscribe에서 공통으로 사용
 */

/**
 * UTC 시간을 한국 시간(+9시간)으로 변환
 * @param {string} timestamp - UTC 시간 문자열 (ISO 8601 형식)
 * @returns {Date} 한국 시간으로 변환된 Date 객체
 */
export const convertToKoreaTime = (timestamp) => {
  if (!timestamp) return new Date();
  
  const utcDate = new Date(timestamp);
  // UTC 시간에 9시간(9 * 60 * 60 * 1000ms)을 더해서 한국 시간으로 변환
  return new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
};

/**
 * 제목에서 시간 부분 제거
 * @param {string} title - 원본 제목
 * @returns {string} 시간 부분이 제거된 제목
 */
export const removeTimeFromTitle = (title) => {
  if (!title) return '';
  
  // [YYYY-MM-DD HH:MM:SS] 형식의 시간을 제거
  return title.replace(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]\s*/, '');
};

/**
 * 제목에서 센서 이름 추출
 * @param {string} title - 원본 제목
 * @returns {string} 센서 이름
 */
export const extractSensorName = (title) => {
  if (!title) return '';
  
  // "[시간] 센서이름 제목" 형식에서 센서이름 추출
  const match = title.match(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]\s+(\S+)/);
  return match ? match[1] : '';
};

/**
 * 제목에서 센서 이름도 제거 (시간과 센서 이름 모두 제거)
 * @param {string} title - 원본 제목
 * @returns {string} 센서 이름이 제거된 제목
 */
export const removeTimeAndSensorFromTitle = (title) => {
  if (!title) return '';
  
  // "[시간] 센서이름 제목" 형식에서 시간과 센서이름을 모두 제거
  return title.replace(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]\s+\S+\s+/, '');
};

/**
 * 내용에서 <br> 이후 부분만 추출
 * @param {string} content - 원본 내용
 * @returns {string} <br> 이후의 내용
 */
export const extractContentAfterBr = (content) => {
  if (!content) return '';
  
  // <br> 태그로 분리하고 두 번째 부분 반환
  const parts = content.split(/<br\s*\/?>/i);
  return parts.length > 1 ? parts[1].trim() : content;
};

/**
 * 내용에서 구역명 추출
 * @param {string} content - 원본 내용
 * @returns {string} 구역명
 */
export const extractZoneName = (content) => {
  if (!content) return '';
  
  // <br> 이후의 내용에서 첫 번째 단어(구역명) 추출
  const afterBr = extractContentAfterBr(content);
  const words = afterBr.split(/\s+/);
  return words.length > 0 ? words[0] : '';
};

/**
 * 내용에서 구역명과 "구역" 단어도 제거 (<br> 이후에서 구역명과 "구역" 제거)
 * @param {string} content - 원본 내용
 * @returns {string} 구역명과 "구역" 단어가 제거된 내용
 */
export const extractContentAfterBrWithoutZone = (content) => {
  if (!content) return '';
  
  // <br> 태그로 분리하고 두 번째 부분에서 구역명과 "구역" 제거
  const parts = content.split(/<br\s*\/?>/i);
  if (parts.length <= 1) return content;
  
  const afterBr = parts[1].trim();
  const words = afterBr.split(/\s+/);
  
  // 첫 번째 단어(구역명)와 두 번째 단어("구역") 제거하고 나머지 반환
  return words.slice(2).join(' ');
};

/**
 * 상대 시간 계산 (한국 시간 기준)
 * @param {string} timestamp - UTC 시간 문자열
 * @returns {string} 상대 시간 문자열
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const koreaTime = convertToKoreaTime(timestamp);
  const diffInMinutes = Math.floor((now - koreaTime) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;
  
  return koreaTime.toLocaleDateString('ko-KR');
};

/**
 * 알림 데이터를 프론트엔드 형식으로 변환
 * @param {Object} notification - 서버에서 받은 알림 데이터
 * @returns {Object} 변환된 알림 데이터
 */
export const transformNotificationData = (notification) => {
  if (!notification) return null;
  
  const koreaTime = convertToKoreaTime(notification.timestamp);
  const cleanTitle = removeTimeAndSensorFromTitle(notification.title); // 센서 이름도 제거
  const sensorName = extractSensorName(notification.title);
  const contentAfterBr = extractContentAfterBrWithoutZone(notification.content); // 구역명도 제거
  const zoneName = extractZoneName(notification.content);
  const relativeTime = getRelativeTime(notification.timestamp);
  
  return {
    // 원본 데이터 유지
    ...notification,
    
    // 변환된 데이터 추가
    koreaTime,
    cleanTitle,
    sensorName,
    contentAfterBr,
    zoneName,
    relativeTime,
    
    // 기존 필드들도 변환된 값으로 업데이트
    title: cleanTitle,
    content: contentAfterBr,
    zoneId: zoneName.toLowerCase(),
    time: relativeTime
  };
};

/**
 * 알림 목록을 일괄 변환
 * @param {Array} notifications - 알림 목록
 * @returns {Array} 변환된 알림 목록
 */
export const transformNotificationList = (notifications) => {
  if (!Array.isArray(notifications)) return [];
  
  return notifications.map(transformNotificationData).filter(Boolean);
};

/**
 * HTML 태그 제거
 * @param {string} html - HTML 문자열
 * @returns {string} 태그가 제거된 텍스트
 */
export const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
};

/**
 * 한국 시간으로 포맷된 시간 문자열 반환
 * @param {string} timestamp - UTC 시간 문자열
 * @returns {string} 한국 시간 포맷 문자열
 */
export const formatKoreaTime = (timestamp) => {
  if (!timestamp) return '';
  
  const koreaTime = convertToKoreaTime(timestamp);
  return koreaTime.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
