import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  text = null,
  fullScreen = false,
  className = ''
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-200 border-t-secondary-600',
    success: 'border-success-200 border-t-success-600',
    warning: 'border-warning-200 border-t-warning-600',
    danger: 'border-danger-200 border-t-danger-600'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="relative">
        {/* 외부 링 */}
        <div className={`${sizes[size]} border-4 rounded-full animate-spin ${variants[variant]}`}></div>
        
        {/* 내부 점들 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
      
      {text && (
        <div className="mt-4 text-center animate-pulse">
          <p className="text-secondary-600 dark:text-neutral-300 font-medium">{text}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
