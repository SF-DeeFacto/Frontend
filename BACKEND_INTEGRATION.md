# 백엔드 연동 가이드

## 개요
이 프로젝트는 백엔드 API Gateway와의 연동을 지원하며, Vite 프록시를 통해 CORS 문제를 해결합니다.

## 백엔드 서버 구성

### 1. API Gateway (포트 8080)
- 프록시 경로: `/api`
- 타겟: `http://localhost:8080`
- 주요 기능: 인증, 라우팅, 보안, SSE 통신

## 프록시 설정

### Vite 설정 (vite.config.js)
```javascript
server: {
  port: 5174,
  proxy: {
    // API Gateway를 통한 백엔드 서비스 연결
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    },
    
    // SSE 연결을 위한 프록시 (CORS 우회)
    '/sse': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/sse/, '/api/home')
    }
  }
}
```

## 환경 변수 설정

### 자동 설정 (권장)
- `vite.config.js`에서 자동으로 환경변수 설정
- 별도의 `.env` 파일 불필요

### 수동 설정 (선택사항)
`.env` 파일을 생성하여 설정 가능:
```bash
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_API_GATEWAY_BASE_PATH=/api
VITE_ENABLE_DEBUG_LOGGING=true
```

## API 호출 구조

### 1. 일반 API 호출
```javascript
// 프록시를 통한 API Gateway 호출
const response = await axios.post('/api/auth/login', loginData);
```

### 2. SSE 연결
```javascript
// 프록시를 통한 SSE 연결
const sseConnection = sseApi.connectDashboardStatus(
  onMessage, onError, onOpen
);
```

## 백엔드 서버 상태 확인

### 헬스체크 엔드포인트
- API Gateway: `/api/health`

### 상태 표시 컴포넌트
- **파일**: `src/components/common/BackendStatus.jsx`
- **기능**: API Gateway 연결 상태 표시
- **새로고침**: 수동으로 상태 확인 가능

## 사용 방법

### 1. 백엔드 서버 실행
```bash
# API Gateway 실행 (포트 8080)
cd C:\BE\Backend-ApiGateway\api-gateway
npm start
```

### 2. 프론트엔드 실행
```bash
npm run dev
```

### 3. 백엔드 상태 확인
1. 브라우저에서 `http://localhost:5174` 접속
2. 백엔드 상태 컴포넌트에서 연결 상태 확인
3. "상태 확인" 버튼으로 실시간 상태 체크

## 문제 해결

### 백엔드 연결 실패
1. **백엔드 서버 실행 확인**
   - API Gateway가 포트 8080에서 실행 중인지 확인
   - `http://localhost:8080` 접속 테스트

2. **포트 충돌 확인**
   - 포트 8080이 다른 프로세스에 의해 사용 중인지 확인
   - `netstat -ano | findstr :8080` (Windows)

3. **프록시 설정 확인**
   - `vite.config.js`의 프록시 설정 확인
   - 브라우저 개발자 도구에서 네트워크 요청 확인

4. **CORS 문제 해결**
   - Vite 프록시를 통한 요청으로 CORS 우회
   - 백엔드에서 CORS 헤더 설정 확인

### SSE 연결 문제
1. **프록시 경로 확인**
   - `/sse/status` → `/api/home/status`로 변환되는지 확인
   - 브라우저 개발자 도구에서 EventSource 연결 상태 확인

2. **백엔드 SSE 엔드포인트 확인**
   - `/api/home/status` 엔드포인트가 존재하는지 확인
   - 백엔드 로그에서 SSE 연결 시도 확인

### 로그인 실패
1. **API 엔드포인트 확인**
   - `/api/auth/login` 엔드포인트가 존재하는지 확인
   - 백엔드 로그에서 로그인 요청 확인

2. **요청 데이터 형식 확인**
   - `employeeId`와 `password` 필드가 올바른지 확인
   - 백엔드에서 기대하는 요청 형식과 일치하는지 확인

## 개발 팁

### 1. 디버깅
- 브라우저 개발자 도구에서 네트워크 요청 확인
- Vite 프록시 로그로 요청/응답 추적
- 백엔드 상태 컴포넌트로 서버 상태 모니터링

### 2. 백엔드 연동 테스트
- 간단한 헬스체크 API로 연결 상태 확인
- 로그인 API로 인증 시스템 테스트
- SSE 연결로 실시간 데이터 통신 테스트

### 3. 배포 시 주의사항
- 실제 백엔드 서버 주소로 설정 변경
- 프록시 설정을 프로덕션 환경에 맞게 조정
- CORS 설정 확인

## 현재 설정 상태

### ✅ 완료된 설정
- Vite 프록시 설정 (`/api`, `/sse`)
- 백엔드 설정 자동화
- SSE 연결 프록시 지원
- 백엔드 상태 모니터링

### 🔧 개선된 기능
- 환경변수 자동 처리
- 프록시를 통한 CORS 우회
- 상세한 에러 로깅
- 백엔드 상태 시각화

### 📝 다음 단계
1. 백엔드 서버 실행 및 연결 테스트
2. 로그인 API 테스트
3. SSE 연결 테스트
4. 실제 데이터 연동 확인
