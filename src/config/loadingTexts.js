/**
 * 로딩 텍스트 상수 정의
 * 페이지별, 액션별 로딩 메시지를 중앙 관리
 */
export const LOADING_TEXTS = {
  // 페이지별 로딩
  PAGES: {
    HOME: '홈을 불러오는 중...',
    ALARM: '알림을 불러오는 중...',
    REPORT: '리포트를 불러오는 중...',
    GRAPH: '그래프를 불러오는 중...',
    ZONE: '구역 정보를 불러오는 중...',
    SETTING: '설정을 불러오는 중...',
    LOGIN: '로그인 중...',
    GENERAL: '페이지를 불러오는 중...'
  },

  // 데이터 타입별 로딩
  DATA: {
    USER_LIST: '사용자 목록을 불러오는 중...',
    USER_INFO: '사용자 정보를 불러오는 중...',
    AI_RECOMMENDATION: 'AI 추천 데이터를 불러오는 중...',
    SENSOR_DATA: '센서 데이터를 불러오는 중...',
    WEATHER: '날씨 정보를 불러오는 중...',
    NOTIFICATION: '알림을 불러오는 중...',
    GENERAL: '데이터를 불러오는 중...'
  },

  // 액션별 로딩
  ACTIONS: {
    SAVE: '저장 중...',
    UPDATE: '업데이트 중...',
    DELETE: '삭제 중...',
    APPROVE: '승인 중...',
    REJECT: '거부 중...',
    UPLOAD: '업로드 중...',
    DOWNLOAD: '다운로드 중...',
    LOGIN: '로그인 중...',
    LOGOUT: '로그아웃 중...',
    PASSWORD_CHANGE: '비밀번호 변경 중...',
    GENERAL: '처리 중...'
  },

  // 일반적인 로딩
  GENERAL: '로딩 중...'
};

/**
 * 페이지 경로에 따른 로딩 텍스트 자동 감지
 */
export const getPageLoadingText = (pathname) => {
  const path = pathname.toLowerCase();
  
  if (path.includes('/alarm')) return LOADING_TEXTS.PAGES.ALARM;
  if (path.includes('/report')) return LOADING_TEXTS.PAGES.REPORT;
  if (path.includes('/graph')) return LOADING_TEXTS.PAGES.GRAPH;
  if (path.includes('/zone')) return LOADING_TEXTS.PAGES.ZONE;
  if (path.includes('/setting')) return LOADING_TEXTS.PAGES.SETTING;
  if (path.includes('/login')) return LOADING_TEXTS.PAGES.LOGIN;
  if (path.includes('/home')) return LOADING_TEXTS.PAGES.HOME;
  
  return LOADING_TEXTS.PAGES.GENERAL;
};

/**
 * 컴포넌트 이름에 따른 로딩 텍스트 자동 감지
 */
export const getComponentLoadingText = (componentName) => {
  const name = componentName.toLowerCase();
  
  if (name.includes('alarm')) return LOADING_TEXTS.PAGES.ALARM;
  if (name.includes('report')) return LOADING_TEXTS.PAGES.REPORT;
  if (name.includes('graph')) return LOADING_TEXTS.PAGES.GRAPH;
  if (name.includes('zone')) return LOADING_TEXTS.PAGES.ZONE;
  if (name.includes('setting')) return LOADING_TEXTS.PAGES.SETTING;
  if (name.includes('user')) return LOADING_TEXTS.DATA.USER_LIST;
  if (name.includes('ai') || name.includes('recommend')) return LOADING_TEXTS.DATA.AI_RECOMMENDATION;
  if (name.includes('sensor')) return LOADING_TEXTS.DATA.SENSOR_DATA;
  if (name.includes('weather')) return LOADING_TEXTS.DATA.WEATHER;
  
  return LOADING_TEXTS.GENERAL;
};

export default LOADING_TEXTS;
