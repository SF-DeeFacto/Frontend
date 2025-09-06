import React from 'react';
import { getStatusColor, getStatusText } from '../../../utils/sensorUtils';
import { SENSOR_STATUS } from '../../../types/sensor';

const StatusIndicator = () => {
  const statuses = [
    { status: SENSOR_STATUS.GREEN, label: '정상' },
    { status: SENSOR_STATUS.YELLOW, label: '경고' },
    { status: SENSOR_STATUS.RED, label: '위험' }
  ];

  return (
    <div className="flex w-[666.36px] h-[31.88px] items-center justify-center gap-[15.59px] relative mb-4">
      {statuses.map(({ status, label }) => (
        <div key={status} className="flex w-[142.23px] items-center justify-center gap-[15.59px] relative -mt-[0.06px] -mb-[0.06px]">
          <div 
            className={`relative w-[15px] h-[15px] rounded-[8.77px] ${getStatusColor(status)}`}
          />
          <div className="relative w-fit -mt-[1.95px] font-medium text-black dark:text-neutral-100 text-[15.4px] tracking-[0] leading-normal transition-colors duration-300">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusIndicator;
