// vite.config.js
// 프록시 설정 - 개발 환경에서 CORS 없이 백엔드 연동

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // 개발 환경: /api → http://localhost:8080으로 프록시 (CORS 無)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
      
