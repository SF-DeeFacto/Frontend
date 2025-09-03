/**
 * 통합 에러 핸들러
 * 모든 API와 SSE 에러를 일관되게 처리하는 중앙화된 에러 관리 시스템
 */

// 에러 타입 상수
export const ERROR_TYPES = {
  // 네트워크 관련
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',
  
  // 인증/권한 관련
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // 서버 관련
  SERVER_ERROR: 'SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // 데이터 관련
  PARSE_ERROR: 'PARSE_ERROR',
  DATA_FORMAT_ERROR: 'DATA_FORMAT_ERROR',
  
  // 클라이언트 관련
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // 기타
  UNKNOWN: 'UNKNOWN',
  SSE_CONNECTION: 'SSE_CONNECTION',
  SSE_DATA: 'SSE_DATA'
};

// 에러 심각도 레벨
export const ERROR_SEVERITY = {
  LOW: 'LOW',           // 사용자에게 알리지 않음
  MEDIUM: 'MEDIUM',     // 토스트 메시지로 표시
  HIGH: 'HIGH',         // 모달로 표시
  CRITICAL: 'CRITICAL'  // 페이지 리다이렉트 필요
};

// 에러 메시지 템플릿
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: '네트워크 연결을 확인하고 다시 시도해주세요.',
  [ERROR_TYPES.TIMEOUT]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  [ERROR_TYPES.CONNECTION_LOST]: '연결이 끊어졌습니다. 자동으로 재연결을 시도합니다.',
  [ERROR_TYPES.AUTHENTICATION]: '인증이 필요합니다. 다시 로그인해주세요.',
  [ERROR_TYPES.AUTHORIZATION]: '접근 권한이 없습니다.',
  [ERROR_TYPES.TOKEN_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [ERROR_TYPES.SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ERROR_TYPES.BAD_REQUEST]: '잘못된 요청입니다.',
  [ERROR_TYPES.NOT_FOUND]: '요청한 데이터를 찾을 수 없습니다.',
  [ERROR_TYPES.VALIDATION_ERROR]: '입력 데이터를 확인해주세요.',
  [ERROR_TYPES.PARSE_ERROR]: '데이터 형식이 올바르지 않습니다.',
  [ERROR_TYPES.DATA_FORMAT_ERROR]: '데이터 형식이 올바르지 않습니다.',
  [ERROR_TYPES.VALIDATION_FAILED]: '입력값을 확인해주세요.',
  [ERROR_TYPES.INVALID_INPUT]: '올바르지 않은 입력입니다.',
  [ERROR_TYPES.SSE_CONNECTION]: '실시간 연결에 문제가 발생했습니다.',
  [ERROR_TYPES.SSE_DATA]: '실시간 데이터 처리 중 오류가 발생했습니다.',
  [ERROR_TYPES.UNKNOWN]: '알 수 없는 오류가 발생했습니다.'
};

/**
 * 통합 에러 핸들러 클래스
 */
export class UnifiedErrorHandler {
  /**
   * 에러 분석 및 분류
   */
  static analyzeError(error, context = {}) {
    if (!error) {
      return {
        type: ERROR_TYPES.UNKNOWN,
        severity: ERROR_SEVERITY.MEDIUM,
        message: ERROR_MESSAGES[ERROR_TYPES.UNKNOWN],
        retryable: false,
        userMessage: ERROR_MESSAGES[ERROR_TYPES.UNKNOWN]
      };
    }

    // HTTP 응답 에러 (axios 에러)
    if (error.response) {
      return this.analyzeHttpError(error, context);
    }

    // 네트워크 에러
    if (error.code === 'ERR_NETWORK' || error.name === 'NetworkError') {
      return {
        type: ERROR_TYPES.NETWORK,
        severity: ERROR_SEVERITY.HIGH,
        message: '네트워크 연결 실패',
        retryable: true,
        userMessage: ERROR_MESSAGES[ERROR_TYPES.NETWORK],
        originalError: error
      };
    }

    // 타임아웃 에러
    if (error.code === 'ECONNABORTED' || error.name === 'TimeoutError') {
      return {
        type: ERROR_TYPES.TIMEOUT,
        severity: ERROR_SEVERITY.MEDIUM,
        message: '요청 시간 초과',
        retryable: true,
        userMessage: ERROR_MESSAGES[ERROR_TYPES.TIMEOUT],
        originalError: error
      };
    }

    // SSE 관련 에러
    if (context.source === 'sse') {
      return this.analyzeSSEError(error, context);
    }

    // 파싱 에러
    if (error.name === 'SyntaxError' || error.message?.includes('JSON')) {
      return {
        type: ERROR_TYPES.PARSE_ERROR,
        severity: ERROR_SEVERITY.MEDIUM,
        message: '데이터 파싱 실패',
        retryable: false,
        userMessage: ERROR_MESSAGES[ERROR_TYPES.PARSE_ERROR],
        originalError: error
      };
    }

    // 기타 에러
    return {
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      message: error.message || '알 수 없는 오류',
      retryable: true,
      userMessage: ERROR_MESSAGES[ERROR_TYPES.UNKNOWN],
      originalError: error
    };
  }

