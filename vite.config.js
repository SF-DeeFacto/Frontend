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
      // API Gateway 프록시 설정 (환경변수 사용)
      [getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api')]: {
        target: getEnvVar('VITE_API_GATEWAY_URL', 'http://localhost:8080'),
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(new RegExp(`^${getEnvVar('VITE_API_GATEWAY_BASE_PATH', '/api')}`), '/api')
      }
    }
  }
})
      
