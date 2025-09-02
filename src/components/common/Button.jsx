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
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-white dark:bg-neutral-700 hover:bg-secondary-50 dark:hover:bg-neutral-600 text-secondary-700 dark:text-neutral-100 border border-secondary-200 dark:border-neutral-600 hover:border-secondary-300 dark:hover:border-neutral-500 shadow-soft hover:shadow-medium focus:ring-primary-500",
    primary: "gradient-button focus:ring-primary-500",
    secondary: "bg-secondary-100 dark:bg-neutral-600 hover:bg-secondary-200 dark:hover:bg-neutral-500 text-secondary-700 dark:text-neutral-100 border border-secondary-300 dark:border-neutral-500 shadow-soft hover:shadow-medium focus:ring-secondary-500",
    success: "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-soft hover:shadow-medium focus:ring-success-500",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white shadow-soft hover:shadow-medium focus:ring-warning-500",
    danger: "bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white shadow-soft hover:shadow-medium focus:ring-danger-500",
    ghost: "hover:bg-secondary-50 dark:hover:bg-neutral-700 text-secondary-600 dark:text-neutral-300 hover:text-secondary-800 dark:hover:text-neutral-100 focus:ring-secondary-500"
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-lg",
    sm: "px-3 py-2 text-sm rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        !disabled && !loading ? 'hover:scale-105' : ''
      }`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

export default Button; 