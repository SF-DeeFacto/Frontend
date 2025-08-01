import React from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Graph from '../pages/Graph';
import Report from '../pages/Report';
import ChatBot from '../pages/ChatBot';
import Alarm from '../pages/Alarm';
import Setting from '../pages/setting/Setting';
import Zone from '../pages/zone/Zone';
import NotFound from '../pages/NotFound';
import { useAuth } from '../contexts/AuthContext';

// 인증이 필요한 라우트를 감싸는 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 동적 Zone 컴포넌트
const DynamicZone = () => {
  const { zoneId } = useParams();
  return <Zone zoneId={zoneId || ''} />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 로그인 페이지는 인증되지 않은 사용자만 접근 가능 */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Login />
        } 
      />
      
      {/* 메인 레이아웃은 인증된 사용자만 접근 가능 */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/report" element={<Report />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/zone/:zoneId" element={<DynamicZone />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* 루트 경로는 홈으로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes; 