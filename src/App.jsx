// src/App.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import AlertPopup from './components/alarm/AlertPopup';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand-medium dark:from-neutral-900 dark:to-neutral-800 text-secondary-800 dark:text-neutral-100 font-sans transition-colors duration-300">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        
        {/* 전역 알림 SSE 연결 - 페이지와 상관없이 항상 연결 */}
        <AlertPopup />
      </div>
    </ThemeProvider>
  );
}

export default App; 