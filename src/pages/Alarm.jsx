import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiClock, FiBookmark, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { notificationApi, notificationUtils } from '../services/api/notification_api';
import Text from '../components/common/Text';
import Icon from '../components/common/Icon';

// 상수 정의
const ALARM_TYPES = ['전체', '알림', '리포트'];
const STATUS_FILTERS = ['전체', '즐겨찾기', '안읽음', '읽음'];

// 더미 알림 데이터 (실제 API 연동 시 제거)
// const DUMMY_ALARMS = [
//   {
//     id: 1,
//     type: '알림',
//     status: '안읽음',
//     isFavorite: false,
//     isRead: false,
//     message: 'Zone A 미세먼지 임계치 초과',
//     time: '7분전',
//     zone: 'A01'
//   },
//   {
//     id: 2,
//     type: '리포트',
//     status: '읽음',
//     isFavorite: true,
//     isRead: true,
//     message: '정기 리포트 생성',
//     time: '15분전',
//     zone: 'B01'
//   },
//   {
//     id: 3,
//     type: '알림',
//     status: '안읽음',
//     isFavorite: false,
//     isRead: false,
//     message: 'Zone B 온도 센서 이상 감지',
//     time: '23분전',
//     zone: 'B02'
//   },
//   {
//     id: 4,
//     type: '알림',
//     status: '읽음',
//     isFavorite: false,
//     isRead: true,
//     message: 'Zone C 습도 정상화',
//     time: '1시간전',
//     zone: 'C01'
//   },
//   {
//     id: 5,
//     type: '리포트',
//     status: '읽음',
//     isFavorite: true,
//     isRead: true,
//     message: '일일 센서 데이터 요약',
//     time: '2시간전',
//     zone: '전체'
//   },
//   {
//     id: 6,
//     type: '알림',
//     status: '안읽음',
//     isFavorite: false,
//     isRead: false,
//     message: 'Zone A 압력 센서 교체 필요',
//     time: '3시간전',
//     zone: 'A02'
//   }
// ];

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
const StatusFilterTabs = ({ statusFilter, setStatusFilter }) => (
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

// 알림 카드 컴포넌트
const AlarmCard = ({ alarm, onMarkAsRead, onMarkAsUnread, onToggleFavorite }) => (
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

        {/* 읽음 상태 버튼 */}
        <button
          onClick={() => alarm.isRead ? onMarkAsUnread(alarm.id) : onMarkAsRead(alarm.id)}
          className={`p-2 rounded-lg transition-colors ${
            alarm.isRead
              ? 'text-green-500 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-50 hover:text-green-500'
          }`}
          title={alarm.isRead ? '읽음 해제' : '읽음 처리'}
        >
          <Icon size="16px">
            {alarm.isRead ? <FiCheckCircle /> : <FiCheck />}
          </Icon>
        </button>
      </div>
    </div>
  </div>
);

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// 빈 상태 컴포넌트
const EmptyState = () => (
  <div className="text-center py-12">
    <Text variant="body" size="lg" color="gray-500">
      해당 조건의 알림이 없습니다.
    </Text>
  </div>
);

// 메인 알림 컴포넌트
const Alarm = () => {
  const [alarmType, setAlarmType] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 알림 데이터 가져오기
  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        setLoading(true);
        const response = await notificationApi.getNotifications();
        
        if (response && Array.isArray(response)) {
          // API 응답을 프론트엔드 형식에 맞게 매핑
          const mappedAlarms = response.map(notification => ({
            id: notification.notiId,
            type: notification.notiType === 'ALERT' ? '알림' : notification.notiType,
            status: notification.readStatus ? '읽음' : '안읽음',
            isFavorite: notification.flagStatus,
            isRead: notification.readStatus,
            message: notification.title,
            time: notificationUtils.formatNotificationTime(notification.timestamp),
            zone: notification.zoneId.toUpperCase()
          }));
          setAlarms(mappedAlarms);
        } else {
          setAlarms([]);
        }
      } catch (error) {
        console.log('알림 API 호출 실패:', error);
        setAlarms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, []);

  // 필터링된 알림 목록
  const filteredAlarms = alarms.filter(alarm => {
    // 알림 유형 필터 (전체 선택 시 모든 타입 표시)
    if (alarmType !== '전체' && alarm.type !== alarmType) {
      return false;
    }
    
    // 상태 필터
    if (statusFilter === '즐겨찾기' && !alarm.isFavorite) return false;
    if (statusFilter === '안읽음' && alarm.isRead) return false;
    if (statusFilter === '읽음' && !alarm.isRead) return false;
    
    return true;
  });

  // 알림 읽음 처리
  const handleMarkAsRead = (alarmId) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === alarmId 
          ? { ...alarm, isRead: true, status: '읽음' }
          : alarm
      )
    );
  };

  // 알림 읽음 해제 처리 (읽음 → 안읽음)
  const handleMarkAsUnread = (alarmId) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === alarmId 
          ? { ...alarm, isRead: false, status: '안읽음' }
          : alarm
      )
    );
  };

  // 즐겨찾기 토글
  const handleToggleFavorite = (alarmId) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === alarmId 
          ? { ...alarm, isFavorite: !alarm.isFavorite }
          : alarm
      )
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* 상단 필터 섹션 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <AlarmTypeToggle 
            alarmType={alarmType} 
            setAlarmType={setAlarmType} 
          />
          <StatusFilterTabs 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
          />
        </div>
      </div>



      {/* 알림 리스트 */}
      <div className="space-y-3">
        {filteredAlarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            alarm={alarm}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredAlarms.length === 0 && <EmptyState />}
    </div>
  );
};

export default Alarm; 