/**
 * 메인 App 컴포넌트
 * 전역 상태 관리, 테마, 라우팅, 에러 처리를 총괄
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStateProvider } from '@store';
import { ThemeProvider } from '@contexts/ThemeContext';
import ErrorBoundary from '@components/common/ErrorBoundary';
import AppRoutes from './router';

function App() {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-brand-light to-brand-medium dark:from-neutral-900 dark:to-neutral-800 text-secondary-800 dark:text-neutral-100 font-sans transition-colors duration-300">
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </GlobalStateProvider>
    </ErrorBoundary>
  );
}

export default App; 