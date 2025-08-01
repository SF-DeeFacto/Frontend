// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Aside from './Aside';
import Text from '../common/Text';
import { usePermissions } from '../../hooks/usePermissions';

const MainLayout = () => {
  const location = useLocation();
  const { hasZoneAccess, getZoneDisplayName } = usePermissions();
  
  // 경로에 따른 타이틀 매핑
  const getTitle = () => {
    const path = location.pathname;
    
    if (path === '/home') return 'Dashboard';
    if (path === '/graph') return 'Graph';
    if (path === '/report') return 'Report';
    if (path === '/alarm') return 'Alarm';
    if (path === '/setting') return 'Setting';
    if (path.startsWith('/zone/')) {
      const zoneId = path.split('/')[2]?.toLowerCase();
      
      if (!zoneId) return '';
      
      // 권한 체크
      if (!hasZoneAccess(zoneId)) {
        return '접근 권한 없음';
      }
      
      return getZoneDisplayName(zoneId);
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
            <div className="px-[30px] py-[12px]">
              <Text variant="title" size="28px" weight="bold" color="gray-900">
                {title}
              </Text>
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
