import React from 'react';
import { COLORS } from '../../config/constants';
import Text from './Text';

const ChartSection = ({ 
  title, 
  zone, 
  icon, 
  description,
  height = 'h-96', // 기본값 h-96 (384px)
  width = 'w-full', // 기본값 w-full
  backgroundColor = '#f0f8ff',
  borderColor = COLORS.INFO,
  showZone = false, // zone 표시 여부
  className = '' // 추가 클래스
}) => {
  return (
    <div 
      className={`bg-blue-50 dark:bg-neutral-800 border-2 border-blue-400 dark:border-neutral-600 rounded-lg p-4 relative transition-colors duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Text variant="title" size="lg" weight="semibold" color="primary-900" className="transition-colors duration-300">{title}</Text>
        {showZone && <Text variant="body" size="sm" color="secondary-500" className="transition-colors duration-300">{zone}</Text>}
      </div>
      <div className={`${height} ${width} bg-gray-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-neutral-600 transition-colors duration-300`}>
        <div className="text-center transition-colors duration-300">
          <div className="text-4xl mb-2">{icon}</div>
          <Text variant="body" size="md" color="neutral-400">{description}</Text>
        </div>
      </div>
    </div>
  );
};

export default ChartSection; 