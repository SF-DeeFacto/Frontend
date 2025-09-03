import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Text = memo(({ 
  variant = "body",
  size = "md",
  weight = "normal",
  color = "gray-700",
  className = "",
  children,
  as: Component = "span",
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
    "gray-700": "text-gray-700",
    "gray-600": "text-gray-600",
    "gray-500": "text-gray-500",
    "gray-800": "text-gray-800",
    "gray-900": "text-gray-900",
    "white": "text-white",
    "black": "text-black",
    "blue-600": "text-blue-600"
  };

  const classes = [
    sizeClasses[size],
    weightClasses[weight],
    variantClasses[variant],
    colorClasses[color],
    className
  ].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

Text.propTypes = {
  variant: PropTypes.oneOf(['body', 'menu', 'title', 'caption', 'button']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '28px']),
  weight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold']),
  color: PropTypes.oneOf(['gray-700', 'gray-600', 'gray-500', 'gray-800', 'gray-900', 'white', 'black', 'blue-600']),
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.elementType,
};

export default Text; 