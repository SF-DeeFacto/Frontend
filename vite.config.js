// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // UserService 백엔드 (포트 8081)
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        //상세히..
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('프록시 요청:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('프록시 응답:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Dashboard 백엔드 (포트 8083)
      '/dashboard-api': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dashboard-api/, '')
      }
    }
  }
})
