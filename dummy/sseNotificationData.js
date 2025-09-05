/**
 * 알림 SSE API (/api/noti/sse/subscribe) 더미 데이터
 * 실시간 알림 및 경고 메시지를 반환하는 SSE 데이터
 */

// 알림 타입 상수
const NOTIFICATION_TYPES = {
  ALERT: 'ALERT',
  WARNING: 'WARNING',
  INFO: 'INFO',
  CRITICAL: 'CRITICAL'
};

// 알림 상태 상수
const NOTIFICATION_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  ARCHIVED: 'ARCHIVED'
};

// 알림 우선순위 상수
const NOTIFICATION_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// 알림 메시지 템플릿
const ALERT_MESSAGES = {
  TEMPERATURE: [
    '온도 센서 이상 감지',
    '온도 임계값 초과',
    '온도 센서 연결 불안정'
  ],
  HUMIDITY: [
    '습도 센서 이상 감지',
    '습도 임계값 초과',
    '습도 센서 오류'
  ],
  WIND_DIRECTION: [
    '풍향 센서 이상 감지',
    '풍향 센서 연결 끊김',
    '풍향 센서 오류'
  ],
  STATIC_ELECTRICITY: [
    '정전기 센서 이상 감지',
    '정전기 임계값 초과',
    '정전기 센서 오류'
  ],
  PARTICLE: [
    '파티클 센서 이상 감지',
    '파티클 농도 임계값 초과',
    '파티클 센서 오류'
  ],
  SYSTEM: [
    '시스템 연결 불안정',
    '데이터베이스 연결 오류',
    '네트워크 연결 끊김',
    '서버 과부하 경고'
  ]
};

// Zone 정보
const ZONES = ['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'];

// 알림 생성 함수
const generateNotification = (type, zoneId, sensorType = null) => {
  const notiId = `noti_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  let title = '';
  let message = '';
  let priority = NOTIFICATION_PRIORITY.MEDIUM;
  
  if (sensorType && ALERT_MESSAGES[sensorType]) {
    const messages = ALERT_MESSAGES[sensorType];
    title = messages[Math.floor(Math.random() * messages.length)];
    message = `${zoneId} Zone에서 ${title}`;
    
    // 센서 타입별 우선순위 설정
    if (sensorType === 'SYSTEM') {
      priority = NOTIFICATION_PRIORITY.HIGH;
    } else if (sensorType === 'PARTICLE' || sensorType === 'STATIC_ELECTRICITY') {
      priority = NOTIFICATION_PRIORITY.URGENT;
    }
  } else {
    const systemMessages = ALERT_MESSAGES.SYSTEM;
    title = systemMessages[Math.floor(Math.random() * systemMessages.length)];
    message = title;
    priority = NOTIFICATION_PRIORITY.HIGH;
  }
  
  return {
    notiId: notiId,
    notiType: type,
    title: title,
    message: message,
    zoneId: zoneId,
    priority: priority,
    readStatus: false,
    flagStatus: false,
    timestamp: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

// 일반 알림 SSE 데이터 생성
export const generateNotificationSSEData = () => {
  const notifications = [];
  
  // 1-3개의 랜덤 알림 생성
  const notificationCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < notificationCount; i++) {
    const zoneId = ZONES[Math.floor(Math.random() * ZONES.length)];
    const types = Object.values(NOTIFICATION_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    
    notifications.push(generateNotification(type, zoneId));
  }
  
  return {
    code: 'SUCCESS',
    message: 'Notifications retrieved successfully',
    timestamp: new Date().toISOString(),
    data: notifications
  };
};

// 경고 알림 SSE 데이터 생성 (alert 이벤트용) - 실제 API 형식에 맞춤
export const generateAlertSSEData = () => {
  const zoneId = `zone_${String.fromCharCode(97 + Math.floor(Math.random() * 8))}`; // zone_a ~ zone_h
  const sensorTypes = ['temperature', 'humidity', 'winddirection', 'electrostatic', 'particle'];
  const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
  const sensorId = `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`;
  const value = (Math.random() * 50 + 20).toFixed(2);
  const timestamp = new Date().toISOString();
  const notiId = Math.floor(Math.random() * 1000) + 1;
  
  return {
    id: `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`,
    event: 'alert',
    data: {
      notiId: notiId,
      notiType: 'ALERT',
      zoneId: zoneId,
      title: `[${new Date().toLocaleString()}] ${sensorId} 센서 이상치 초과 알림`,
      content: `현재시간 ${new Date().toLocaleString()}<br>${zoneId} 구역 ${sensorType} 타입 센서 ${sensorId}에서 값 ${value}°C가 정상 범위를 초과했습니다.`,
      timestamp: timestamp
    }
  };
};

// 실시간 알림 업데이트 생성
export const generateNotificationUpdate = () => {
  const zoneId = ZONES[Math.floor(Math.random() * ZONES.length)];
  const sensorTypes = ['TEMPERATURE', 'HUMIDITY', 'WIND_DIRECTION', 'STATIC_ELECTRICITY', 'PARTICLE'];
  const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
  
  const notification = generateNotification(NOTIFICATION_TYPES.WARNING, zoneId, sensorType);
  
  return {
    code: 'SUCCESS',
    message: 'Notification updated',
    timestamp: new Date().toISOString(),
    data: [notification]
  };
};

// 특정 Zone의 알림 생성
export const generateZoneNotification = (zoneId) => {
  const sensorTypes = ['TEMPERATURE', 'HUMIDITY', 'WIND_DIRECTION', 'STATIC_ELECTRICITY', 'PARTICLE'];
  const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
  const types = Object.values(NOTIFICATION_TYPES);
  const type = types[Math.floor(Math.random() * types.length)];
  
  return generateNotification(type, zoneId, sensorType);
};

// 알림 읽음 처리 데이터
export const generateReadNotificationData = (notiId) => {
  return {
    code: 'SUCCESS',
    message: 'Notification marked as read',
    timestamp: new Date().toISOString(),
    data: {
      notiId: notiId,
      readStatus: true,
      updatedAt: new Date().toISOString()
    }
  };
};

// 알림 삭제 데이터
export const generateDeleteNotificationData = (notiId) => {
  return {
    code: 'SUCCESS',
    message: 'Notification deleted',
    timestamp: new Date().toISOString(),
    data: {
      notiId: notiId,
      deleted: true,
      deletedAt: new Date().toISOString()
    }
  };
};

// 알림 카운터 데이터 (실제 API 형식에 맞춤)
export const generateNotificationStats = () => {
  return {
    code: 'SUCCESS',
    message: '안읽은 알림 개수 조회 성공',
    data: Math.floor(Math.random() * 200) + 50 // 50-250 사이의 랜덤 값
  };
};

// SSE 연결 상태 데이터
export const generateSSEConnectionData = () => {
  return {
    code: 'SUCCESS',
    message: 'SSE connection established',
    timestamp: new Date().toISOString(),
    connectionId: `conn_${Date.now()}`,
    heartbeatInterval: 30000,
    maxReconnectAttempts: 5
  };
};

export default {
  generateNotificationSSEData,
  generateAlertSSEData,
  generateNotificationUpdate,
  generateZoneNotification,
  generateReadNotificationData,
  generateDeleteNotificationData,
  generateNotificationStats,
  generateSSEConnectionData,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_PRIORITY,
  ZONES
};
