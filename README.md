# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 백엔드 연동 설정

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 설정
VITE_API_BASE_URL=/api

# 개발 환경 백엔드 서버 주소 (필요시 변경)
# VITE_API_BASE_URL=http://localhost:8081
```

### 2. 백엔드 서버 주소 설정
`vite.config.js` 파일에서 프록시 설정의 target을 백엔드 서버 주소로 변경하세요:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 백엔드 서버 주소
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 3. API 서비스 사용법

#### 인증 서비스
```js
import { login, logout, validateToken } from './services/auth.js';

// 로그인
const result = await login({ username: 'user', password: 'pass' });

// 로그아웃
await logout();

// 토큰 검증
const validation = await validateToken();
```

#### 날씨 서비스
```js
import { fetchWeatherData, fetchWeatherForecast } from './services/weather.js';

// 현재 날씨
const weather = await fetchWeatherData();

// 날씨 예보
const forecast = await fetchWeatherForecast();
```

#### 구역 서비스
```js
import { fetchZoneStatus, controlZone } from './services/zone.js';

// 구역 상태
const zones = await fetchZoneStatus();

// 구역 제어
await controlZone('zone1', 'on');
```

#### 센서 서비스
```js
import { fetchSensorData, fetchSensorHistory } from './services/sensor.js';

// 센서 데이터
const sensors = await fetchSensorData();

// 센서 히스토리
const history = await fetchSensorHistory('sensor1', '24h');
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

## 개발 서버 실행

```bash
npm run dev
```

## 빌드

```bash
npm run build
```
