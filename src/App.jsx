// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './router';
import { logEnvironmentConfig } from './config/backendConfig';

function App() {
  useEffect(() => {
    // 환경변수 설정 정보 로그 출력
    logEnvironmentConfig();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App; 