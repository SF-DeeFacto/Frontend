import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "default",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  type = "button",
  'aria-label': ariaLabel,
  ...props 
}) => {
  // 공통 스타일 패턴
  const commonStyles = {
    base: "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    shadow: "shadow-soft hover:shadow-medium",
    hover: !disabled && !loading ? 'hover:scale-105' : ''
  };

  // 그라디언트 스타일 패턴
  const gradientBase = "bg-gradient-to-r text-white shadow-soft hover:shadow-medium";
  
  const variants = {
    default: "bg-white dark:bg-neutral-700 hover:bg-secondary-50 dark:hover:bg-neutral-600 text-secondary-700 dark:text-neutral-100 border border-secondary-200 dark:border-neutral-600 hover:border-secondary-300 dark:hover:border-neutral-500 shadow-soft hover:shadow-medium focus:ring-primary-500",
    primary: "gradient-button focus:ring-primary-500",
    secondary: "bg-secondary-100 dark:bg-neutral-600 hover:bg-secondary-200 dark:hover:bg-neutral-500 text-secondary-700 dark:text-neutral-100 border border-secondary-300 dark:border-neutral-500 shadow-soft hover:shadow-medium focus:ring-secondary-500",
    success: `${gradientBase} from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 focus:ring-success-500`,
    warning: `${gradientBase} from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 focus:ring-warning-500`,
    danger: `${gradientBase} from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 focus:ring-danger-500`,
    ghost: "hover:bg-secondary-50 dark:hover:bg-neutral-700 text-secondary-600 dark:text-neutral-300 hover:text-secondary-800 dark:hover:text-neutral-100 focus:ring-secondary-500",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 focus:ring-primary-500",
    link: "text-primary-500 hover:text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500 p-0",
    icon: "p-2 rounded-xl hover:bg-secondary-50 dark:hover:bg-neutral-700 text-secondary-600 dark:text-neutral-300 hover:text-secondary-800 dark:hover:text-neutral-100 focus:ring-secondary-500"
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-lg",
    sm: "px-3 py-2 text-sm rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl"
  };

  // 아이콘 처리
  const renderIcon = (iconComponent, position) => {
    if (!iconComponent) return null;
    return (
      <span className={`flex-shrink-0 ${position === 'right' ? 'order-2' : ''}`}>
        {iconComponent}
      </span>
    );
  };

  // 접근성 라벨 생성
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (loading) return '로딩 중';
    if (disabled) return '비활성화됨';
    return undefined;
  };

  // 클래스명 조합
  const buttonClasses = [
    commonStyles.base,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    commonStyles.hover,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={getAriaLabel()}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      
      {!loading && (
        <>
          {renderIcon(leftIcon || icon, 'left')}
          {children && <span className="flex-1">{children}</span>}
          {renderIcon(rightIcon, 'right')}
        </>
      )}
    </button>
  );
};

export default Button; 