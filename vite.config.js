// vite.config.js
// 프록시 설정 - API Gateway만 사용

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 환경변수에서 설정 가져오기
const getEnvVar = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // API Gateway 직접 연결 (프록시 없이)
      // 프론트엔드에서 직접 API Gateway 호출
    }
  }
})
      
