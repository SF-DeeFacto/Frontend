import React from 'react';
import { SYSTEM_CONFIG } from '../../config/constants';

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.currentPage - 현재 페이지 (0-based)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {function} props.onPageChange - 페이지 변경 핸들러
 * @param {number} [props.maxVisiblePages] - 표시할 최대 페이지 수 (기본값: 5)
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {Object} [props.labels] - 버튼 라벨 설정
 * @param {string} [props.size] - 버튼 크기 ('sm', 'md', 'lg')
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = SYSTEM_CONFIG.MAX_VISIBLE_PAGES,
  className = "",
  labels = {
    previous: "← 이전",
    next: "다음 →",
    ellipsis: "..."
  },
  size = "md"
}) => {
  // 페이지가 1개 이하면 페이지네이션을 표시하지 않음
  if (totalPages <= 1) return null;

  /**
   * 표시할 페이지 번호 배열 생성
   */
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 maxVisiblePages 이하면 모든 페이지 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 복잡한 페이지네이션 로직
      if (currentPage <= 2) {
        // 시작 부분
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push(labels.ellipsis);
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // 끝 부분
        pages.push(0);
        pages.push(labels.ellipsis);
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간 부분
        pages.push(0);
        pages.push(labels.ellipsis);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(labels.ellipsis);
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  /**
   * 크기별 CSS 클래스
   */
  const sizeClasses = {
    sm: {
      button: "px-2.5 py-1.5 text-sm",
      pageButton: "px-2.5 py-1.5 text-sm"
    },
    md: {
      button: "px-4 py-2.5",
      pageButton: "px-3.5 py-2.5"
    },
    lg: {
      button: "px-6 py-3 text-lg",
      pageButton: "px-4 py-3 text-lg"
    }
  };

  const currentSizeClasses = sizeClasses[size] || sizeClasses.md;

  /**
   * 기본 버튼 스타일
   */
  const baseButtonClasses = `${currentSizeClasses.button} rounded-xl font-medium transition-all duration-200 shadow-soft hover:shadow-medium`;
  const pageButtonClasses = `${currentSizeClasses.pageButton} rounded-xl font-medium transition-all duration-200`;

  /**
   * 이전 페이지 버튼 스타일
   */
  const getPreviousButtonClasses = () => {
    const disabled = currentPage === 0;
    return `${baseButtonClasses} ${
      disabled
        ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
        : 'bg-white dark:bg-neutral-700 text-secondary-600 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-600 hover:text-primary-600 hover:scale-105'
    }`;
  };

  /**
   * 다음 페이지 버튼 스타일
   */
  const getNextButtonClasses = () => {
    const disabled = currentPage === totalPages - 1;
    return `${baseButtonClasses} ${
      disabled
        ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
        : 'bg-white dark:bg-neutral-700 text-secondary-600 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-600 hover:text-primary-600 hover:scale-105'
    }`;
  };

  /**
   * 페이지 번호 버튼 스타일
   */
  const getPageButtonClasses = (page) => {
    if (page === labels.ellipsis) {
      return `${pageButtonClasses} bg-transparent text-secondary-400 dark:text-neutral-500 cursor-default`;
    }
    
    if (page === currentPage) {
      return `${pageButtonClasses} bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft scale-105`;
    }
    
    return `${pageButtonClasses} bg-white dark:bg-neutral-700 text-secondary-600 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-600 hover:text-primary-600 hover:scale-105 shadow-soft hover:shadow-medium`;
  };

  return (
    <div className={`flex items-center justify-center space-x-1 mt-8 ${className}`}>
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={getPreviousButtonClasses()}
        aria-label="이전 페이지"
      >
        {labels.previous}
      </button>

      {/* 페이지 번호들 */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === labels.ellipsis}
          className={getPageButtonClasses(page)}
          aria-label={typeof page === 'number' ? `페이지 ${page + 1}` : '더 많은 페이지'}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {typeof page === 'number' ? page + 1 : page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={getNextButtonClasses()}
        aria-label="다음 페이지"
      >
        {labels.next}
      </button>
    </div>
  );
};

export default Pagination;
