/**
 * 센서 상태별 색상 정의
 * 모든 컴포넌트에서 일관되게 사용
 */
export const SENSOR_STATUS_COLORS = {
  GREEN: 0x10b981,    // 정상 상태
  YELLOW: 0xf59e0b,   // 경고 상태
  RED: 0xef4444,      // 오류 상태
  DEFAULT: 0x6b7280   // 알 수 없는 상태
};

/**
 * 상태 문자열을 색상 코드로 변환
 * @param {string} status - 센서 상태 ('GREEN', 'YELLOW', 'RED', 'normal', 'warning', 'error')
 * @returns {number} 색상 코드
 */
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'GREEN':
    case 'NORMAL':
      return SENSOR_STATUS_COLORS.GREEN;
    case 'YELLOW':
    case 'WARNING':
      return SENSOR_STATUS_COLORS.YELLOW;
    case 'RED':
    case 'ERROR':
      return SENSOR_STATUS_COLORS.RED;
    default:
      return SENSOR_STATUS_COLORS.DEFAULT;
  }
};

/**
 * 상태별 한글 설명 반환
 * @param {string} status - 센서 상태
 * @returns {string} 한글 설명
 */
export const getStatusDescription = (status) => {
  switch (status?.toUpperCase()) {
    case 'GREEN':
    case 'NORMAL':
      return '정상';
    case 'YELLOW':
    case 'WARNING':
      return '경고';
    case 'RED':
    case 'ERROR':
      return '오류';
    default:
      return '알 수 없음';
  }
};
