import React from 'react';
import { Clock, Bookmark, Check, CheckCircle } from 'lucide-react';
import Text from '../common/Text';
import Icon from '../common/Icon';
import Button from '../common/Button';
import { stripHtmlTags } from '../../utils/notificationUtils';

// 유틸리티 함수들
const getStatusColor = (status) => {
  const colorMap = {
    '안읽음': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    '읽음': 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300'
  };
  return colorMap[status] || 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300';
};

const getTypeColor = (type) => {
  const colorMap = {
    '알림': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    '리포트': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  };
  return colorMap[type] || 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300';
};

// HTML 태그 제거 함수는 notificationUtils에서 import

// 알림 카드 컴포넌트 - 모던 디자인 적용
const AlarmCard = React.memo(({ alarm, onMarkAsRead, onToggleFavorite }) => (
  <div
    className={`notification-card group relative overflow-hidden ${
      alarm.isRead ? 'read' : 'unread'
    }`}
  >
    {/* 배경 그라디언트 */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative z-10 flex items-start justify-between">
      {/* 왼쪽: 태그들과 메시지 */}
      <div className="flex-1 space-y-3 pr-4">
        {/* 태그들 */}
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-soft ${getTypeColor(alarm.type)}`}>
            {alarm.type}
          </span>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-soft ${getStatusColor(alarm.status)}`}>
            {alarm.status}
          </span>
          {alarm.isFavorite && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-warning-100 to-warning-200 dark:from-warning-900/30 dark:to-warning-800/30 text-warning-700 dark:text-warning-400 shadow-soft">
              ⭐ 즐겨찾기
            </span>
          )}
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <div>
            {/* 모바일/태블릿: 줄바꿈, 데스크톱: 한줄 */}
            <div className="block lg:hidden">
              <Text variant="body" size="md" weight="semibold" color="secondary-800" className="leading-relaxed">
                {alarm.title || alarm.message}
              </Text>
              {alarm.content && (
                <Text variant="body" size="sm" color="secondary-600" className="leading-relaxed whitespace-pre-line mt-1 block">
                  {stripHtmlTags(alarm.content)}
                </Text>
              )}
            </div>
            {/* 데스크톱: 한줄로 표시 */}
            <div className="hidden lg:block">
              <Text variant="body" size="md" weight="semibold" color="secondary-800" className="leading-relaxed">
                {alarm.title || alarm.message}
                {alarm.content && (
                  <span className="text-sm font-normal text-secondary-600 ml-2">
                    : {stripHtmlTags(alarm.content)}
                  </span>
                )}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-main rounded-full"></div>
            <Text variant="caption" size="sm" color="secondary-500" className="font-medium">
              {alarm.zone || alarm.zoneId?.toUpperCase()}
              {alarm.sensorName && (
                <span className="ml-2">| {alarm.sensorName}</span>
              )}
            </Text>
          </div>
        </div>
      </div>

      {/* 오른쪽: 액션 버튼들 */}
      <div className="flex items-center gap-2 ml-3">
        {/* 시간 */}
        <div className="flex items-center gap-1.5 bg-secondary-50 dark:bg-neutral-700 rounded-xl px-2.5 py-1.5 shadow-soft transition-colors duration-300">
          <Icon className="text-secondary-500 dark:text-neutral-400">
            <Clock />
          </Icon>
          <Text variant="caption" size="xs" color="secondary-600" className="font-medium dark:text-neutral-300">
            {alarm.time}
          </Text>
        </div>

        {/* 즐겨찾기 버튼 */}
        <Button
          onClick={() => onToggleFavorite(alarm.id)}
          variant="ghost"
          size="sm"
          icon={
            <Icon>
              <Bookmark />
            </Icon>
          }
          className={`p-2 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium hover:scale-105 ${
            alarm.isFavorite
              ? 'bg-gradient-to-r from-warning-500 to-warning-600 text-white'
              : 'bg-white/80 dark:bg-neutral-700/80 text-secondary-400 dark:text-neutral-400 hover:bg-warning-50 dark:hover:bg-warning-900/30 hover:text-warning-500'
          }`}
          title={alarm.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        />

        {/* 읽음 상태 버튼 - 읽음 처리만 가능 */}
        {!alarm.isRead && (
          <Button
            onClick={() => onMarkAsRead(alarm.id)}
            variant="ghost"
            size="sm"
            icon={
              <Icon>
                <Check />
              </Icon>
            }
            className="p-2 rounded-xl transition-all duration-200 bg-white/80 dark:bg-neutral-700/80 text-secondary-400 dark:text-neutral-400 hover:bg-success-50 dark:hover:bg-success-900/30 hover:text-success-500 shadow-soft hover:shadow-medium hover:scale-105"
            title="읽음 처리"
          />
        )}

        {/* 이미 읽은 알림은 체크 표시만 */}
        {alarm.isRead && (
          <div className="p-2 bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 rounded-xl shadow-soft transition-colors duration-300">
            <Icon>
              <CheckCircle />
            </Icon>
          </div>
        )}
      </div>
    </div>
  </div>
));

export default AlarmCard;