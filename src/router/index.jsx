import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Sensor from '../pages/Sensor';
import Graph from '../pages/Graph';
import Report from '../pages/Report';
import Alarm from '../pages/Alarm';
import ChatBot from '../pages/ChatBot';
import Setting from '../pages/setting/Setting';
import NotFound from '../pages/NotFound';

// ZoneA를 lazy loading으로 변경
const ZoneA = lazy(() => import('../pages/zone/ZoneA'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<MainLayout title="Dashboard"><Home /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/sensor" element={<MainLayout title="Sensor"><Sensor /></MainLayout>} />
      <Route path="/graph" element={<MainLayout title="Graph"><Graph /></MainLayout>} />
      <Route path="/report" element={<MainLayout title="Report"><Report /></MainLayout>} />
      <Route path="/alarm" element={<MainLayout title="Alarm"><Alarm /></MainLayout>} />
      <Route path="/chatbot" element={<MainLayout title="ChatBot"><ChatBot /></MainLayout>} />
      <Route path="/setting" element={<MainLayout title="Setting"><Setting /></MainLayout>} />
      <Route path="/zone/a" element={
        <MainLayout title="ZoneA">
          <Suspense fallback={<div>Loading...</div>}>
            <ZoneA />
          </Suspense>
        </MainLayout>
      } />
      <Route path="*" element={<MainLayout title="Not Found"><NotFound /></MainLayout>} />
    </Routes>
  );
};

export default AppRoutes; 