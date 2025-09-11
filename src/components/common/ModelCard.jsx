import React from 'react';
import Text from './Text';

const ModelCard = ({ zoneId, children, className = '' }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-white dark:bg-neutral-800 transition-colors duration-300 ${className}`}>
      {children || (
        <div className="text-center">
          <Text variant="title" size="xl" weight="semibold" color="secondary-700" className="transition-colors duration-300">
            Zone {zoneId?.toUpperCase()} 3D 모델 준비 중
          </Text>
        </div>
      )}
    </div>
  );
};

export default ModelCard;
