import React from 'react';
import Text from './Text';

const EmptyState = ({ 
  title = "데이터가 없습니다", 
  subtitle = null,
  icon = null,
  className = ""
}) => (
  <div className={`modern-card p-12 text-center ${className}`}>
    <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon || (
        <svg className="w-8 h-8 text-secondary-400 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        </svg>
      )}
    </div>
    <Text variant="body" size="lg" color="secondary-500" className="font-medium dark:text-neutral-300">
      {title}
    </Text>
    {subtitle && (
      <Text variant="body" size="sm" color="secondary-400" className="mt-2 dark:text-neutral-400">
        {subtitle}
      </Text>
    )}
  </div>
);

export default EmptyState;
