/**
 * 알림 API 모킹 서버
 * 실제 API 응답 형식에 맞춤
 */

// 알림 타입 상수
const NOTIFICATION_TYPES = {
  ALERT: 'ALERT',
  WARNING: 'WARNING',
  INFO: 'INFO',
  CRITICAL: 'CRITICAL'
};

// Zone 정보
const ZONES = ['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'];

// 센서 타입
const SENSOR_TYPES = ['temperature', 'humidity', 'winddirection', 'electrostatic', 'particle'];

// 알림 메시지 템플릿
const ALERT_MESSAGES = {
  temperature: [
    '온도 센서 이상 감지',
    '온도 임계값 초과',
    '온도 센서 연결 불안정'
  ],
  humidity: [
    '습도 센서 이상 감지',
    '습도 임계값 초과',
    '습도 센서 오류'
  ],
  winddirection: [
    '풍향 센서 이상 감지',
    '풍향 센서 연결 끊김',
    '풍향 센서 오류'
  ],
  electrostatic: [
    '정전기 센서 이상 감지',
    '정전기 임계값 초과',
    '정전기 센서 오류'
  ],
  particle: [
    '파티클 센서 이상 감지',
    '파티클 농도 임계값 초과',
    '파티클 센서 오류'
  ]
};

// 알림 생성 함수
const generateNotification = (id) => {
  const zoneId = ZONES[Math.floor(Math.random() * ZONES.length)];
  const types = Object.values(NOTIFICATION_TYPES);
  const type = types[Math.floor(Math.random() * types.length)];
  const sensorType = SENSOR_TYPES[Math.floor(Math.random() * SENSOR_TYPES.length)];
  const messages = ALERT_MESSAGES[sensorType];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const timestamp = new Date().toISOString();
  
  return {
    notiId: id,
    notiType: type,
    title: `[${new Date().toLocaleString()}] ${zoneId} ${message}`,
    message: `${zoneId} Zone에서 ${message}`,
    zoneId: zoneId,
    sensorType: sensorType,
    priority: type === 'ALERT' ? 'HIGH' : 'MEDIUM',
    readStatus: Math.random() < 0.3, // 30% 확률로 읽음
    flagStatus: Math.random() < 0.1, // 10% 확률로 중요 표시
    timestamp: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

// 알림 리스트 생성 함수 (실제 API 형식에 맞춤)
export const generateNotificationList = (page = 0, size = 10, isRead = null, isFlagged = null) => {
  const totalElements = Math.floor(Math.random() * 50) + 20; // 20-70개
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = Math.min(startIndex + size, totalElements);
  
  // 알림 생성
  const notifications = [];
  for (let i = startIndex; i < endIndex; i++) {
    const notification = generateNotification(i + 1);
    
    // 필터링 적용
    if (isRead !== null && notification.readStatus !== isRead) {
      continue;
    }
    if (isFlagged !== null && notification.flagStatus !== isFlagged) {
      continue;
    }
    
    notifications.push(notification);
  }
  
  return {
    code: 'SUCCESS',
    message: '알림 리스트 조회 성공',
    data: {
      content: notifications,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true
        },
        offset: startIndex,
        paged: true,
        unpaged: false
      },
      last: page >= totalPages - 1,
      totalElements: totalElements,
      totalPages: totalPages,
      size: size,
      number: page,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      },
      first: page === 0,
      numberOfElements: notifications.length,
      empty: notifications.length === 0
    }
  };
};

// 알림 카운터 생성 함수 (실제 API 형식에 맞춤)
export const generateNotificationCount = () => {
  return {
    code: 'SUCCESS',
    message: '안읽은 알림 개수 조회 성공',
    data: Math.floor(Math.random() * 200) + 50 // 50-250 사이의 랜덤 값
  };
};

// API 모킹 서버 초기화
export const initNotificationApiMock = () => {
  if (typeof window === 'undefined') return;
  
  console.log('🔔 알림 API 모킹 서버 초기화');
  
  // fetch와 XMLHttpRequest 모두 가로채기
  const originalFetch = window.fetch;
  const originalXHR = window.XMLHttpRequest;
  
  // fetch 모킹
  window.fetch = async (url, options = {}) => {
    const urlObj = new URL(url, window.location.origin);
    
    if (urlObj.pathname === '/api/noti/list' || urlObj.pathname === '/noti/list') {
      console.log('🔔 알림 리스트 API 모킹 (fetch):', urlObj.search);
      const params = new URLSearchParams(urlObj.search);
      const page = parseInt(params.get('page') || '0');
      const size = parseInt(params.get('size') || '10');
      const response = generateNotificationList(page, size);
      return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (urlObj.pathname === '/api/noti/count' || urlObj.pathname === '/noti/count') {
      console.log('🔔 알림 카운터 API 모킹 (fetch)');
      const response = generateNotificationCount();
      return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return originalFetch(url, options);
  };
  
  // XMLHttpRequest 모킹
  window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    
    xhr.open = function(method, url, ...args) {
      this._url = url;
      return originalOpen.apply(this, [method, url, ...args]);
    };
    
    xhr.send = function(data) {
      const urlObj = new URL(this._url, window.location.origin);
      
      if (urlObj.pathname === '/api/noti/list' || urlObj.pathname === '/noti/list') {
        console.log('🔔 알림 리스트 API 모킹 (XHR):', urlObj.search);
        const params = new URLSearchParams(urlObj.search);
        const page = parseInt(params.get('page') || '0');
        const size = parseInt(params.get('size') || '10');
        const response = generateNotificationList(page, size);
        
        setTimeout(() => {
          Object.defineProperty(this, 'status', { value: 200 });
          Object.defineProperty(this, 'readyState', { value: 4 });
          Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });
          if (this.onreadystatechange) this.onreadystatechange();
        }, 50);
        return;
      }
      
      if (urlObj.pathname === '/api/noti/count' || urlObj.pathname === '/noti/count') {
        console.log('🔔 알림 카운터 API 모킹 (XHR)');
        const response = generateNotificationCount();
        
        setTimeout(() => {
          Object.defineProperty(this, 'status', { value: 200 });
          Object.defineProperty(this, 'readyState', { value: 4 });
          Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });
          if (this.onreadystatechange) this.onreadystatechange();
        }, 50);
        return;
      }
      
      return originalSend.apply(this, [data]);
    };
    
    return xhr;
  };
  
  console.log('✅ 알림 API 모킹 서버 활성화 완료');
};
