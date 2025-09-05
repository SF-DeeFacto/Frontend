import React from 'react';
import { getIconConfig, DEFAULT_ICON_SIZE, GLOBAL_ICON_SCALE, ICON_STROKE_WIDTH } from '../../config/iconConfig';

const Icon = ({ children, size = DEFAULT_ICON_SIZE, className = "", style = {}, ...props }) => {
  const iconConfig = getIconConfig(size);
  const scaledSize = Math.round(iconConfig.size * GLOBAL_ICON_SCALE);
  
  return (
    <div 
      className={`${iconConfig.class} flex-shrink-0 flex items-center justify-center ${className}`}
      style={style}
      {...props}
    >
      {React.cloneElement(children, { 
        size: scaledSize,
        strokeWidth: ICON_STROKE_WIDTH 
      })}
    </div>
  );
};

export default Icon; 