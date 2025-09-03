import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const PreferTab = () => {
  const { theme, setThemeMode } = useTheme();
  const [preferences, setPreferences] = useState({
    notifications: true,
    autoRefresh: true,
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

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h4 className="text-lg font-medium text-gray-900 dark:text-neutral-100 mb-4">환경설정</h4> */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-neutral-100">알림</h5>
              <p className="text-sm text-gray-500 dark:text-neutral-400">알림 및 경고 메시지 수신</p>
            </div>
            <button
              onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                preferences.notifications ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                preferences.notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-neutral-100">테마</h5>
              <p className="text-sm text-gray-500 dark:text-neutral-400">선호하는 테마 선택</p>
            </div>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="light">라이트</option>
              <option value="dark">다크</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-neutral-100">언어</h5>
              <p className="text-sm text-gray-500 dark:text-neutral-400">언어 선택</p>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>

        </div>
        
        <div className="mt-6">
          <button className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-colors duration-200">
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferTab;
