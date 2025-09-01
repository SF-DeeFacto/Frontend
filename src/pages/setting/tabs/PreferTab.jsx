import React, { useState } from 'react';

const PreferTab = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    autoRefresh: true,
    theme: 'light',
    language: 'ko',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY-MM-DD'
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h4 className="text-lg font-medium text-gray-900 mb-4">환경설정</h4> */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">알림</h5>
              <p className="text-sm text-gray-500">알림 및 경고 메시지 수신</p>
            </div>
            <button
              onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                preferences.notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">테마</h5>
              <p className="text-sm text-gray-500">선호하는 테마 선택</p>
            </div>
            <select
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="light">라이트</option>
              <option value="dark">다크</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">언어</h5>
              <p className="text-sm text-gray-500">언어 선택</p>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>

        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferTab;
