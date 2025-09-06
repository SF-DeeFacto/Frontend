# 🏭 Frontend Dashboard - 리마인드 문서

## 📋 프로젝트 개요

**프로젝트명**: Frontend Dashboard (fe-deefacto)  
**버전**: 0.0.0  
**기술 스택**: React 18 + Vite + Tailwind CSS + Three.js  
**주요 기능**: 실시간 센서 모니터링, 3D 시각화, 알림 관리, 사용자 관리

---

## 🏗️ 아키텍처 구조

### 백엔드 서비스 연동 설정

이 프로젝트는 여러 백엔드 서비스와 연동됩니다:

#### 1. UserService 백엔드 (포트 8081 → 8080)
- **용도**: 사용자 인증, 사용자 정보 관리
- **프록시 경로**: `/api`
- **환경 변수**: `VITE_API_BASE_URL`

#### 2. Dashboard 백엔드 (포트 8083 → 8080)
- **용도**: 대시보드 데이터, 실시간 모니터링
- **프록시 경로**: `/dashboard-api`
- **환경 변수**: `VITE_DASHBOARD_API_BASE_URL`

#### 3. Report Service (포트 8085)
- **용도**: 리포트 생성 및 관리
- **프록시 경로**: `/report-api`

#### 4. Grafana (포트 3000)
- **용도**: 데이터 시각화 및 모니터링
- **프록시 경로**: `/grafana-api`
- **서버**: 192.168.55.180:3000

### 프록시 설정 (vite.config.js)
```javascript
'/api' → http://localhost:8080 (UserService - API Gateway)
'/dashboard-api' → http://localhost:8080 (Dashboard Service - API Gateway)
'/report-api' → http://localhost:8085 (Report Service)
'/grafana-api' → http://192.168.55.180:3000 (Grafana)
```

---

## 📡 API 사용 예시

### UserService API (인증)
```javascript
import { login, logout, getCurrentUser } from './services/api/auth';

// 로그인
const result = await login({ username: 'employee123', password: 'password' });

// 로그아웃
await logout();

// 현재 사용자 정보
const user = getCurrentUser();
```

### Dashboard API (대시보드 데이터)
```javascript
import { dashboardApi, connectMainSSE, connectZoneSSE } from './services/api/dashboard_api';

// 일반 HTTP API
const dashboardData = await dashboardApi.getDashboardData();
const zoneData = await dashboardApi.getZoneData('zone_A01');

// SSE 실시간 연결
const disconnect = connectMainSSE({
  onMessage: (data) => {
    console.log('실시간 데이터:', data);
  },
  onError: (error) => {
    console.error('SSE 오류:', error);
  }
});

// 연결 해제
disconnect();
```

### 프록시 설정 상세
`vite.config.js`에서 프록시 설정을 통해 CORS 문제를 해결합니다:

```javascript
server: {
  proxy: {
    // UserService 백엔드
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    },
    // Dashboard 백엔드
    '/dashboard-api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/dashboard-api/, '')
    },
    // Report Service
    '/report-api': {
      target: 'http://localhost:8085',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/report-api/, '')
    },
    // Grafana
    '/grafana-api': {
      target: 'http://192.168.55.180:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/grafana-api/, '')
    }
  }
}
```

---

## 🎯 주요 기능

### 1. **3D 시각화 시스템**
- **메인 홈**: 전체 공장 3D 모델 (`mainhome.glb`)
- **Zone별 상세**: 개별 구역 3D 모델 (A01~C02)
- **실시간 상태 표시**: 센서 데이터에 따른 색상 변화
- **인터랙션**: 클릭/호버로 Zone 이동

### 2. **실시간 모니터링**
- **SSE 연결**: Server-Sent Events로 실시간 데이터 수신
- **센서 데이터**: 온도, 습도, 풍향, 정전기, 파티클
- **연결 상태 관리**: 자동 재연결, 하트비트 체크
- **Zone 상태**: 8개 구역 (A01, A02, B01~B04, C01, C02)

### 3. **알림 시스템**
- **실시간 알림**: 폴링 방식으로 30초마다 업데이트
- **필터링**: 알림 타입, 상태별 필터
- **읽음 처리**: 개별/전체 읽음 처리
- **즐겨찾기**: 중요 알림 북마크

### 4. **사용자 관리**
- **권한 시스템**: ROOT, ADMIN, USER 3단계
- **인증**: JWT 토큰 기반
- **프로필 관리**: 개인정보, 비밀번호 변경
- **회원 관리**: ROOT 권한으로 사용자 CRUD

### 5. **설정 관리**
- **센서 설정**: 임계값 관리, AI 추천
- **시스템 설정**: 센서 목록, 장비 관리
- **권한별 접근**: 역할에 따른 탭 제한

---

