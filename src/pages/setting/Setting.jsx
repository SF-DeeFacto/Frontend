import React, { useState } from 'react';

const Setting = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoRefresh: true,
    theme: 'light',
    language: 'ko'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
              <p className="text-sm text-gray-500">Receive alerts and notifications</p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Auto Refresh</h4>
              <p className="text-sm text-gray-500">Automatically refresh data</p>
            </div>
            <button
              onClick={() => handleSettingChange('autoRefresh', !settings.autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Theme</h4>
              <p className="text-sm text-gray-500">Choose your preferred theme</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Language</h4>
              <p className="text-sm text-gray-500">Select your language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting; 