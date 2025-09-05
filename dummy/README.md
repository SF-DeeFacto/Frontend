# SSE API 더미 데이터

이 폴더는 SSE (Server-Sent Events) API의 더미 데이터를 제공합니다. 실제 백엔드 서버 없이도 프론트엔드 개발과 테스트를 진행할 수 있습니다.

## 📁 파일 구조

```
dummy/
├── README.md                 # 이 파일
├── sseMainData.js           # 메인 SSE 데이터 (/dashboard-api/home/status)
├── sseZoneData.js           # Zone별 SSE 데이터 (/dashboard-api/home/zone)
├── sseNotificationData.js   # 알림 SSE 데이터 (/api/noti/sse/subscribe)
├── sensorDataDummy.js       # 센서 데이터 생성기
└── sseDummyData.js          # 통합 더미 데이터 및 서버
```

## 🚀 사용법

### 1. 기본 더미 데이터 사용

```javascript
import { createDummyData } from './dummy/sseDummyData.js';

// 메인 대시보드 데이터
const mainData = createDummyData.main();
console.log(mainData);

// 특정 Zone 데이터
const zoneData = createDummyData.zone('A01');
console.log(zoneData);

// 알림 데이터
const notificationData = createDummyData.notification();
console.log(notificationData);
```

### 2. SSE 모킹 서버 사용 (권장)

```javascript
import { initSSEMockServer } from './dummy/sseMockServer.js';
import { useMainSSEMock, useZoneSSEMock, useNotificationSSEMock } from './dummy/useSSEMock.js';

// 앱 시작 시 모킹 서버 초기화
initSSEMockServer();

// React 컴포넌트에서 사용
function MyComponent() {
  const { isConnected, lastMessage, error } = useMainSSEMock({
    onMessage: (data) => console.log('데이터 수신:', data),
    onError: (error) => console.error('오류:', error),
    onOpen: () => console.log('연결됨')
  });

  return (
    <div>
      {isConnected ? '연결됨' : '연결 끊김'}
      {lastMessage && <pre>{JSON.stringify(lastMessage, null, 2)}</pre>}
    </div>
  );
}
```

### 3. 기존 SSE 코드와 호환

```javascript
// 기존 코드를 그대로 사용할 수 있습니다!
import { connectMainSSE, connectZoneSSE, connectNotificationSSE } from '../src/services/sse.js';

// 모킹 서버가 활성화되면 자동으로 모킹 데이터를 사용합니다
const disconnect = connectMainSSE({
  onMessage: (data) => console.log('실시간 데이터:', data),
  onError: (error) => console.error('SSE 오류:', error)
});
```

### 3. 개별 센서 데이터 생성

```javascript
import { generateZoneSensorData, generateSensorHistory } from './dummy/sensorDataDummy.js';

// Zone별 센서 데이터 생성
const sensors = generateZoneSensorData('A01', {
  temperature: 3,
  humidity: 2,
  particle: 2
});

// 센서 히스토리 생성 (24시간)
const history = generateSensorHistory('temperature', 'temp_A01_01', 'A01', 24);
```

## 📊 데이터 구조

### 메인 SSE 데이터 (`/dashboard-api/home/status`)

```javascript
{
  code: 'SUCCESS',
  message: 'Zone status retrieved successfully',
  timestamp: '2024-01-01T00:00:00.000Z',
  data: [
    {
      zoneName: 'A01',
      status: 'NORMAL',
      lastUpdate: '2024-01-01T00:00:00.000Z',
      sensorCount: 12,
      alertCount: 0
    }
    // ... 다른 Zone들
  ]
}
```

### Zone SSE 데이터 (`/dashboard-api/home/zone?zoneId=A01`)

```javascript
{
  code: 'SUCCESS',
  message: 'Zone A01 sensor data retrieved successfully',
  timestamp: '2024-01-01T00:00:00.000Z',
  data: [
    {
      timestamp: '2024-01-01T00:00:00.000Z',
      zoneId: 'A01',
      zoneName: 'Zone A01',
      sensors: [
        {
          sensorId: 'temperature_A01_01',
          sensorType: 'temperature',
          sensorStatus: 'NORMAL',
          timestamp: '2024-01-01T00:00:00.000Z',
          values: {
            value: 22.5,
            unit: '°C'
          }
        }
        // ... 다른 센서들
      ]
    }
  ]
}
```

### 알림 SSE 데이터 (`/api/noti/sse/subscribe`)

```javascript
{
  code: 'SUCCESS',
  message: 'Notifications retrieved successfully',
  timestamp: '2024-01-01T00:00:00.000Z',
  data: [
    {
      notiId: 'noti_1234567890_abc123',
      notiType: 'ALERT',
      title: '온도 센서 이상 감지',
      message: 'A01 Zone에서 온도 센서 이상 감지',
      zoneId: 'A01',
      priority: 'URGENT',
      readStatus: false,
      flagStatus: false,
      timestamp: '2024-01-01T00:00:00.000Z'
    }
    // ... 다른 알림들
  ]
}
```

## 🔧 센서 타입

### 지원하는 센서 타입

- **temperature** (온도): 20-30°C 범위
- **humidity** (습도): 40-60% 범위  
- **windDirection** (풍향): 0-360° 범위
- **staticElectricity** (정전기): 100-500V 범위
- **particle** (파티클): 0.1μm, 0.3μm, 0.5μm 크기별 측정

### 센서 상태

- **NORMAL**: 정상 범위
- **WARNING**: 경고 범위
- **CRITICAL**: 위험 범위
- **OFFLINE**: 연결 끊김

## 🎯 Zone 정보

### 지원하는 Zone

- **A01, A02**: A구역
- **B01, B02, B03, B04**: B구역  
- **C01, C02**: C구역

## 🧪 테스트 실행

```javascript
import { runTests } from './dummy/sseDummyData.js';

// 모든 더미 데이터 테스트 실행
runTests();
```

## ⚙️ 설정 옵션

### 센서 데이터 생성 옵션

```javascript
// Zone별 센서 개수 설정
const sensors = generateZoneSensorData('A01', {
  temperature: 3,    // 온도 센서 3개
  humidity: 2,       // 습도 센서 2개
  particle: 2        // 파티클 센서 2개
});
```

### SSE 업데이트 간격 설정

```javascript
// 메인 SSE: 10초마다 업데이트
dummyServer.startMainSSE(connectionId, 10000);

// Zone SSE: 15초마다 업데이트  
dummyServer.startZoneSSE(connectionId, 'A01', 15000);

// 알림 SSE: 20초마다 업데이트
dummyServer.startNotificationSSE(connectionId, 20000);
```

## 🔄 실시간 시뮬레이션

더미 서버는 다음과 같은 실시간 시뮬레이션을 제공합니다:

- **메인 SSE**: 80% 확률로 정상 데이터, 20% 확률로 상태 변경
- **Zone SSE**: 70% 확률로 정상 데이터, 30% 확률로 센서 값 변경
- **알림 SSE**: 60% 확률로 일반 알림, 20% 확률로 경고 알림, 20% 확률로 업데이트

## 🚨 주의사항

1. **메모리 관리**: 더미 서버 사용 후 `cleanup()` 메서드를 호출하여 리소스를 정리하세요.
2. **연결 해제**: 컴포넌트 언마운트 시 반드시 SSE 연결을 해제하세요.
3. **데이터 일관성**: 실제 백엔드와 데이터 구조가 다를 수 있으니 주의하세요.

## 📝 예제 코드

완전한 사용 예제는 `sseDummyData.js` 파일의 `usageExamples` 객체를 참고하세요.
