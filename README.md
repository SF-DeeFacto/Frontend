# Frontend Dashboard

## 백엔드 서비스 연동 설정

이 프로젝트는 두 개의 백엔드 서비스와 연동됩니다:

### 1. UserService 백엔드 (포트 8081)
- **용도**: 사용자 인증, 사용자 정보 관리
- **프록시 경로**: `/api`
- **환경 변수**: `VITE_API_BASE_URL`

### 2. Dashboard 백엔드 (포트 8083)
- **용도**: 대시보드 데이터, 실시간 모니터링
- **프록시 경로**: `/dashboard-api`
- **환경 변수**: `VITE_DASHBOARD_API_BASE_URL`

## 개발 환경 설정

1. 환경 변수 파일 생성:
```bash
cp env.example .env
```

2. 백엔드 서비스 실행:
```bash
# UserService (포트 8081)
cd C:\BE\Backend-UserService\user-service
npm start

# Dashboard 백엔드 (포트 8083)
cd C:\BE\Backend-dashboard\backend-dashboard
npm start
```

3. 프론트엔드 실행:
```bash
npm run dev
```

## API 사용 예시

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

## 프록시 설정

`vite.config.js`에서 프록시 설정을 통해 CORS 문제를 해결합니다:

```javascript
server: {
  proxy: {
    // UserService 백엔드
    '/api': {
      target: 'http://localhost:8081',
      changeOrigin: true
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

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 빌드

```bash
npm run build
```
