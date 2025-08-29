// vite.config.js
// 프록시 설정

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

export default defineConfig({
  plugins: [react()],
  server: {
    // HMR 웹소켓 비활성화 옵션들
    // hmr: false, // HMR 완전 비활성화
    // 또는 웹소켓만 비활성화하고 polling 사용
    hmr: {
      port: false, // 웹소켓 포트 비활성화
    },
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
      // 알림 API도 이 프록시를 통해 UserService로 전달됩니다
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api 제거하여 User Service로 직접 전달
        //상세히..
        // configure: (proxy, options) => {
        //   proxy.on('error', (err, req, res) => {
        //     console.log('프록시 에러:', err.message, 'URL:', req.url);
        //   });
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     console.log('프록시 요청:', req.method, req.url, '→', options.target + req.url.replace(/^\/api/, ''));
        //   });
        //   proxy.on('proxyRes', (proxyRes, req, res) => {
        //     console.log('프록시 응답:', proxyRes.statusCode, req.url);
        //   });
        // }
      },
      // Dashboard 백엔드 (포트 8083) - 게이트웨이(8080)로 변경
      '/dashboard-api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dashboard-api/, ''),
        // configure: (proxy, options) => {
        //   proxy.on('error', (err, req, res) => {
        //     console.log('Dashboard 프록시 에러:', err.message, 'URL:', req.url);
        //   });
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     console.log('Dashboard 프록시 요청:', req.method, req.url, '→', options.target + req.url.replace(/^\/dashboard-api/, ''));
        //   });
        //   proxy.on('proxyRes', (proxyRes, req, res) => {
        //     console.log('Dashboard 프록시 응답:', proxyRes.statusCode, req.url);
        //   });
        // }
      },
      '/report-api': {                         // <-- 추가: 모든 /api 요청을 백엔드(8085)로 프록시
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/report-api/, ''), // /api 제거
        secure: false,
      }

    }
  }
}); 