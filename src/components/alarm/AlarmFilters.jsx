import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Text from '../common/Text';
import Icon from '../common/Icon';

// 상수 정의
const ALARM_TYPES = ['전체', '알림', '리포트'];
const STATUS_FILTERS = ['즐겨찾기', '안읽음', '읽음'];

// 알림 유형 토글 컴포넌트
const AlarmTypeToggle = ({ alarmType, setAlarmType }) => (
  <div className="flex gap-2">
    {ALARM_TYPES.map((type) => (
      <button
        key={type}
        onClick={() => setAlarmType(type)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          alarmType === type
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Text variant="body" size="sm" weight="medium">
          {type}
        </Text>
      </button>
    ))}
  </div>
);

// 상태 필터 탭 컴포넌트
const StatusFilterTabs = ({ statusFilter, setStatusFilter, onMarkAllAsRead, hasUnreadAlarms }) => (
  <div className="flex gap-2">
    {STATUS_FILTERS.map((status) => (
      <button
        key={status}
        onClick={() => setStatusFilter(status)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          statusFilter === status
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Text variant="body" size="sm" weight="medium">
          {status}
        </Text>
      </button>
    ))}
  </div>
);

// 전체 읽음 버튼 컴포넌트
const MarkAllAsReadButton = ({ onMarkAllAsRead, hasUnreadAlarms }) => (
  <button
    onClick={onMarkAllAsRead}
    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
      hasUnreadAlarms 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
    disabled={!hasUnreadAlarms}
  >
    <Icon size="16px">
      <FiCheckCircle />
    </Icon>
    <Text variant="body" size="sm" weight="medium">
      전체 읽음
    </Text>
  </button>
);

// 메인 필터 컴포넌트
const AlarmFilters = ({ 
  alarmType, 
  setAlarmType, 
  statusFilter, 
  setStatusFilter, 
  onMarkAllAsRead, 
  hasUnreadAlarms 
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <AlarmTypeToggle 
          alarmType={alarmType} 
          setAlarmType={setAlarmType} 
        />
        <div className="flex items-center gap-4">
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
};

export default AlarmFilters;
