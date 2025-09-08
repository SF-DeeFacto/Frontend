import React from 'react';
import { CheckCircle } from 'lucide-react';

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
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="flex flex-wrap items-start gap-6">
        {/* 알림 유형 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">알림 유형</label>
          <div className="flex flex-wrap gap-2">
            {ALARM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setAlarmType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  alarmType === type
                    ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                    : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 즐겨찾기 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">즐겨찾기</label>
          <div className="flex flex-wrap gap-2">
            {['전체', '즐겨찾기'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === status
                    ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                    : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 읽음 상태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">읽음 상태</label>
          <div className="flex flex-wrap gap-2">
            {READ_STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setReadStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  readStatusFilter === status
                    ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                    : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 전체 읽음 버튼 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">액션</label>
          <button
            onClick={onMarkAllAsRead}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              hasUnreadAlarms 
                ? 'bg-[#494FA2] text-white hover:bg-[#3a3f8a]' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!hasUnreadAlarms}
          >
            <CheckCircle className="w-4 h-4" />
            전체 읽음
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmFilters;
