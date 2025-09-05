import React from 'react';
import { getStatusColor, getStatusText } from '../../../utils/sensorUtils';
import { SENSOR_STATUS } from '../../../config/sensorConfig';

const StatusIndicator = () => {
  const statuses = [
    { status: SENSOR_STATUS.GREEN, label: '안전' },
    { status: SENSOR_STATUS.YELLOW, label: '경고' },
    { status: SENSOR_STATUS.RED, label: '위험' }
  ];

  return (
    <div className="flex w-full max-w-2xl h-8 items-center justify-center gap-4 relative mb-4">
      {statuses.map(({ status, label }) => (
        <div key={status} className="flex flex-1 items-center justify-center gap-4 relative">
          <div 
            className={`relative w-4 h-4 rounded-lg ${getStatusColor(status)}`}
          />
          <div className="relative w-fit font-medium text-black dark:text-neutral-100 text-sm tracking-normal leading-normal transition-colors duration-300">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusIndicator;
