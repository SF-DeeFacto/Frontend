import React from 'react';

const SearchFilterSection = ({ 
  searchConfig, 
  filters = [], 
  resultCount, 
  onSearchChange, 
  onFilterChange,
  actionButton,
  className = "bg-white p-4 rounded-lg shadow mb-6"
}) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 검색바 - 2칸 차지 */}
        {searchConfig && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {searchConfig.label}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={searchConfig.placeholder}
                value={searchConfig.value}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${searchConfig.showIcon ? 'pl-10' : ''}`}
              />
              {searchConfig.showIcon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              )}
            </div>
            {searchConfig.showClearButton && searchConfig.value && (
              <button
                onClick={() => onSearchChange('')}
                className="mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                검색 초기화
              </button>
            )}
          </div>
        )}
        
        {/* 필터들 */}
        {filters.map(filter => (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
            </label>
            {filter.type === 'select' ? (
              <select
                value={filter.value}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : filter.type === 'custom' ? (
              filter.component
            ) : null}
          </div>
        ))}
        
        {/* 결과수 */}
        {resultCount !== undefined && (
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              총 {resultCount}개
            </div>
          </div>
        )}
        
        {/* 액션 버튼 - 맨 오른쪽 */}
        {actionButton && (
          <div className="flex items-end justify-end">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterSection;
