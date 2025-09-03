import { SSE_ERROR_TYPES, SSE_LOGGING } from '../config/sseConfig';

/**
 * SSE 에러 처리 중앙화
 * 모든 SSE 관련 에러를 분류하고 적절한 처리 방법을 제공
 */
export class SSEErrorHandler {
  /**
   * 연결 에러 처리
   */
  static handleConnectionError(error, context = {}) {
    const errorInfo = this.analyzeError(error);
    
    console.error('❌ SSE 연결 에러 발생:', {
      에러타입: errorInfo.type,
      에러메시지: errorInfo.message,
      컨텍스트: context,
      원본에러: error,
      timestamp: new Date().toLocaleTimeString()
    });

    // 에러 타입별 처리
    switch (errorInfo.type) {
      case SSE_ERROR_TYPES.AUTHENTICATION:
        return this.handleAuthError(errorInfo, context);
      case SSE_ERROR_TYPES.NETWORK:
        return this.handleNetworkError(errorInfo, context);
      case SSE_ERROR_TYPES.TIMEOUT:
        return this.handleTimeoutError(errorInfo, context);
      default:
        return this.handleGenericError(errorInfo, context);
    }
  }

  /**
   * 데이터 에러 처리
   */
  static handleDataError(error, data, context = {}) {
    const errorInfo = this.analyzeError(error);
    
    console.error('❌ SSE 데이터 에러 발생:', {
      에러타입: errorInfo.type,
      에러메시지: errorInfo.message,
      컨텍스트: context,
      원본데이터: data,
      원본에러: error,
      timestamp: new Date().toLocaleTimeString()
    });

    // 데이터 파싱 에러인 경우
    if (errorInfo.type === SSE_ERROR_TYPES.PARSE) {
      return this.handleParseError(errorInfo, data, context);
    }

    return this.handleGenericError(errorInfo, context);
  }

  /**
   * 재연결 에러 처리
   */
  static handleReconnection(context = {}) {
    console.warn('⚠️ SSE 재연결 시도:', {
      컨텍스트: context,
      시도시간: new Date().toLocaleTimeString()
    });

    // 재연결 로직 구현
    return {
      shouldRetry: true,
      retryDelay: this.calculateRetryDelay(context),
      maxRetries: context.maxRetries || 3
    };
  }

  /**
   * 에러 분석 및 분류
   */
  static analyzeError(error) {
    if (!error) {
      return {
        type: SSE_ERROR_TYPES.UNKNOWN,
        message: '알 수 없는 에러',
        code: null,
        retryable: false
      };
    }

    // 네트워크 에러
    if (error.name === 'NetworkError' || error.message.includes('Network')) {
      return {
        type: SSE_ERROR_TYPES.NETWORK,
        message: '네트워크 연결 오류',
        code: 'NETWORK_ERROR',
        retryable: true
      };
    }

    // 인증 에러
    if (error.status === 401 || error.message.includes('Unauthorized')) {
      return {
        type: SSE_ERROR_TYPES.AUTHENTICATION,
        message: '인증 실패 - 토큰이 유효하지 않습니다',
        code: 'AUTH_ERROR',
        retryable: false
      };
    }

    // 권한 에러
    if (error.status === 403 || error.message.includes('Forbidden')) {
      return {
        type: SSE_ERROR_TYPES.AUTHORIZATION,
        message: '권한 없음 - 접근이 거부되었습니다',
        code: 'PERMISSION_ERROR',
        retryable: false
      };
    }

    // 타임아웃 에러
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return {
        type: SSE_ERROR_TYPES.TIMEOUT,
        message: '연결 타임아웃',
        code: 'TIMEOUT_ERROR',
        retryable: true
      };
    }

    // 파싱 에러
    if (error.name === 'SyntaxError' || error.message.includes('JSON')) {
      return {
        type: SSE_ERROR_TYPES.PARSE,
        message: '데이터 파싱 오류',
        code: 'PARSE_ERROR',
        retryable: false
      };
    }

