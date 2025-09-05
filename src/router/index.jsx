import React from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Graph from '../pages/Graph';
import Report from '../pages/Report';
import Alarm from '../pages/Alarm';
import Setting from '../pages/setting/Setting';
import Zone from '../pages/zone/Zone';
// import GrafanaDashboard from '../pages/GrafanaDashboard';
// import GrafanaTest from '../pages/GrafanaTest';
import NotFound from '../pages/NotFound';
import DashboardChart from '../pages/GrafanaTest_2';
import GrafanaIframe from '../pages/GrafanaIframe';
import { useAuth } from '../hooks/useAuth';
import { isRoot, isRootOrAdmin } from '../services/api/auth';
import { PageLoading } from '../components/ui';
import { LOADING_TEXTS } from '../config';

// useAuth 훅을 사용한 통일된 인증 관리

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth({ redirectOnFail: false });
  
  if (isLoading) {
    return <PageLoading loading={true} loadingText={LOADING_TEXTS.PAGES.GENERAL} fullScreen={true} />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 권한별 보호된 라우트 컴포넌트
const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading } = useAuth({ redirectOnFail: false });
  
  if (isLoading) {
    return <PageLoading loading={true} loadingText={LOADING_TEXTS.PAGES.GENERAL} fullScreen={true} />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let hasAccess = false;
  
  if (requiredRole === 'ROOT') {
    hasAccess = isRoot();
  } else if (requiredRole === 'ROOT_OR_ADMIN') {
    hasAccess = isRootOrAdmin();
  }
  
  if (!hasAccess) {
    // 권한이 없는 경우 홈으로 리다이렉트
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// 동적 Zone 컴포넌트
const DynamicZone = () => {
  const { zoneId } = useParams();
  return <Zone zoneId={zoneId} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 루트 경로를 로그인 페이지로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/home/graph" element={<Graph />} />
        {/* <Route path="/home/grafana" element={<GrafanaDashboard />} /> */}
        <Route path="/home/grafana-test2" element={<DashboardChart />} />
        <Route path="/home/grafana-test3" element={<GrafanaIframe />} />
        {/* <Route path="/home/grafana-test" element={<GrafanaTest />} /> */}
        <Route path="/home/report" element={<Report />} />
        <Route path="/home/alarm" element={<Alarm />} />

        <Route 
          path="/home/setting" 
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          } 
        />
        <Route path="/home/zone/:zoneId" element={<DynamicZone />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 