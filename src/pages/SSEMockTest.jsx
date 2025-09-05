/**
 * SSE 모킹 테스트 페이지
 * 실제 UI에서 SSE 모킹 데이터를 확인할 수 있는 페이지
 */

import React, { useState, useEffect } from 'react';
import { 
  useMainSSEMock, 
  useZoneSSEMock, 
  useNotificationSSEMock,
  useMockServerStatus,
  useMockServerControl 
} from '../../dummy/useSSEMock.js';

// 메인 대시보드 컴포넌트
const MainDashboardTest = () => {
  const [zoneData, setZoneData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastMessage, error } = useMainSSEMock({
    onMessage: (data) => {
      console.log('메인 대시보드 데이터 수신:', data);
      setZoneData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('메인 대시보드 오류:', error);
      setIsLoading(false);
    },
    onOpen: () => {
      console.log('메인 대시보드 연결됨');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">메인 대시보드 (SSE 모킹)</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
          <div className="text-red-800 dark:text-red-200">오류: {error.message}</div>
        </div>
      )}
      
      {zoneData && zoneData.data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {zoneData.data.map((zone) => (
            <div key={zone.zoneName} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">{zone.zoneName}</h3>
              <p className={`text-sm font-medium ${
                zone.status === 'NORMAL' ? 'text-green-600 dark:text-green-400' :
                zone.status === 'WARNING' ? 'text-yellow-600 dark:text-yellow-400' :
                zone.status === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {zone.status}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                센서: {zone.sensorCount}개 | 알림: {zone.alertCount}개
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(zone.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Zone 상세 컴포넌트
const ZoneDetailTest = ({ zoneId = 'A01' }) => {
  const [sensorData, setSensorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastMessage, error } = useZoneSSEMock(zoneId, {
    onMessage: (data) => {
      console.log(`Zone ${zoneId} 데이터 수신:`, data);
      setSensorData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error(`Zone ${zoneId} 오류:`, error);
      setIsLoading(false);
    },
    onOpen: () => {
      console.log(`Zone ${zoneId} 연결됨`);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Zone {zoneId} 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Zone {zoneId} 상세 (SSE 모킹)</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
          <div className="text-red-800 dark:text-red-200">오류: {error.message}</div>
        </div>
      )}
      
      {sensorData && sensorData.data?.[0]?.sensors && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorData.data[0].sensors.map((sensor) => (
            <div key={sensor.sensorId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{sensor.sensorId}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{sensor.sensorType}</p>
              <p className={`text-sm font-medium ${
                sensor.sensorStatus === 'NORMAL' ? 'text-green-600 dark:text-green-400' :
                sensor.sensorStatus === 'WARNING' ? 'text-yellow-600 dark:text-yellow-400' :
                sensor.sensorStatus === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {sensor.sensorStatus}
              </p>
              {sensor.values && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {sensor.sensorType === 'particle' ? (
                    <div className="space-y-1">
                      <div>0.1μm: {sensor.values['0.1']}</div>
                      <div>0.3μm: {sensor.values['0.3']}</div>
                      <div>0.5μm: {sensor.values['0.5']}</div>
                    </div>
                  ) : (
                    <div>
                      값: {sensor.values.value} {sensor.values.unit || ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 알림 컴포넌트
const NotificationTest = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastMessage, error } = useNotificationSSEMock({
    onMessage: (data) => {
      console.log('알림 데이터 수신:', data);
      if (data.data) {
        setNotifications(prev => [...data.data, ...prev].slice(0, 10)); // 최대 10개 유지
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('알림 오류:', error);
      setIsLoading(false);
    },
    onOpen: () => {
      console.log('알림 연결됨');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">알림 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">실시간 알림 (SSE 모킹)</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
          <div className="text-red-800 dark:text-red-200">오류: {error.message}</div>
        </div>
      )}
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            알림이 없습니다
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.notiId} className={`p-4 border-l-4 rounded-r-lg ${
              notification.notiType === 'ALERT' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
              notification.notiType === 'WARNING' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
              'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Zone: {notification.zoneId} | {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  notification.priority === 'URGENT' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  notification.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {notification.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 모킹 서버 제어 패널
const MockServerControlPanel = () => {
  const { isEnabled, enable, disable } = useMockServerControl();
  const status = useMockServerStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">SSE 모킹 서버 제어</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isEnabled 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {isEnabled ? '활성화됨' : '비활성화됨'}
          </span>
          
          <button
            onClick={isEnabled ? disable : enable}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isEnabled 
                ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' 
                : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            }`}
          >
            {isEnabled ? '비활성화' : '활성화'}
          </button>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>상태: {status.message}</p>
          <p>엔드포인트: {status.endpoints.length}개</p>
        </div>
      </div>
    </div>
  );
};

// 메인 테스트 페이지
const SSEMockTest = () => {
  const [selectedZone, setSelectedZone] = useState('A01');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">SSE 모킹 시스템 테스트</h1>
          <p className="text-gray-600 dark:text-gray-400">실시간 데이터를 확인할 수 있습니다</p>
        </div>
        
        <MockServerControlPanel />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MainDashboardTest />
          <ZoneDetailTest zoneId={selectedZone} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Zone 선택</h2>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'].map(zone => (
              <option key={zone} value={zone}>Zone {zone}</option>
            ))}
          </select>
        </div>
        
        <NotificationTest />
      </div>
    </div>
  );
};

export default SSEMockTest;
