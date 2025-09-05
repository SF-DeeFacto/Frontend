import { convertMessageTime, getRelativeTime } from './dateUtils';

/**
 * 개별 알림을 프론트엔드 형식으로 변환
 */
export const mapNotificationToAlarm = (notification) => ({
  id: notification.notiId,
  type: notification.notiType === 'ALERT' ? '알림' : notification.notiType,
  status: notification.readStatus ? '읽음' : '안읽음',
  isFavorite: notification.flagStatus || false, // SSE 데이터에는 없을 수 있으므로 기본값 설정
  isRead: notification.readStatus || false, // SSE 데이터에는 없을 수 있으므로 기본값 설정
  message: convertMessageTime(notification.title, notification.timestamp),
  time: getRelativeTime(notification.timestamp),
  zone: notification.zoneId.toUpperCase()
});

/**
 * 알림 목록 API 응답을 프론트엔드 형식으로 변환
 */
export const mapAlarmList = (response) => {
  if (!response || !response.content || !Array.isArray(response.content)) {
    return {
      alarms: [],
      totalPages: 0,
      totalElements: 0
    };
  }

  return {
    alarms: response.content.map(mapNotificationToAlarm),
    totalPages: response.totalPages || 0,
    totalElements: response.totalElements || 0
  };
};

/**
 * 알림 상태 업데이트 (읽음 처리)
 */
export const updateAlarmReadStatus = (alarms, alarmId, isRead) => {
  return alarms.map(alarm => 
    alarm.id === alarmId 
      ? { ...alarm, isRead, status: isRead ? '읽음' : '안읽음' }
      : alarm
  );
};

/**
 * 알림 즐겨찾기 상태 업데이트
 */
export const updateAlarmFavoriteStatus = (alarms, alarmId, isFavorite) => {
  return alarms.map(alarm => 
    alarm.id === alarmId 
      ? { ...alarm, isFavorite }
      : alarm
  );
};

/**
 * 모든 알림을 읽음 상태로 업데이트
 */
export const updateAllAlarmsAsRead = (alarms) => {
  return alarms.map(alarm => 
    alarm.isRead 
      ? alarm 
      : { ...alarm, isRead: true, status: '읽음' }
  );
};
