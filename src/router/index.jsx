import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
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

// 동적 Zone 컴포넌트
const DynamicZone = () => {
  const { zoneId } = useParams();
  return <Zone zoneId={zoneId} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/report" element={<Report />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/zone/:zoneId" element={<DynamicZone />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 