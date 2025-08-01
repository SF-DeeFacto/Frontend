// src/App.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from './contexts/AuthContext';
import { WeatherProvider } from './contexts/WeatherContext';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-text-main font-sans">
        <AuthProvider>
          <WeatherProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </WeatherProvider>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
};

export default App; 