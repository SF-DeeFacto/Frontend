import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Text from './Text';

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 */
const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5,
  showInfo = false,
  pageSize = 10,
  totalElements = 0,
  className = ""
}) => {
  // 페이지가 1개 이하이면 렌더링하지 않음
  if (totalPages <= 1) return null;

  // 페이지 번호 배열 생성 (메모이제이션)
  const pageNumbers = useMemo(() => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // 총 페이지가 최대 표시 페이지보다 적으면 모든 페이지 표시
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
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // 끝 부분
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간 부분
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // 페이지 정보 계산
  const pageInfo = useMemo(() => {
    const start = (currentPage * pageSize) + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalElements);
    return { start, end };
  }, [currentPage, pageSize, totalElements]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 페이지 정보 */}
      {showInfo && totalElements > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 rounded-xl px-4 py-2 backdrop-blur-sm border border-brand-medium/40 dark:border-neutral-600/40 shadow-soft">
            <div className="w-2 h-2 bg-brand-main rounded-full"></div>
            <Text variant="body" size="sm" color="secondary-600" className="font-medium dark:text-neutral-300">
              총 {totalElements}개 중 {pageInfo.start}-{pageInfo.end}번째 항목
            </Text>
          </div>
        </div>
      )}

      {/* 페이지네이션 버튼들 */}
      <div className="flex items-center justify-center space-x-1">
        {/* 이전 페이지 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2.5"
        >
          ← 이전
        </Button>

        {/* 페이지 번호들 */}
        {pageNumbers.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3.5 py-2.5 min-w-[40px] ${
              page === '...' ? 'cursor-default' : ''
            } ${
              page === currentPage ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            {page === '...' ? '•••' : (typeof page === 'number' ? page + 1 : page)}
          </Button>
        ))}

        {/* 다음 페이지 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2.5"
        >
          다음 →
        </Button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  maxVisiblePages: PropTypes.number,
  showInfo: PropTypes.bool,
  pageSize: PropTypes.number,
  totalElements: PropTypes.number,
  className: PropTypes.string,
};

export default Pagination;