## 📁 디렉토리 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── 3d/              # 3D 관련 컴포넌트
│   │   ├── main/        # 메인 3D 뷰어
│   │   └── zone/        # Zone별 3D 컴포넌트
│   ├── alarm/           # 알림 관련 컴포넌트
│   ├── common/          # 공통 UI 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   └── setting/         # 설정 관련 컴포넌트
├── config/              # 설정 파일
│   ├── constants.js     # 전역 상수
│   └── sensorConfig.js  # 센서 설정
├── contexts/            # React Context
├── hooks/               # 커스텀 훅
├── pages/               # 페이지 컴포넌트
│   ├── setting/         # 설정 페이지들
│   └── zone/            # Zone 페이지
├── services/            # API 서비스
│   └── api/             # API 클라이언트
├── utils/               # 유틸리티 함수
└── types/               # 타입 정의
```

---

## 🔧 핵심 기술

### 1. **상태 관리**
- **useAuth**: 인증 상태 관리
- **useZoneManager**: Zone 상태 및 SSE 연결
- **useAlarmData**: 알림 데이터 관리
- **useZoneSensorData**: Zone별 센서 데이터

### 2. **3D 렌더링**
- **Three.js**: 3D 그래픽 라이브러리
- **@react-three/fiber**: React Three.js 래퍼
- **@react-three/drei**: Three.js 유틸리티
- **GLTFLoader**: 3D 모델 로딩

### 3. **실시간 통신**
- **SSE (Server-Sent Events)**: 실시간 데이터 스트림
- **EventSourcePolyfill**: 브라우저 호환성
- **자동 재연결**: 연결 끊김 시 자동 복구
- **하트비트**: 연결 상태 모니터링

### 4. **UI/UX**
- **Tailwind CSS**: 유틸리티 퍼스트 CSS
- **커스텀 디자인 시스템**: 브랜드 컬러 (#494FA2)
- **다크모드**: 시스템 테마 지원
- **반응형 디자인**: 모바일/태블릿/데스크톱

---

## 🎨 디자인 시스템

### 컬러 팔레트
```css
Primary: #494FA2 (브랜드 메인)
Secondary: #64748B (보조 색상)
Success: #22C55E (성공)
Warning: #F59E0B (경고)
Danger: #EF4444 (위험)
```

### 컴포넌트 스타일
- **modern-card**: 글래스모피즘 카드
- **gradient-button**: 그라데이션 버튼
- **sensor-card**: 센서 데이터 카드
- **status-indicator**: 상태 표시기

---

## 🔐 보안 및 권한

### 인증 시스템
- **JWT 토큰**: Access Token + Refresh Token
- **자동 갱신**: 토큰 만료 시 자동 갱신
- **로컬 스토리지**: 사용자 정보 저장

### 권한 체계
- **ROOT**: 모든 기능 접근 가능
- **ADMIN**: 관리 기능 접근 가능
- **USER**: 기본 기능만 접근 가능

### 라우트 보호
- **ProtectedRoute**: 인증된 사용자만 접근
- **RoleProtectedRoute**: 권한별 접근 제어

---

## 📊 데이터 플로우

### 1. **인증 플로우**
```
로그인 → JWT 토큰 발급 → 사용자 정보 저장 → 라우트 접근
```

### 2. **센서 데이터 플로우**
```
백엔드 센서 → SSE 스트림 → useZoneManager → 3D 모델 업데이트
```

### 3. **알림 플로우**
```
백엔드 알림 → 폴링 API → useAlarmData → UI 업데이트
```

---

## 🚀 개발 환경 설정

### 1. 환경 변수 파일 생성
```bash
cp env.example .env
```

### 2. 백엔드 서비스 실행
```bash
# UserService (포트 8081)
cd C:\BE\Backend-UserService\user-service
npm start

# Dashboard 백엔드 (포트 8083)
cd C:\BE\Backend-dashboard\backend-dashboard
npm start

# Report Service (포트 8085)
cd C:\BE\Backend-Report\report-service
npm start

# Grafana (포트 3000)
# 192.168.55.180:3000에서 실행 중
```

### 3. 프론트엔드 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 변수 설정
```bash
# .env 파일
VITE_API_BASE_URL=http://localhost:8080
VITE_DASHBOARD_API_BASE_URL=http://localhost:8080
VITE_REPORT_API_BASE_URL=http://localhost:8085
VITE_GRAFANA_API_BASE_URL=http://192.168.55.180:3000
```

---

## 🐛 주요 이슈 및 해결방안

### 1. **SSE 연결 불안정**
- **문제**: 네트워크 끊김 시 연결 해제
- **해결**: 자동 재연결, 하트비트 체크, 지수 백오프

### 2. **3D 모델 로딩 성능**
- **문제**: 큰 GLTF 파일 로딩 지연
- **해결**: Suspense 사용, 로딩 상태 표시

### 3. **메모리 누수**
- **문제**: SSE 연결 해제 시 메모리 누수
- **해결**: useEffect cleanup, 이벤트 리스너 정리

---

## 📈 성능 최적화

### 1. **코드 분할**
- React.lazy()를 통한 지연 로딩
- 페이지별 번들 분리

### 2. **메모이제이션**
- useMemo, useCallback 활용
- 불필요한 리렌더링 방지

### 3. **이미지 최적화**
- WebP 형식 사용
- 지연 로딩 적용

---

## 🔄 업데이트 히스토리

### v0.0.0 (현재)
- ✅ 기본 3D 시각화 시스템 구축
- ✅ 실시간 SSE 연결 구현
- ✅ 사용자 인증 시스템
- ✅ 알림 관리 시스템
- ✅ 반응형 UI/UX 디자인

---

## 📝 개발 가이드라인

### 1. **코딩 컨벤션**
- 함수형 컴포넌트 사용
- 커스텀 훅으로 로직 분리
- TypeScript 스타일 JSDoc 주석

### 2. **컴포넌트 구조**
- 재사용 가능한 컴포넌트 작성
- Props 인터페이스 명확히 정의
- 에러 바운더리 적용

### 3. **상태 관리**
- 로컬 상태는 useState
- 전역 상태는 Context API
- 서버 상태는 커스텀 훅

---

## 🎯 향후 개선사항

### 1. **기능 개선**
- [ ] 실시간 차트 추가
- [ ] 데이터 내보내기 기능
- [ ] 모바일 앱 지원

### 2. **성능 개선**
- [ ] 가상화 스크롤링
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화

### 3. **사용자 경험**
<!-- - [ ] 키보드 단축키
- [ ] 다국어 지원 -->
- [ ] 접근성 개선

---

*이 문서는 프로젝트의 전체적인 구조와 기능을 이해하기 위한 리마인드 문서입니다.*
