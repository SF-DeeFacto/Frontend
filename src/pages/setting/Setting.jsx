import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Equipset from './tabs/Equipset';
import Userset from './tabs/Userset';
import PwudTab from './tabs/PwudTab';
import ProfileTab from './tabs/ProfileTab';
import SensorListTab from './tabs/SensorListTab';
import AIRecommend from './tabs/AIRecommend';
import { isRoot, isRootOrAdmin } from '../../services/api/auth';

const Setting = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  // 권한별 탭 필터링
  const allTabs = [
    { id: 'profile', name: '프로필', component: ProfileTab, requiredRole: null }, // 모든 사용자 접근 가능
    { id: 'pwud', name: '비밀번호 변경', component: PwudTab, requiredRole: null }, // 모든 사용자 접근 가능
    { id: 'userset', name: '회원정보 관리', component: Userset, requiredRole: 'ROOT' }, // ROOT만 접근 가능
    { id: 'sensorlist', name: '센서 목록', component: SensorListTab, requiredRole: 'ROOT_OR_ADMIN' }, // ROOT, ADMIN만 접근 가능
    { id: 'equipset', name: '센서 관리', component: Equipset, requiredRole: 'ROOT_OR_ADMIN' }, // ROOT, ADMIN만 접근 가능
    { id: 'airecommendation', name: 'AI 추천 관리', component: AIRecommend, requiredRole: 'ROOT_OR_ADMIN' } // ROOT, ADMIN만 접근 가능
  ];

  // 사용자 권한에 따라 접근 가능한 탭만 필터링
  const tabs = allTabs.filter(tab => {
    if (!tab.requiredRole) return true; // 권한 제한이 없는 탭
    
    if (tab.requiredRole === 'ROOT') {
      return isRoot();
    }
    
    if (tab.requiredRole === 'ROOT_OR_ADMIN') {
      return isRootOrAdmin();
    }
    
    return false;
  });

  // 센서 목록에서 온 경우 센서 관리 탭으로 이동
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // 권한이 없는 탭에 접근하려고 할 때 첫 번째 접근 가능한 탭으로 리다이렉트
  useEffect(() => {
    const currentTab = allTabs.find(tab => tab.id === activeTab);
    if (currentTab && currentTab.requiredRole) {
      let hasAccess = false;
      
      if (currentTab.requiredRole === 'ROOT') {
        hasAccess = isRoot();
      } else if (currentTab.requiredRole === 'ROOT_OR_ADMIN') {
        hasAccess = isRootOrAdmin();
      }
      
      if (!hasAccess && tabs.length > 0) {
        setActiveTab(tabs[0].id);
      }
    }
  }, [activeTab, tabs]);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="p-1">
      <div className="modern-card">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-[15px] transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'border-[#494FA2] text-[#494FA2] dark:text-brand-main'
                    : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:border-gray-300 dark:hover:border-neutral-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {ActiveComponent && <ActiveComponent onTabChange={setActiveTab} />}
        </div>
      </div>
    </div>
  );
};

export default Setting;