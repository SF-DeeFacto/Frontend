# 백엔드 연동 가이드

## 개요
이 프로젝트는 백엔드 유저서비스와 API 게이트웨이와의 연동을 지원하며, 개발 시에는 더미 데이터를 사용할 수 있습니다.

## 백엔드 서버 구성

### 1. API Gateway (포트 8080)
- 프록시 경로: `/api`
- 타겟: `http://localhost:8080`
- 주요 기능: 인증, 라우팅, 보안

### 2. UserService (포트 8081)
- 프록시 경로: `/user-service`
- 타겟: `http://localhost:8081`
- 주요 기능: 사용자 관리, 인증

### 3. Dashboard 백엔드 (포트 8083)
- 프록시 경로: `/dashboard-api`
- 타겟: `http://localhost:8083`
- 주요 기능: 대시보드 데이터

## 프록시 설정

### Vite 설정 (vite.config.js)
```javascript
server: {
  proxy: {
    // API Gateway를 통한 UserService 접근
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    },
    
    // UserService 직접 연결
    '/user-service': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/user-service/, '')
    },
    
    // Dashboard 백엔드
    '/dashboard-api': {
      target: 'http://localhost:8083',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/dashboard-api/, '')
    }
  }
}
```

## 인증 시스템

### 통합 인증 서비스
- **파일**: `src/services/api/integratedAuth.js`
- **기능**: 더미 데이터와 실제 백엔드 모두 지원
- **우선순위**: 
  1. 더미 데이터 (설정에 따라)
  2. API Gateway
  3. UserService 직접 연결
  4. 더미 데이터 폴백

### 로그인 플로우
1. 더미 데이터 확인 (설정에 따라)
2. 백엔드 서버 상태 확인
3. 백엔드 로그인 시도
4. 실패 시 더미 데이터 폴백

## 더미 데이터 관리

### 설정 방법
- **UI 토글**: 로그인 페이지에서 더미 데이터 사용/사용 안함 선택
- **로컬 스토리지**: `useDummyData` 키로 설정 저장
- **기본값**: `true` (개발용)

### 더미 사용자 데이터
- **파일**: `src/dummy/data/users.js`
- **형식**: 사원번호, 비밀번호, 사용자 정보

## 백엔드 서버 상태 확인

### 헬스체크 엔드포인트
- API Gateway: `/api/health`
- UserService: `/user-service/health`
- Dashboard: `/dashboard-api/health`

### 상태 표시 컴포넌트
- **파일**: `src/components/common/BackendStatus.jsx`
- **기능**: 각 백엔드 서버의 연결 상태 표시
- **새로고침**: 수동으로 상태 확인 가능

## 환경 변수

### 개발 환경
```bash
# API 설정
VITE_API_BASE_URL=/api
VITE_DASHBOARD_API_BASE_URL=/dashboard-api

# 더미 데이터 사용 여부
VITE_USE_DUMMY_DATA=true

# 백엔드 서버 상태 확인
VITE_BACKEND_HEALTH_CHECK=true
```

## 사용 방법

### 1. 백엔드 서버 실행
```bash
# API Gateway 실행 (포트 8080)
cd C:\BE\Backend-ApiGateway\api-gateway
npm start

# UserService 실행 (포트 8081)
cd C:\BE\Backend-UserService\user-service
npm start
```

### 2. 프론트엔드 실행
```bash
npm run dev
```

### 3. 로그인 테스트
1. 로그인 페이지에서 백엔드 서버 상태 확인
2. 더미 데이터 사용 여부 선택
3. 더미 사용자로 로그인 테스트
4. 실제 백엔드로 로그인 테스트

## 문제 해결

### 백엔드 연결 실패
1. 백엔드 서버가 실행 중인지 확인
2. 포트 번호 확인 (8080, 8081, 8083)
3. 프록시 설정 확인
4. CORS 설정 확인

### 더미 데이터 문제
1. `useDummyData` 설정 확인
2. 더미 사용자 데이터 형식 확인
3. 로컬 스토리지 설정 확인

### 로그인 실패
1. 백엔드 서버 상태 확인
2. 사용자 인증 정보 확인
3. 네트워크 연결 상태 확인
4. 브라우저 개발자 도구에서 에러 로그 확인

## 개발 팁

### 1. 백엔드 서버 전환
- 더미 데이터 토글로 빠른 전환 가능
- 백엔드 서버 상태 실시간 확인
- 폴백 시스템으로 안정적인 개발 환경

### 2. 디버깅
- 브라우저 개발자 도구에서 네트워크 요청 확인
- 프록시 로그로 요청/응답 추적
- 백엔드 상태 컴포넌트로 서버 상태 모니터링

### 3. 배포 시 주의사항
- 더미 데이터 사용 비활성화
- 실제 백엔드 서버 주소로 설정 변경
- 환경 변수 설정 확인
