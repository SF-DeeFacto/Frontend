import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Sensor from '../pages/Sensor';
import Graph from '../pages/Graph';
import Report from '../pages/Report';
import Alarm from '../pages/Alarm';
import ChatBot from '../pages/ChatBot';
import Setting from '../pages/setting/Setting';
import ZoneA from '../pages/zone/ZoneA';
import ZoneB from '../pages/zone/ZoneB';
import ZoneC from '../pages/zone/ZoneC';
import ZoneD from '../pages/zone/ZoneD';
import ZoneE from '../pages/zone/ZoneE';
import ZoneF from '../pages/zone/ZoneF';
import ZoneG from '../pages/zone/ZoneG';
import ZoneH from '../pages/zone/ZoneH';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="flex">
      {!isLoginPage && <Navbar />}
      <div className={`${isLoginPage ? 'w-full' : 'flex-1'} bg-gray-50`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sensor" element={<Sensor />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/report" element={<Report />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/zone/a" element={<ZoneA />} />
          <Route path="/zone/b" element={<ZoneB />} />
          <Route path="/zone/c" element={<ZoneC />} />
          <Route path="/zone/d" element={<ZoneD />} />
          <Route path="/zone/e" element={<ZoneE />} />
          <Route path="/zone/f" element={<ZoneF />} />
          <Route path="/zone/g" element={<ZoneG />} />
          <Route path="/zone/h" element={<ZoneH />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes; 