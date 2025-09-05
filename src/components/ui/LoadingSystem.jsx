import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * 통합 로딩 시스템 컴포넌트
 * 모든 로딩 상태를 일관되게 관리
 */

// 1. 기본 로딩 컴포넌트
export const Loading = ({ 
  loading, 
  loadingText = '로딩 중...',
  size = 'md',
  variant = 'primary',
  inline = false,
  className = '',
  children 
}) => {
  if (!loading) return children;
  
  if (inline) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <LoadingSpinner size={size} variant={variant} inline={true} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{loadingText}</span>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size={size} variant={variant} text={loadingText} />
    </div>
  );
};

// 2. 섹션 로딩 컴포넌트 (기존 SectionLoader 개선)
export const SectionLoading = ({ 
  loading, 
  loadingText = '로딩 중...',
  error = null,
  empty = false,
  emptyText = '데이터가 없습니다.',
  errorText = '오류가 발생했습니다.',
  size = 'md',
  variant = 'primary',
  className = '',
  showHeader = true,
  headerContent = null,
  children 
}) => {
  // 에러 상태
  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span className="text-danger-600 dark:text-danger-400 font-medium text-sm">
              {errorText}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (empty) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            </svg>
          </div>
          <p className="text-secondary-500 dark:text-neutral-300 font-medium text-lg">
            {emptyText}
          </p>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="p-4">
          <LoadingSpinner 
            size={size}
            variant={variant}
            text={loadingText}
          />
        </div>
      </div>
    );
  }

  // 정상 상태
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// 3. 페이지 로딩 컴포넌트 (인증 등 특별한 경우에만 사용)
export const PageLoading = ({ 
  loading, 
  loadingText = '페이지를 불러오는 중...',
  size = 'lg',
  variant = 'primary',
  fullScreen = true,
  className = '',
  children 
}) => {
  if (!loading) return children;
  
  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
        <LoadingSpinner size={size} variant={variant} text={loadingText} />
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <LoadingSpinner size={size} variant={variant} text={loadingText} />
    </div>
  );
};

// 4. 버튼 로딩 컴포넌트
export const ButtonLoading = ({ 
  loading, 
  loadingText = '처리 중...',
  size = 'xs',
  variant = 'primary',
  disabled = false,
  className = '',
  children 
}) => {
  return (
    <button 
      disabled={disabled || loading}
      className={`flex items-center gap-2 ${className}`}
    >
      {loading && <LoadingSpinner size={size} variant={variant} inline={true} />}
      {loading ? loadingText : children}
    </button>
  );
};

// 5. 인라인 로딩 컴포넌트
export const InlineLoading = ({ 
  loading, 
  loadingText = '로딩 중...',
  size = 'xs',
  variant = 'primary',
  className = '',
  children 
}) => {
  if (!loading) return children;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LoadingSpinner size={size} variant={variant} inline={true} />
      <span className="text-sm text-gray-600 dark:text-gray-400">{loadingText}</span>
    </div>
  );
};

// 6. 스마트 로딩 컴포넌트 (자동 감지)
export const SmartLoading = ({ 
  loading, 
  error = null,
  empty = false,
  loadingText = '로딩 중...',
  errorText = '오류가 발생했습니다.',
  emptyText = '데이터가 없습니다.',
  size = 'md',
  variant = 'primary',
  className = '',
  children 
}) => {
  if (error) {
    return (
      <div className={`p-4 border-l-4 border-l-danger-500 bg-danger-50/50 dark:bg-danger-900/20 rounded ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <span className="text-danger-600 dark:text-danger-400 font-medium text-sm">
            {errorText}
          </span>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`p-12 text-center ${className}`}>
        <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-secondary-400 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </div>
        <p className="text-secondary-500 dark:text-neutral-300 font-medium text-lg">
          {emptyText}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
        <LoadingSpinner size={size} variant={variant} text={loadingText} />
      </div>
    );
  }

  return children;
};

export default {
  Loading,
  SectionLoading,
  PageLoading,
  ButtonLoading,
  InlineLoading,
  SmartLoading
};
