// vite.config.js
// 프록시 설정

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/grafana-api': {
        target: 'http://192.168.55.180:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/grafana-api/, ''),
        // secure: false,
        // configure: (proxy, options) => {
        //   proxy.on('error', (err, req, res) => {
        //     console.log('Proxy error:', err);
        //   });
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     console.log('Proxy request:', req.method, req.url);
        //   });
        //   proxy.on('proxyRes', (proxyRes, req, res) => {
        //     console.log('Proxy response:', proxyRes.statusCode, req.url);
        //   });
        // }
      },
      //User Service 직접 연결 (API Gateway 미실행시 임시)
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api 제거하여 User Service로 직접 전달
        //상세히..
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('프록시 에러:', err.message, 'URL:', req.url);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('프록시 요청:', req.method, req.url, '→', options.target + req.url.replace(/^\/api/, ''));
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
}); 
      
