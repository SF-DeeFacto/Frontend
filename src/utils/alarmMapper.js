import { 
  transformNotificationData, 
  stripHtmlTags,
  getRelativeTime,
  removeTimeAndSensorFromTitle,
  extractZoneName
} from './notificationUtils';

/**
 * 개별 알림을 프론트엔드 형식으로 변환
 */
export const mapNotificationToAlarm = (notification) => {
  // 새로운 유틸리티 함수로 데이터 변환
  const transformed = transformNotificationData(notification);
  
  return {
    id: notification.notiId,
    type: notification.notiType === 'ALERT' ? '알림' : notification.notiType,
    status: notification.readStatus ? '읽음' : '안읽음',
    isFavorite: notification.flagStatus || false,
    isRead: notification.readStatus || false,
    readStatus: notification.readStatus || false, // readStatus 필드 추가
    flagStatus: notification.flagStatus || false, // flagStatus 필드 추가
    notiType: notification.notiType, // notiType 필드 추가
    message: transformed.cleanTitle, // 시간 제거된 제목
    time: transformed.relativeTime, // 한국 시간 기준 상대 시간
    zone: transformed.zoneName.toUpperCase(), // 추출된 구역명
    // 새로운 필드들 추가
    title: transformed.cleanTitle,
    content: transformed.contentAfterBr,
    timestamp: notification.timestamp,
    zoneId: transformed.zoneName.toLowerCase(),
    readTime: notification.readTime,
    // 추가 변환된 데이터
    sensorName: transformed.sensorName,
    koreaTime: transformed.koreaTime
  };
};

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
      ? { ...alarm, isRead, status: isRead ? '읽음' : '안읽음', readStatus: isRead }
      : alarm
  );
};

/**
 * 알림 즐겨찾기 상태 업데이트
 */
export const updateAlarmFavoriteStatus = (alarms, alarmId, isFavorite) => {
  return alarms.map(alarm => 
    alarm.id === alarmId 
      ? { ...alarm, isFavorite, flagStatus: isFavorite }
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
      : { ...alarm, isRead: true, status: '읽음', readStatus: true }
  );
};
