/**
 * 알림 관련 에러 처리 유틸리티
 */

/**
 * API 에러 타입별 처리
 */
export const handleAlarmApiError = (error, operation) => {
  console.error(`${operation} 실패:`, error);
  
  let errorMessage = `${operation}에 실패했습니다.`;
  let errorType = 'general';
  
  if (error.response) {
    // 서버 응답이 있는 경우
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
        errorType = 'auth';
        break;
      case 403:
        errorMessage = '권한이 없습니다.';
        errorType = 'permission';
        break;
      case 404:
        errorMessage = '요청한 알림을 찾을 수 없습니다.';
        errorType = 'notFound';
        break;
      case 500:
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        errorType = 'server';
        break;
      default:
        errorMessage = data?.message || errorMessage;
    }
  } else if (error.code === 'ERR_NETWORK') {
    // 네트워크 에러
    errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
    errorType = 'network';
  } else if (error.message) {
    // 기타 에러
    errorMessage = error.message;
  }
  
  return {
    message: errorMessage,
    type: errorType,
    originalError: error
  };
};

/**
 * 사용자에게 에러 알림 표시
 */
export const showErrorAlert = (errorInfo) => {
  if (errorInfo.type === 'auth') {
    // 인증 에러는 자동으로 로그인 페이지로 리다이렉트
    alert(errorInfo.message);
    // 여기서 로그인 페이지로 리다이렉트 로직 추가 가능
    return;
  }
  
  // 일반적인 에러는 alert로 표시
  alert(errorInfo.message);
};

/**
 * 에러 로깅 (개발 환경에서만)
 */
export const logError = (error, context) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${context} 에러`);
    console.error('에러 객체:', error);
    console.error('에러 메시지:', error.message);
    console.error('에러 스택:', error.stack);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    console.groupEnd();
  }
};
