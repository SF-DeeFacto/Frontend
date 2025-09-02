import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Equipset from './tabs/Equipset';
import Userset from './tabs/Userset';
import PwudTab from './tabs/PwudTab';
import PreferTab from './tabs/PreferTab';
import ProfileTab from './tabs/ProfileTab';
import SensorListTab from './tabs/SensorListTab';
import AIRecommend from './tabs/AIRecommend';

const Setting = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  // 센서 목록에서 온 경우 센서 관리 탭으로 이동
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const tabs = [
    { id: 'profile', name: '프로필', component: ProfileTab },
    { id: 'prefer', name: '환경설정', component: PreferTab },
    { id: 'pwud', name: '비밀번호 변경', component: PwudTab },
    { id: 'userset', name: '회원정보 관리', component: Userset },
    { id: 'sensorlist', name: '센서 목록', component: SensorListTab },
    { id: 'equipset', name: '센서 관리', component: Equipset },
    { id: 'airecommendation', name: 'AI 추천 관리', component: AIRecommend }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-[15px] ${
                  activeTab === tab.id
                    ? 'border-[#494FA2] text-[#494FA2]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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