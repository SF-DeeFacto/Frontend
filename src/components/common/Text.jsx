import React from 'react';

const Text = ({ 
  variant = "body",
  size = "md",
  weight = "normal",
  color = "gray-700",
  className = "",
  children,
  ...props 
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "28px": "text-[28px]"
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal", 
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold"
  };

  const variantClasses = {
    body: "leading-normal",
    menu: "leading-6",
    title: "leading-7",
    caption: "leading-4",
    button: "leading-5"
  };

  const colorClasses = {
    // 기본 색상
    "white": "text-white",
    "black": "text-black",
    
    // 브랜드 색상
    "primary-500": "text-primary-500",
    "primary-600": "text-primary-600",
    "primary-700": "text-primary-700",
    "primary-800": "text-primary-800",
    "primary-900": "text-primary-900",
    "brand-main": "text-brand-main",
    
    // 중성 색상 (다크모드 지원)
    "neutral-100": "text-neutral-100 dark:text-neutral-100",
    "neutral-200": "text-neutral-200 dark:text-neutral-200",
    "neutral-300": "text-neutral-300 dark:text-neutral-300",
    "neutral-400": "text-neutral-400 dark:text-neutral-400",
    "neutral-500": "text-neutral-500 dark:text-neutral-500",
    "neutral-600": "text-neutral-600 dark:text-neutral-600",
    "neutral-700": "text-neutral-700 dark:text-neutral-700",
    "neutral-800": "text-neutral-800 dark:text-neutral-800",
    "neutral-900": "text-neutral-900 dark:text-neutral-900",
    
    // 보조 색상 (다크모드 지원)
    "secondary-100": "text-secondary-100 dark:text-neutral-100",
    "secondary-200": "text-secondary-200 dark:text-neutral-200",
    "secondary-300": "text-secondary-300 dark:text-neutral-300",
    "secondary-400": "text-secondary-400 dark:text-neutral-400",
    "secondary-500": "text-secondary-500 dark:text-neutral-400",
    "secondary-600": "text-secondary-600 dark:text-neutral-300",
    "secondary-700": "text-secondary-700 dark:text-neutral-100",
    "secondary-800": "text-secondary-800 dark:text-neutral-100",
    "secondary-900": "text-secondary-900 dark:text-neutral-100",
    
    // 상태 색상
    "success-500": "text-success-500",
    "success-600": "text-success-600",
    "warning-500": "text-warning-500",
    "warning-600": "text-warning-600",
    "danger-500": "text-danger-500",
    "danger-600": "text-danger-600",
    
    // 레거시 색상 (하위 호환성)
    "gray-700": "text-secondary-700 dark:text-neutral-100",
    "gray-600": "text-secondary-600 dark:text-neutral-300",
    "gray-500": "text-secondary-500 dark:text-neutral-400",
    "gray-800": "text-secondary-800 dark:text-neutral-100",
    "gray-900": "text-secondary-900 dark:text-neutral-100",
    "blue-600": "text-primary-600"
  };

  const classes = [
    sizeClasses[size],
    weightClasses[weight],
    variantClasses[variant],
    colorClasses[color],
    className
  ].filter(Boolean).join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Text; 