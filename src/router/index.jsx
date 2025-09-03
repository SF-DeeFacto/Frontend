import React, { Suspense, lazy } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useAuthGuard } from '@hooks/useAuth';

// Layout components (keep loaded)
import MainLayout from '@components/layout/MainLayout';

// Lazy load page components for better performance
const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const Graph = lazy(() => import('@pages/Graph'));
const Report = lazy(() => import('@pages/Report'));
const Alarm = lazy(() => import('@pages/Alarm'));
const Setting = lazy(() => import('@pages/setting/Setting'));
const Zone = lazy(() => import('@pages/zone/Zone'));
const NotFound = lazy(() => import('@pages/NotFound'));

// Optional Grafana pages (remove if not needed)
const GrafanaTest = lazy(() => import('@pages/GrafanaTest_2'));
const GrafanaIframe = lazy(() => import('@pages/GrafanaIframe'));

/**
 * 보호된 라우트 컴포넌트
 * useAuth 훅을 사용하여 인증 상태 확인
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthGuard({ redirectOnFail: false });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * 동적 Zone 컴포넌트
 * URL 파라미터에서 zoneId를 추출하여 Zone 컴포넌트에 전달
 */
const DynamicZone = () => {
  const { zoneId } = useParams();
  return <Zone zoneId={zoneId} />;
};

/**
 * 페이지 로딩 컴포넌트
 */
const PageLoader = () => (
  <LoadingSpinner 
    size="lg" 
    text="페이지를 로딩중입니다..." 
    fullScreen 
  />
);

/**
 * 메인 라우터 컴포넌트
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 루트 경로를 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 로그인 페이지 (인증 불필요) */}
        <Route path="/login" element={<Login />} />
        
        {/* 보호된 라우트들 */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 홈 페이지 */}
          <Route index element={<Home />} />
          
          {/* 주요 기능 페이지들 */}
          <Route path="graph" element={<Graph />} />
          <Route path="report" element={<Report />} />
          <Route path="alarm" element={<Alarm />} />
          <Route path="setting" element={<Setting />} />
          
          {/* 동적 Zone 라우트 */}
          <Route path="zone/:zoneId" element={<DynamicZone />} />
          
          {/* Grafana 관련 라우트들 (선택적) */}
          <Route path="grafana-test" element={<GrafanaTest />} />
          <Route path="grafana-iframe" element={<GrafanaIframe />} />
        </Route>
        
        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;