import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FiCheckCircle } from 'react-icons/fi';
import Text from '@components/common/Text';
import Icon from '@components/common/Icon';

// 상수 정의
const ALARM_TYPES = ['전체', '알림', '리포트'];
const STATUS_FILTERS = ['즐겨찾기', '안읽음', '읽음'];

// 알림 유형 토글 컴포넌트 - 모던 디자인 적용
const AlarmTypeToggle = ({ alarmType, setAlarmType }) => (
  <div className="flex gap-1 bg-secondary-100 dark:bg-neutral-700 rounded-xl p-1 transition-colors duration-300">
    {ALARM_TYPES.map((type) => (
      <button
        key={type}
        onClick={() => setAlarmType(type)}
        className={`px-4 py-2.5 rounded-xl transition-all duration-200 ${
          alarmType === type
            ? 'bg-white dark:bg-neutral-600 text-primary-600 shadow-soft font-semibold scale-105'
            : 'text-secondary-600 dark:text-neutral-300 hover:text-primary-600 hover:bg-white/50 dark:hover:bg-neutral-600/50'
        }`}
      >
        <Text variant="body" size="sm" weight={alarmType === type ? "semibold" : "medium"}>
          {type}
        </Text>
      </button>
    ))}
  </div>
);

// 상태 필터 탭 컴포넌트 - 모던 디자인 적용
const StatusFilterTabs = ({ statusFilter, setStatusFilter, onMarkAllAsRead, hasUnreadAlarms }) => (
  <div className="flex gap-1 bg-secondary-100 dark:bg-neutral-700 rounded-xl p-1 transition-colors duration-300">
    {STATUS_FILTERS.map((status) => (
      <button
        key={status}
        onClick={() => setStatusFilter(status)}
        className={`px-4 py-2.5 rounded-xl transition-all duration-200 ${
          statusFilter === status
            ? 'bg-white dark:bg-neutral-600 text-primary-600 shadow-soft font-semibold scale-105'
            : 'text-secondary-600 dark:text-neutral-300 hover:text-primary-600 hover:bg-white/50 dark:hover:bg-neutral-600/50'
        }`}
      >
        <Text variant="body" size="sm" weight={statusFilter === status ? "semibold" : "medium"}>
          {status}
        </Text>
      </button>
    ))}
  </div>
);

// 전체 읽음 버튼 컴포넌트 - 모던 디자인 적용
const MarkAllAsReadButton = ({ onMarkAllAsRead, hasUnreadAlarms }) => (
  <button
    onClick={onMarkAllAsRead}
    className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-soft hover:shadow-medium hover:scale-105 ${
      hasUnreadAlarms 
        ? 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700' 
        : 'bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
    }`}
    disabled={!hasUnreadAlarms}
  >
    <Icon size="16px">
      <FiCheckCircle />
    </Icon>
    <Text variant="body" size="sm" weight="semibold">
      전체 읽음
    </Text>
  </button>
);

// 메인 필터 컴포넌트 - 모던 디자인 적용
const AlarmFilters = ({ 
  alarmType, 
  setAlarmType, 
  statusFilter, 
  setStatusFilter, 
  onMarkAllAsRead, 
  hasUnreadAlarms 
}) => {
  return (
    <div className="modern-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-brand-main to-primary-700 rounded-full"></div>
            <Text variant="body" size="lg" weight="bold" color="secondary-800" className="dark:text-neutral-100">
              알림 필터
            </Text>
          </div>
          <AlarmTypeToggle 
            alarmType={alarmType} 
            setAlarmType={setAlarmType} 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <StatusFilterTabs 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
            onMarkAllAsRead={onMarkAllAsRead}
            hasUnreadAlarms={hasUnreadAlarms}
          />
          <MarkAllAsReadButton 
            onMarkAllAsRead={onMarkAllAsRead}
            hasUnreadAlarms={hasUnreadAlarms}
          />
        </div>
      </div>
    </div>
  );
});

AlarmFilters.displayName = 'AlarmFilters';

AlarmFilters.propTypes = {
  alarmType: PropTypes.string.isRequired,
  setAlarmType: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  onMarkAllAsRead: PropTypes.func.isRequired,
  hasUnreadAlarms: PropTypes.bool.isRequired,
};

export default AlarmFilters;
