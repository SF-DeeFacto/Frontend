import React from 'react';
import { CheckCircle } from 'lucide-react';
import { COLORS } from '../../config/constants';
import Button from '../common/Button';

// 상수 정의
const ALARM_TYPES = ['전체', '알림', '리포트'];
const STATUS_FILTERS = ['전체', '즐겨찾기', '안읽음', '읽음'];
const READ_STATUS_FILTERS = ['전체', '안읽음', '읽음'];

// 메인 필터 컴포넌트 - 다른 페이지와 동일한 스타일 적용
const AlarmFilters = ({ 
  alarmType, 
  setAlarmType, 
  statusFilter, 
  setStatusFilter, 
  readStatusFilter,
  setReadStatusFilter,
  onMarkAllAsRead, 
  hasUnreadAlarms 
}) => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-neutral-700 shadow">
      <div className="flex flex-wrap items-start gap-6">
        {/* 알림 유형 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">알림 유형</label>
          <div className="flex flex-wrap gap-2">
            {ALARM_TYPES.map((type) => (
              <Button
                key={type}
                onClick={() => setAlarmType(type)}
                variant={alarmType === type ? "primary" : "default"}
                size="sm"
                className="min-w-[80px]"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* 즐겨찾기 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">즐겨찾기</label>
          <div className="flex flex-wrap gap-2">
            {['전체', '즐겨찾기'].map((status) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "primary" : "default"}
                size="sm"
                className="min-w-[80px]"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* 읽음 상태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">읽음 상태</label>
          <div className="flex flex-wrap gap-2">
            {READ_STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                onClick={() => setReadStatusFilter(status)}
                variant={readStatusFilter === status ? "primary" : "default"}
                size="sm"
                className="min-w-[80px]"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* 전체 읽음 버튼 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">액션</label>
          <Button
            onClick={onMarkAllAsRead}
            variant={hasUnreadAlarms ? "primary" : "default"}
            size="sm"
            disabled={!hasUnreadAlarms}
            icon={<CheckCircle className="w-4 h-4" />}
            className="min-w-[120px]"
          >
            전체 읽음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlarmFilters;