    // 기타 에러
    return {
      type: SSE_ERROR_TYPES.UNKNOWN,
      message: error.message || '알 수 없는 에러',
      code: error.code || 'UNKNOWN_ERROR',
      retryable: true
    };
  }

  /**
   * 인증 에러 처리
   */
  static handleAuthError(errorInfo, context) {
    console.warn('🔐 인증 에러 처리:', {
      에러: errorInfo,
      컨텍스트: context,
      timestamp: new Date().toLocaleTimeString()
    });

    // 토큰 갱신 시도
    this.attemptTokenRefresh(context);
    
    return {
      action: 'REFRESH_TOKEN',
      retryable: false,
      userMessage: '인증이 만료되었습니다. 다시 로그인해주세요.'
    };
  }

  /**
   * 네트워크 에러 처리
   */
  static handleNetworkError(errorInfo, context) {
    console.warn('🌐 네트워크 에러 처리:', {
      에러: errorInfo,
      컨텍스트: context,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      action: 'RETRY_CONNECTION',
      retryable: true,
      retryDelay: this.calculateRetryDelay(context),
      userMessage: '네트워크 연결을 확인하고 다시 시도해주세요.'
    };
  }

  /**
   * 타임아웃 에러 처리
   */
  static handleTimeoutError(errorInfo, context) {
    console.warn('⏰ 타임아웃 에러 처리:', {
      에러: errorInfo,
      컨텍스트: context,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      action: 'RETRY_CONNECTION',
      retryable: true,
      retryDelay: this.calculateRetryDelay(context),
      userMessage: '연결이 시간 초과되었습니다. 다시 시도해주세요.'
    };
  }

  /**
   * 파싱 에러 처리
   */
  static handleParseError(errorInfo, data, context) {
    console.warn('🔍 파싱 에러 처리:', {
      에러: errorInfo,
      원본데이터: data,
      컨텍스트: context,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      action: 'SKIP_MESSAGE',
      retryable: false,
      userMessage: '데이터 형식이 올바르지 않습니다.'
    };
  }

  /**
   * 일반 에러 처리
   */
  static handleGenericError(errorInfo, context) {
    console.warn('⚠️ 일반 에러 처리:', {
      에러: errorInfo,
      컨텍스트: context,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      action: 'LOG_ERROR',
      retryable: errorInfo.retryable,
      retryDelay: errorInfo.retryable ? this.calculateRetryDelay(context) : null,
      userMessage: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    };
  }

  /**
   * 토큰 갱신 시도
   */
  static attemptTokenRefresh(context) {
    console.log('🔄 토큰 갱신 시도:', {
      컨텍스트: context,
      timestamp: new Date().toLocaleTimeString()
    });

    // 토큰 갱신 로직 구현
    // localStorage에서 refresh_token 확인
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      // 토큰 갱신 API 호출
      this.refreshAccessToken(refreshToken);
    } else {
      console.error('❌ 리프레시 토큰이 없습니다. 로그인이 필요합니다.');
      // 로그인 페이지로 리다이렉트
      this.redirectToLogin();
    }
  }

  /**
   * 액세스 토큰 갱신
   */
  static async refreshAccessToken(refreshToken) {
    try {
      console.log('🔄 액세스 토큰 갱신 시작');
      
      // 토큰 갱신 API 호출
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        console.log('✅ 액세스 토큰 갱신 성공');
        
        // SSE 연결 재시도
        this.retrySSEConnection();
      } else {
        throw new Error('토큰 갱신 실패');
      }
    } catch (error) {
      console.error('❌ 액세스 토큰 갱신 실패:', error);
      this.redirectToLogin();
    }
  }

  /**
   * SSE 연결 재시도
   */
  static retrySSEConnection() {
    console.log('🔄 SSE 연결 재시도');
    
    // 전역 이벤트 발생으로 SSE 재연결 트리거
    window.dispatchEvent(new CustomEvent('sse-reconnect', {
      detail: { reason: 'token_refreshed' }
    }));
  }

  /**
   * 로그인 페이지로 리다이렉트
   */
  static redirectToLogin() {
    console.log('🔀 로그인 페이지로 리다이렉트');
    
    // 로그인 페이지로 이동
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * 재시도 지연 시간 계산
   */
  static calculateRetryDelay(context) {
    const baseDelay = 2000; // 기본 2초
    const maxDelay = 30000; // 최대 30초
    const attempt = context.attempt || 0;
    
    // 지수 백오프 (exponential backoff)
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    
    console.log(`⏱️ 재시도 지연 시간 계산:`, {
      시도횟수: attempt,
      계산된지연: `${delay}ms`,
      최대지연: `${maxDelay}ms`
    });
    
    return delay;
  }

  /**
   * 에러 통계 수집
   */
  static collectErrorStats(errorInfo, context) {
    if (!SSE_LOGGING.ENABLED) return;

    const stats = {
      timestamp: new Date().toISOString(),
      errorType: errorInfo.type,
      errorCode: errorInfo.code,
      context: context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 에러 통계를 로컬 스토리지에 저장
    try {
      const existingStats = JSON.parse(localStorage.getItem('sse_error_stats') || '[]');
      existingStats.push(stats);
      
      // 최대 100개까지만 유지
      if (existingStats.length > 100) {
        existingStats.splice(0, existingStats.length - 100);
      }
      
      localStorage.setItem('sse_error_stats', JSON.stringify(existingStats));
    } catch (error) {
      console.warn('에러 통계 저장 실패:', error);
    }
  }

  /**
   * 에러 통계 조회
   */
  static getErrorStats() {
    try {
      return JSON.parse(localStorage.getItem('sse_error_stats') || '[]');
    } catch (error) {
      console.warn('에러 통계 조회 실패:', error);
      return [];
    }
  }

  /**
   * 에러 통계 초기화
   */
  static clearErrorStats() {
    localStorage.removeItem('sse_error_stats');
    console.log('✅ 에러 통계 초기화 완료');
  }
}

// 편의 함수들
export const handleSSEError = (error, context) => SSEErrorHandler.handleConnectionError(error, context);
export const handleSSEDataError = (error, data, context) => SSEErrorHandler.handleDataError(error, data, context);
export const handleSSEReconnection = (context) => SSEErrorHandler.handleReconnection(context);
export const getSSEErrorStats = () => SSEErrorHandler.getErrorStats();
export const clearSSEErrorStats = () => SSEErrorHandler.clearErrorStats();
