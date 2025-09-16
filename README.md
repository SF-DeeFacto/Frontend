# Deefacto Frontend

Deefacto는 3D 모델 기반의 IoT 센서 모니터링 및 관리 시스템의 프론트엔드 애플리케이션입니다.

## 🚀 주요 기능

### 3D 모델 시각화
- **Three.js 기반 3D 모델 뷰어**: React Three Fiber를 활용한 인터랙티브 3D 모델 표시
- **Zone 기반 모델 관리**: 각 구역별 3D 모델 로딩 및 상태 표시
- **실시간 센서 데이터 연동**: 3D 모델과 센서 데이터의 실시간 연동

### 센서 모니터링
- **실시간 센서 데이터**: WebSocket/SSE를 통한 실시간 센서 데이터 수신
- **센서 상태 표시**: 각 Zone별 센서 상태 및 연결 상태 모니터링
- **알람 시스템**: 임계값 기반 알람 및 알림 기능

### 대시보드
- **Grafana 연동**: Grafana 대시보드 임베딩 및 데이터 시각화
- **차트 및 그래프**: Chart.js, Recharts를 활용한 데이터 시각화
- **리포트 기능**: 센서 데이터 기반 리포트 생성

### 사용자 관리
- **인증 시스템**: JWT 기반 사용자 인증
- **권한 관리**: 역할 기반 접근 제어 (ROOT, ADMIN, USER)
- **사용자 설정**: 프로필 관리 및 시스템 설정

## 🛠 기술 스택

### Frontend Framework
- **React 18.2.0**: 메인 프론트엔드 프레임워크
- **Vite 7.0.4**: 빌드 도구 및 개발 서버
- **React Router DOM 7.7.0**: 클라이언트 사이드 라우팅

### 3D Graphics
- **Three.js 0.170.0**: 3D 그래픽스 라이브러리
- **React Three Fiber 8.18.0**: Three.js의 React 래퍼
- **React Three Drei 9.122.0**: Three.js 유틸리티 컴포넌트

### UI/UX
- **Tailwind CSS 3.4.17**: 유틸리티 우선 CSS 프레임워크
- **Lucide React 0.542.0**: 아이콘 라이브러리
- **Chart.js 4.5.0**: 차트 라이브러리
- **Recharts 3.1.2**: React 차트 라이브러리

### HTTP & Real-time
- **Axios 1.11.0**: HTTP 클라이언트
- **Event Source Polyfill 1.0.31**: Server-Sent Events 지원

### 개발 도구
- **ESLint 9.30.1**: 코드 린팅
- **PostCSS 8.5.6**: CSS 후처리
- **Autoprefixer 10.4.21**: CSS 벤더 프리픽스 자동 추가

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── 3d/              # 3D 모델 관련 컴포넌트
│   │   ├── common/      # 공통 3D 컴포넌트
│   │   ├── hooks/       # 3D 관련 커스텀 훅
│   │   ├── main/        # 메인 3D 모델 뷰어
│   │   └── zone/        # Zone별 3D 모델
│   ├── alarm/           # 알람 관련 컴포넌트
│   ├── common/          # 공통 UI 컴포넌트
│   ├── grafana/         # Grafana 연동 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   └── setting/         # 설정 관련 컴포넌트
├── config/              # 설정 파일
├── contexts/            # React Context
├── hooks/               # 커스텀 훅
├── pages/               # 페이지 컴포넌트
├── router/              # 라우팅 설정
├── services/            # API 서비스
│   └── api/             # API 클라이언트
├── store/               # 상태 관리
└── utils/               # 유틸리티 함수
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   ```bash
   cp env.example .env
   ```
   `.env` 파일을 편집하여 필요한 환경 변수를 설정하세요.

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   애플리케이션이 `http://localhost:5173`에서 실행됩니다.

4. **빌드**
   ```bash
   npm run build
   ```

5. **프리뷰**
   ```bash
   npm run preview
   ```

## 🔧 개발 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드된 앱 미리보기
- `npm run lint`: ESLint를 통한 코드 검사

## 🌐 API 프록시 설정

개발 환경에서 다음 API 엔드포인트들이 프록시로 설정되어 있습니다:

- `/api/*` → `http://localhost:8080` (User Service)
- `/dashboard-api/*` → `http://localhost:8080` (Dashboard API)
- `/grafana-api/*` → `http://192.168.55.180:3000` (Grafana)
- `/report-api/*` → AWS API Gateway
- `/aws-grafana/*` → AWS Grafana

## 🔐 인증 및 권한

- **JWT 기반 인증**: 토큰 기반 사용자 인증
- **역할 기반 접근 제어**: ROOT, ADMIN, USER 권한 레벨
- **Zone 스코프**: 사용자별 접근 가능한 Zone 제한

## 📊 주요 페이지

- **홈 (`/home`)**: 3D 모델 뷰어 및 Zone 상태 모니터링
- **그래프 (`/home/graph`)**: 센서 데이터 차트 및 시각화
- **Grafana (`/home/grafana-*`)**: Grafana 대시보드 연동
- **리포트 (`/home/report`)**: 센서 데이터 리포트
- **알람 (`/home/alarm`)**: 알람 관리 및 모니터링
- **설정 (`/home/setting`)**: 시스템 설정 및 사용자 관리
- **Zone (`/home/zone/:zoneId`)**: 개별 Zone 상세 모니터링

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

프로젝트에 대한 문의사항이나 지원이 필요한 경우, 개발팀에 연락해주세요.