import React, { Component } from 'react';
import Text from './Text';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <Text variant="title" size="xl" weight="bold" color="gray-900" className="mb-2">
                오류가 발생했습니다
              </Text>
              <Text variant="body" size="md" color="gray-600" className="mb-6">
                페이지를 새로고침하거나 다시 시도해주세요.
              </Text>
              <div className="space-x-4">
                <Button onClick={this.handleRetry} variant="primary">
                  다시 시도
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="secondary"
                >
                  페이지 새로고침
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    개발자 정보
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 