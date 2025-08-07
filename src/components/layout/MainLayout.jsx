// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Aside from './Aside';
import Text from '../common/Text';

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Aside />
        <div className="flex-1 bg-gray-50">
          {title && (
            <div className="flex flex-col w-full items-start flex-shrink-0" style={{ paddingTop: '20px', paddingBottom: '11px' }}>
              <div className="w-full h-[35px] flex items-center px-[30px]">
                <span
                  style={{
                    fontSize: "28px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "35px"
                  }}
                >
                  {title}
                </span>
              </div>
            </div>
          )}
          <div className="px-[30px] py-[12px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
