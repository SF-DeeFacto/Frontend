import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = 'rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 