/**
 * SSE 모킹 사용 예제 컴포넌트
 * 실제 React 컴포넌트에서 SSE 모킹을 사용하는 방법을 보여줍니다.
 */

import React, { useState, useEffect } from 'react';
import { 
  useMainSSEMock, 
  useZoneSSEMock, 
  useNotificationSSEMock,
  useMockServerStatus,
  useMockServerControl 
} from './useSSEMock.js';

// 메인 대시보드 예제
export const MainDashboardExample = () => {
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
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">메인 대시보드 (SSE 모킹)</h2>
      <div className="mb-2">
        <span className={`px-2 py-1 rounded text-sm ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </span>
      </div>
      
      {error && (
        <div className="text-red-600 mb-4">오류: {error.message}</div>
      )}
      
      {zoneData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {zoneData.data?.map((zone) => (
            <div key={zone.zoneName} className="p-3 border rounded">
              <h3 className="font-semibold">{zone.zoneName}</h3>
              <p className={`text-sm ${
                zone.status === 'NORMAL' ? 'text-green-600' :
                zone.status === 'WARNING' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {zone.status}
              </p>
              <p className="text-xs text-gray-500">
                센서: {zone.sensorCount}개
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Zone 상세 예제
export const ZoneDetailExample = ({ zoneId = 'A01' }) => {
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
    return <div>Zone {zoneId} 로딩 중...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Zone {zoneId} 상세 (SSE 모킹)</h2>
      <div className="mb-2">
        <span className={`px-2 py-1 rounded text-sm ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </span>
      </div>
      
      {error && (
        <div className="text-red-600 mb-4">오류: {error.message}</div>
      )}
      
      {sensorData && sensorData.data?.[0]?.sensors && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorData.data[0].sensors.map((sensor) => (
            <div key={sensor.sensorId} className="p-3 border rounded">
              <h3 className="font-semibold">{sensor.sensorId}</h3>
              <p className="text-sm text-gray-600">{sensor.sensorType}</p>
              <p className={`text-sm ${
                sensor.sensorStatus === 'NORMAL' ? 'text-green-600' :
                sensor.sensorStatus === 'WARNING' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {sensor.sensorStatus}
              </p>
              {sensor.values && (
                <div className="text-xs text-gray-500 mt-1">
                  {sensor.sensorType === 'particle' ? (
                    <div>
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

// 알림 예제
export const NotificationExample = () => {
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
    return <div>알림 로딩 중...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">실시간 알림 (SSE 모킹)</h2>
      <div className="mb-2">
        <span className={`px-2 py-1 rounded text-sm ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </span>
      </div>
      
      {error && (
        <div className="text-red-600 mb-4">오류: {error.message}</div>
      )}
      
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div key={notification.notiId} className={`p-3 border-l-4 ${
            notification.notiType === 'ALERT' ? 'border-red-500 bg-red-50' :
            notification.notiType === 'WARNING' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  Zone: {notification.zoneId} | {notification.timestamp}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                notification.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                notification.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {notification.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 모킹 서버 제어 패널
export const MockServerControlPanel = () => {
  const { isEnabled, enable, disable } = useMockServerControl();
  const status = useMockServerStatus();

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">SSE 모킹 서버 제어</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded text-sm ${
            isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isEnabled ? '활성화됨' : '비활성화됨'}
          </span>
          
          <button
            onClick={isEnabled ? disable : enable}
            className={`px-4 py-2 rounded text-sm font-medium ${
              isEnabled 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isEnabled ? '비활성화' : '활성화'}
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>상태: {status.message}</p>
          <p>엔드포인트: {status.endpoints.length}개</p>
        </div>
      </div>
    </div>
  );
};

// 통합 예제 컴포넌트
export const SSEMockDemo = () => {
  const [selectedZone, setSelectedZone] = useState('A01');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">SSE 모킹 시스템 데모</h1>
      
      <MockServerControlPanel />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MainDashboardExample />
        <ZoneDetailExample zoneId={selectedZone} />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Zone 선택:</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {['A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'].map(zone => (
            <option key={zone} value={zone}>Zone {zone}</option>
          ))}
        </select>
      </div>
      
      <NotificationExample />
    </div>
  );
};

export default SSEMockDemo;
