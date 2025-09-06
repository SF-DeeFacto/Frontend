// vite.config.js
// 프록시 설정

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // 포트 고정
    hmr: false, // HMR 완전 비활성화
    host: 'localhost',
    watch: {
      // 파일 변경 감지를 polling으로 처리
      usePolling: true,
      interval: 1000, // 1초마다 체크
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
        target: 'http://k8s-api-apigatew-9a1423437c-d700af6b954e5d10.elb.ap-northeast-2.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/report-api/, ''), // /api 제거
        secure: false,
      },
      '/aws-grafana':{
        target: 'http://ac63b2a0c9ede49f793d3dc81ad44a15-5661160d80c851fb.elb.ap-northeast-2.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aws-grafana/, ''), // /api 제거
        secure: false,
      }

    }
  }
}); 