  /**
   * HTTP 에러 분석
   */
  static analyzeHttpError(error, context) {
    const { status, data } = error.response;
    const operation = context.operation || '요청';

    switch (status) {
      case 400:
        return {
          type: ERROR_TYPES.BAD_REQUEST,
          severity: ERROR_SEVERITY.MEDIUM,
          message: data?.message || '잘못된 요청',
          retryable: false,
          userMessage: data?.message || ERROR_MESSAGES[ERROR_TYPES.BAD_REQUEST],
          originalError: error
        };

      case 401:
        return {
          type: ERROR_TYPES.AUTHENTICATION,
          severity: ERROR_SEVERITY.CRITICAL,
          message: '인증 실패',
          retryable: false,
          userMessage: ERROR_MESSAGES[ERROR_TYPES.AUTHENTICATION],
          originalError: error,
          action: 'REDIRECT_TO_LOGIN'
        };

      case 403:
        return {
          type: ERROR_TYPES.AUTHORIZATION,
          severity: ERROR_SEVERITY.HIGH,
          message: '권한 없음',
          retryable: false,
          userMessage: ERROR_MESSAGES[ERROR_TYPES.AUTHORIZATION],
          originalError: error
        };

      case 404:
        return {
          type: ERROR_TYPES.NOT_FOUND,
          severity: ERROR_SEVERITY.MEDIUM,
          message: '리소스를 찾을 수 없음',
          retryable: false,
          userMessage: ERROR_MESSAGES[ERROR_TYPES.NOT_FOUND],
          originalError: error
        };

      case 422:
        return {
          type: ERROR_TYPES.VALIDATION_ERROR,
          severity: ERROR_SEVERITY.MEDIUM,
          message: '입력 데이터 검증 실패',
          retryable: false,
          userMessage: data?.message || ERROR_MESSAGES[ERROR_TYPES.VALIDATION_ERROR],
          originalError: error
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ERROR_TYPES.SERVER_ERROR,
          severity: ERROR_SEVERITY.HIGH,
          message: '서버 오류',
          retryable: true,
          userMessage: ERROR_MESSAGES[ERROR_TYPES.SERVER_ERROR],
          originalError: error
        };

      default:
        return {
          type: ERROR_TYPES.UNKNOWN,
          severity: ERROR_SEVERITY.MEDIUM,
          message: data?.message || `HTTP ${status} 에러`,
          retryable: status >= 500,
          userMessage: data?.message || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN],
          originalError: error
        };
    }
  }

  /**
   * SSE 에러 분석
   */
  static analyzeSSEError(error, context) {
    if (error.message?.includes('Unauthorized') || error.status === 401) {
      return {
        type: ERROR_TYPES.TOKEN_EXPIRED,
        severity: ERROR_SEVERITY.CRITICAL,
        message: 'SSE 인증 실패',
        retryable: false,
        userMessage: ERROR_MESSAGES[ERROR_TYPES.TOKEN_EXPIRED],
        originalError: error,
        action: 'REDIRECT_TO_LOGIN'
      };
    }

    if (error.message?.includes('timeout') || error.name === 'TimeoutError') {
      return {
        type: ERROR_TYPES.SSE_CONNECTION,
        severity: ERROR_SEVERITY.MEDIUM,
        message: 'SSE 연결 타임아웃',
        retryable: true,
        userMessage: ERROR_MESSAGES[ERROR_TYPES.SSE_CONNECTION],
        originalError: error
      };
    }

    return {
      type: ERROR_TYPES.SSE_CONNECTION,
      severity: ERROR_SEVERITY.MEDIUM,
      message: 'SSE 연결 오류',
      retryable: true,
      userMessage: ERROR_MESSAGES[ERROR_TYPES.SSE_CONNECTION],
      originalError: error
    };
  }

  /**
   * 에러 처리 및 사용자 피드백
   */
  static handleError(error, context = {}) {
    const errorInfo = this.analyzeError(error, context);
    
    // 에러 로깅
    this.logError(errorInfo, context);
    
    // 사용자 피드백
    this.showUserFeedback(errorInfo, context);
    
    // 특별한 액션 처리
    this.handleSpecialActions(errorInfo, context);
    
    return errorInfo;
  }

  /**
   * 에러 로깅
   */
  static logError(errorInfo, context) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: errorInfo.type,
      severity: errorInfo.severity,
      message: errorInfo.message,
      context: context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: errorInfo.originalError?.stack
    };

    // 개발 환경에서는 상세 로그
    if (import.meta.env.DEV) {
      console.group(`🚨 ${errorInfo.severity} - ${errorInfo.type}`);
      console.error('에러 정보:', errorInfo);
      console.error('컨텍스트:', context);
      console.error('원본 에러:', errorInfo.originalError);
      console.groupEnd();
    }

    // 프로덕션에서는 간단한 로그
    console.error(`[${errorInfo.severity}] ${errorInfo.type}: ${errorInfo.message}`, {
      context,
      timestamp: logData.timestamp
    });

    // 에러 통계 수집
    this.collectErrorStats(logData);
  }

  /**
   * 사용자 피드백 표시
   */
  static showUserFeedback(errorInfo, context) {
    // LOW 심각도는 사용자에게 알리지 않음
    if (errorInfo.severity === ERROR_SEVERITY.LOW) {
      return;
    }

    // CRITICAL 에러는 즉시 처리 (리다이렉트 등)
    if (errorInfo.severity === ERROR_SEVERITY.CRITICAL) {
      return;
    }

    // 토스트 메시지 또는 알림 표시
    this.showNotification(errorInfo.userMessage, errorInfo.severity);
  }

  /**
   * 알림 표시
   */
  static showNotification(message, severity) {
    // 기존 알림 시스템이 있다면 사용, 없다면 기본 alert 사용
    if (window.showToast) {
      window.showToast(message, severity);
    } else if (window.showAlert) {
      window.showAlert(message, severity);
    } else {
      // 기본 alert 사용
      alert(message);
    }
  }

  /**
   * 특별한 액션 처리
   */
  static handleSpecialActions(errorInfo, context) {
    switch (errorInfo.action) {
      case 'REDIRECT_TO_LOGIN':
        this.redirectToLogin();
        break;
      case 'RETRY_CONNECTION':
        this.retryConnection(context);
        break;
    }
  }

  /**
   * 로그인 페이지로 리다이렉트
   */
  static redirectToLogin() {
    console.log('🔀 로그인 페이지로 리다이렉트');
    
    // 토큰 정리
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // 로그인 페이지로 이동
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * 토큰 갱신 (현재 백엔드에 refresh 엔드포인트가 없으므로 로그인 페이지로 리다이렉트)
   */
  static async refreshToken() {
    console.log('🔄 토큰 만료 - 로그인 페이지로 리다이렉트');
    
    // 현재 백엔드에 refresh 엔드포인트가 없으므로 바로 로그인 페이지로 이동
    this.redirectToLogin();
  }

  /**
   * 연결 재시도
   */
  static retryConnection(context) {
    console.log('🔄 연결 재시도:', context);
    
    // SSE 재연결 이벤트 발생
    if (context.source === 'sse') {
      window.dispatchEvent(new CustomEvent('sse-reconnect', {
        detail: { reason: 'error_retry', context }
      }));
    }
  }

  /**
   * 에러 통계 수집
   */
  static collectErrorStats(logData) {
    try {
      const existingStats = JSON.parse(localStorage.getItem('error_stats') || '[]');
      existingStats.push(logData);
      
      // 최대 100개까지만 유지
      if (existingStats.length > 100) {
        existingStats.splice(0, existingStats.length - 100);
      }
      
      localStorage.setItem('error_stats', JSON.stringify(existingStats));
    } catch (error) {
      console.warn('에러 통계 저장 실패:', error);
    }
  }

  /**
   * 에러 통계 조회
   */
  static getErrorStats() {
    try {
      return JSON.parse(localStorage.getItem('error_stats') || '[]');
    } catch (error) {
      console.warn('에러 통계 조회 실패:', error);
      return [];
    }
  }

  /**
   * 에러 통계 초기화
   */
  static clearErrorStats() {
    localStorage.removeItem('error_stats');
    console.log('✅ 에러 통계 초기화 완료');
  }

  /**
   * 재시도 지연 시간 계산 (지수 백오프)
   */
  static calculateRetryDelay(attempt = 0, baseDelay = 1000, maxDelay = 30000) {
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    return delay;
  }
}

// 편의 함수들
export const handleError = (error, context) => UnifiedErrorHandler.handleError(error, context);
export const analyzeError = (error, context) => UnifiedErrorHandler.analyzeError(error, context);
export const getErrorStats = () => UnifiedErrorHandler.getErrorStats();
export const clearErrorStats = () => UnifiedErrorHandler.clearErrorStats();

// API 에러 처리 전용 함수
export const handleApiError = (error, operation = 'API 요청') => {
  return UnifiedErrorHandler.handleError(error, { 
    source: 'api', 
    operation 
  });
};

// SSE 에러 처리 전용 함수
export const handleSSEError = (error, context = {}) => {
  return UnifiedErrorHandler.handleError(error, { 
    source: 'sse', 
    ...context 
  });
};

export default UnifiedErrorHandler;
