import React from 'react';
import { FiClock, FiBookmark, FiCheck, FiCheckCircle } from 'react-icons/fi';
import Text from '../common/Text';
import Icon from '../common/Icon';

// 유틸리티 함수들
const getStatusColor = (status) => {
  const colorMap = {
    '안읽음': 'bg-orange-100 text-orange-600',
    '읽음': 'bg-gray-100 text-gray-600'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-600';
};

const getTypeColor = (type) => {
  const colorMap = {
    '알림': 'bg-blue-100 text-blue-600',
    '리포트': 'bg-green-100 text-green-600'
  };
  return colorMap[type] || 'bg-gray-100 text-gray-600';
};

// 알림 카드 컴포넌트
const AlarmCard = React.memo(({ alarm, onMarkAsRead, onToggleFavorite }) => (
  <div
    className={`bg-white rounded-lg p-4 shadow-sm transition-all hover:shadow-md ${
      alarm.isRead ? '' : 'border-l-4 border-l-orange-500'
    }`}
  >
    <div className="flex items-start justify-between">
      {/* 왼쪽: 태그들과 메시지 */}
      <div className="flex-1 space-y-3">
        {/* 태그들 */}
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(alarm.type)}`}>
            {alarm.type}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alarm.status)}`}>
            {alarm.status}
          </span>
          {alarm.isFavorite && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-600">
              즐겨찾기
            </span>
          )}
        </div>

        {/* 메시지 */}
        <div>
          <Text variant="body" size="md" weight="semibold" color="gray-800">
            {alarm.message}
          </Text>
          <Text variant="caption" size="sm" color="gray-500" className="mt-1">
            Zone: {alarm.zone}
          </Text>
        </div>
      </div>

      {/* 오른쪽: 액션 버튼들 */}
      <div className="flex items-center gap-3 ml-4">
        {/* 시간 */}
        <div className="flex items-center gap-1 text-gray-500">
          <Icon size="16px">
            <FiClock />
          </Icon>
          <Text variant="caption" size="sm" color="gray-500">
            {alarm.time}
          </Text>
        </div>

        {/* 즐겨찾기 버튼 */}
        <button
          onClick={() => onToggleFavorite(alarm.id)}
          className={`p-2 rounded-lg transition-colors ${
            alarm.isFavorite
              ? 'text-yellow-500 hover:bg-yellow-50'
              : 'text-gray-400 hover:bg-gray-50 hover:text-yellow-500'
          }`}
        >
          <Icon size="16px">
            <FiBookmark />
          </Icon>
        </button>

        {/* 읽음 상태 버튼 - 읽음 처리만 가능 */}
        {!alarm.isRead && (
          <button
            onClick={() => onMarkAsRead(alarm.id)}
            className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-50 hover:text-green-500"
            title="읽음 처리"
          >
            <Icon size="16px">
              <FiCheck />
            </Icon>
          </button>
        )}
        
        {/* 이미 읽은 알림은 체크 표시만 */}
        {alarm.isRead && (
          <div className="p-2 text-green-500">
            <Icon size="16px">
              <FiCheckCircle />
            </Icon>
          </div>
        )}
      </div>
    </div>
  </div>
));

export default AlarmCard;
