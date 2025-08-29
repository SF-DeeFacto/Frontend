# 더미데이터 구조 (API 연동 준비용)

이 디렉토리는 실제 API 연동 전까지 사용할 더미데이터와 서비스들을 포함합니다.

## 디렉토리 구조

```
src/dummy/
├── index.js                  # 통합 export (API 연동 시 제거 예정)
├── data/                     # 더미 데이터들
│   ├── userGenerator.js      # 사용자 데이터 생성기
│   ├── reports.js            # 리포트 데이터
│   └── weatherGenerator.js   # 날씨 데이터 생성기
├── services/                 # 더미 서비스들
│   └── index.js              # 서비스 통합 export
└── README.md                 # 이 파일
```

## 현재 사용 중인 더미데이터

### 1. 사용자 관련 (users.js/userGenerator.js)
- **사용 위치**: `src/pages/Login.jsx`
- **용도**: 로그인 인증용 더미 사용자 데이터
- **API 연동 시**: 실제 인증 API로 교체 예정

### 2. 날씨 관련 (weather.js/weatherGenerator.js)
- **사용 위치**: `src/components/layout/Header.jsx`
- **용도**: 헤더의 날씨 정보 표시
- **API 연동 시**: `src/dummy/services/weather.js`가 실제 API 호출로 전환

### 3. Zone 데이터 ✅ 제거됨
- **상태**: 더미 데이터 제거 완료, 실제 API 연동 완료
- **구현**: 모든 존(A01, A02, B01, B02, B03, B04, C01, C02)에 대해 실제 API 사용

### 4. Zone 상태 ✅ 제거됨
- **상태**: 더미 데이터 제거 완료, 실제 API 연동 완료
- **구현**: 모든 존에 대해 실제 Zone 상태 API 사용

## API 연동 시 제거 대상

### ~~1. 리포트 데이터 (reports.js)~~ ✅ 이미 제거됨
- ~~**사용 위치**: `src/pages/Report.jsx` (주석 처리됨)~~
- ~~**상태**: 사용되지 않아 삭제 완료~~

## 더미 서비스 설명

### 1. user.js - 더미 인증 서비스
```javascript
// 더미 로그인
handleDummyLogin(credentials)

// 더미 로그아웃
handleDummyLogout()

// 더미 토큰 검증
validateDummyToken()
```

### 2. weather.js - 날씨 API 폴백 서비스
```javascript
// 실제 API 호출 + 폴백
fetchWeatherData()

// 날씨 트렌드 데이터
getWeatherTrend(hours)

// 특정 날짜 날씨
getWeatherForDate(date)
```

## API 연동 준비 체크리스트

### 1. 인증 API 연동
- [ ] `src/services/api/auth.js` 실제 API 호출 구현
- [ ] `src/pages/Login.jsx`에서 더미 사용자 데이터 제거
- [ ] JWT 토큰 처리 로직 구현

### 2. 날씨 API 연동
- [ ] `src/dummy/services/weather.js`의 API 엔드포인트 확정
- [ ] 실제 날씨 데이터 스키마 확인 후 적용

### 3. Zone 데이터 API 연동 ✅ 완료
- [x] 더미 데이터 제거
- [x] 실제 센서 데이터 API 엔드포인트 확정 (`/home/zone?zoneId={zoneId}`)
- [x] `src/hooks/useZoneSensorData.js` 실제 API 호출로 변경
- [x] 실시간 데이터 업데이트 (SSE) 구현

### 4. Zone 상태 API 연동 ✅ 완료
- [x] 더미 데이터 제거
- [x] Zone 상태 관리 API 엔드포인트 확정
- [x] `src/hooks/useZoneManager.js` 실제 API 호출로 변경

### 5. 더미데이터 정리
- [ ] API 연동 완료 후 `src/dummy/` 디렉토리 전체 제거
- [ ] 관련 import 문들 정리
- [ ] 테스트 및 빌드 확인

## 데이터 생성기 활용

더미데이터 생성기들은 개발 및 테스트 시 유용합니다:

```javascript
// 사용자 데이터 생성
import { generateDummyUsers } from './dummy';
const users = generateDummyUsers(50); // 50명의 더미 사용자

// Zone 데이터 생성
import { generateZoneData } from './dummy';
const zoneData = generateZoneData('B01', 100); // B01 Zone의 100개 데이터

// 날씨 트렌드 생성
import { generateWeatherTrend } from './dummy';
const trend = generateWeatherTrend(24); // 24시간 날씨 트렌드
```

## 주의사항

1. **개발 전용**: 이 더미데이터들은 개발 및 테스트 목적으로만 사용
2. **프로덕션 제외**: 실제 배포 시에는 모든 더미데이터 제거 필요
3. **일관성 유지**: API 연동 시 데이터 스키마 일관성 확인 필요
4. **성능 고려**: 더미데이터 생성기는 메모리 사용량에 주의
