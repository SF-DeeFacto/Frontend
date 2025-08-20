import React, { useState } from 'react';
import Equipset from './tabs/Equipset';
import Userset from './tabs/Userset';
import PwudTab from './tabs/PwudTab';
import PreferTab from './tabs/PreferTab';
import ProfileTab from './tabs/ProfileTab';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: '프로필', component: ProfileTab },
    { id: 'prefer', name: '환경설정', component: PreferTab },
    { id: 'pwud', name: '비밀번호 변경', component: PwudTab },
    { id: 'userset', name: '회원정보 관리', component: Userset },
    { id: 'equipset', name: '센서 관리', component: Equipset }
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default Setting;