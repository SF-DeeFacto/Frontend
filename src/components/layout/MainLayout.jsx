// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Aside from './Aside';
import AlertPopup from '../alarm/AlertPopup';

const MainLayout = () => {
  const location = useLocation();
  
  // 경로에 따른 타이틀 매핑
  const getTitle = () => {
    const path = location.pathname;
    
    if (path === '/home') return 'Dashboard';
    if (path === '/home/graph') return 'Graph';
    if (path === '/home/report') return 'Report';
    if (path === '/home/alarm') return 'Alarm';
    if (path === '/home/setting') return 'Setting';
    if (path.startsWith('/home/zone/')) {
      const zoneId = path.split('/')[3]?.toLowerCase();
      return `Zone ${zoneId?.toUpperCase() || 'Unknown'}`;
    }
    
    return '';
  };

  const title = getTitle();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-brand-light to-brand-medium dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300">
      <Header />
      <div className="flex flex-1 min-h-[calc(100vh-60px)]">
        <Aside />
        <div className="flex-1 relative">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(73, 79, 162, 0.1) 2px, transparent 0), 
                               radial-gradient(circle at 75px 75px, rgba(73, 79, 162, 0.08) 2px, transparent 0)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          
          {title && (
            <div className="relative z-10 flex flex-col w-full items-start flex-shrink-0 pt-8 pb-4">
              <div className="w-full flex items-center px-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-brand-main to-primary-700 rounded-full shadow-soft"></div>
                  <h1 className="text-3xl font-bold text-secondary-800 dark:text-neutral-100 tracking-tight transition-colors duration-300">
                    {title}
                  </h1>
                </div>
              </div>
            </div>
          )}
          
          <div className="relative z-10 px-8 pb-8">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      
      {/* 실시간 알림 팝업 */}
      <AlertPopup />
    </div>
  );
};

export default MainLayout;
