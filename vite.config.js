import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@config': resolve(__dirname, './src/config'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@types': resolve(__dirname, './src/types'),
      '@store': resolve(__dirname, './src/store'),
      '@constants': resolve(__dirname, './src/constants'),
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: false,
    host: 'localhost',
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      '/grafana-api': {
        target: 'http://192.168.55.180:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/grafana-api/, ''),
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
      '/dashboard-api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dashboard-api/, ''),
        secure: false,
      },
      '/report-api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/report-api/, ''),
        secure: false,
      }
    }
  }
});