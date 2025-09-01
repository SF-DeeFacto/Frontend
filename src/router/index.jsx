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
// import GrafanaDashboard from '../pages/GrafanaDashboard';
// import GrafanaTest from '../pages/GrafanaTest';
import NotFound from '../pages/NotFound';
import DashboardChart from '../pages/GrafanaTest_2';
import GrafanaIframe from '../pages/GrafanaIframe';

// 인증 상태를 캐시하여 중복 체크 방지
let authCache = null;
let lastCheck = 0;
const CACHE_DURATION = 1000; // 1초 캐시

// 로그인 상태 확인 함수
const isAuthenticated = () => {
  const now = Date.now();
  
  // 캐시가 유효한 경우 캐시된 결과 반환
  if (authCache !== null && (now - lastCheck) < CACHE_DURATION) {
    return authCache;
  }
  
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  
  // 개발 환경에서만 로그 출력
  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log('인증 체크:', { token: !!token, user: !!user, cached: false });
  }
  
  // token과 user가 모두 존재하고 유효한지 확인
  if (!token || !user) {
    if (isDev) {
      console.log('인증 실패: token 또는 user가 없음');
    }
    authCache = false;
    lastCheck = now;
    return false;
  }
  
  try {
    // user가 유효한 JSON인지 확인
    const userData = JSON.parse(user);
    if (!userData || typeof userData !== 'object') {
      if (isDev) {
        console.log('인증 실패: user 데이터가 유효하지 않음');
      }
      authCache = false;
      lastCheck = now;
      return false;
    }
    
    // 실제 저장된 데이터 구조에 맞게 검증
    if (!userData.employeeId || !userData.name) {
      if (isDev) {
        console.log('인증 실패: user 데이터에 필수 정보 없음', userData);
      }
      authCache = false;
      lastCheck = now;
      return false;
    }
    
    // token이 유효한 형식인지 확인 (간단한 검증)
    if (token.length < 10) {
      if (isDev) {
        console.log('인증 실패: token이 너무 짧음');
      }
      authCache = false;
      lastCheck = now;
      return false;
    }
    
    if (isDev) {
      console.log('인증 성공:', userData.name);
    }
    authCache = true;
    lastCheck = now;
    return true;
  } catch (error) {
    if (isDev) {
      console.log('인증 실패: user 데이터 파싱 오류', error);
    }
    authCache = false;
    lastCheck = now;
    return false;
  }
};

// 인증 캐시 무효화 함수 (로그인/로그아웃 시 호출)
export const clearAuthCache = () => {
  authCache = null;
  lastCheck = 0;
};

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
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
        <Route path="/home/chatbot" element={<ChatBot />} />
        <Route path="/home/alarm" element={<Alarm />} />

        <Route path="/home/setting" element={<Setting />} />
        <Route path="/home/zone/:zoneId" element={<DynamicZone />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 