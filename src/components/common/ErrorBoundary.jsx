import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Text from './Text';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId,
    });

    // 개발 환경에서 상세 에러 로깅
    if (import.meta.env.DEV) {
      console.error('🚨 ErrorBoundary caught an error:', {
        errorId,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: 프로덕션에서는 에러 로깅 서비스로 전송
    // logErrorToService({ errorId, error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const { fallback: CustomFallback, showDetails = false } = this.props;

      // 커스텀 폴백 컴포넌트가 있으면 사용
      if (CustomFallback) {
        return (
          <CustomFallback 
            error={error}
            errorId={errorId}
            onRetry={this.handleRetry}
          />
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
            {/* 에러 아이콘 */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* 에러 메시지 */}
            <Text as="h2" size="xl" weight="bold" className="mb-4 text-red-900 dark:text-red-100">
              문제가 발생했습니다
            </Text>
            
            <Text className="mb-6 text-red-700 dark:text-red-200">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </Text>

            {/* 에러 ID (개발/디버깅용) */}
            {(showDetails || import.meta.env.DEV) && errorId && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Text size="xs" className="text-red-600 dark:text-red-300 font-mono">
                  오류 ID: {errorId}
                </Text>
                {import.meta.env.DEV && error && (
                  <details className="mt-2 text-left">
                    <summary className="cursor-pointer text-red-700 dark:text-red-300 text-sm">
                      개발자 정보
                    </summary>
                    <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs overflow-auto text-red-800 dark:text-red-200">
                      {error.message}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="primary" 
                onClick={this.handleRetry}
                className="flex-1"
              >
                다시 시도
              </Button>
              <Button 
                variant="secondary" 
                onClick={this.handleReload}
                className="flex-1"
              >
                새로고침
              </Button>
              <Button 
                variant="ghost" 
                onClick={this.handleGoHome}
                className="flex-1"
              >
                홈으로
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  showDetails: PropTypes.bool,
};

export default ErrorBoundary;
