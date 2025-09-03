import React from 'react';
import { getStatusColor, getStatusEmoji, getStatusText } from '../../utils/sensorUtils';

const SensorInfoPanel = ({ selectedObject, onClose }) => {
  if (!selectedObject) return null;

  // 디버깅: 센서 상태 확인
  console.log('SensorInfoPanel - selectedObject:', selectedObject);
  console.log('SensorInfoPanel - status:', selectedObject.status);
  console.log('SensorInfoPanel - statusColor:', getStatusColor(selectedObject.status));

  return (
    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-2xl z-50 min-w-80 max-w-96 backdrop-blur-sm border border-gray-700">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(selectedObject.status)}`}
            style={{ 
              backgroundColor: selectedObject.status === 'normal' || selectedObject.status === 'GREEN' ? '#10b981' :
                              selectedObject.status === 'warning' || selectedObject.status === 'YELLOW' ? '#f59e0b' :
                              selectedObject.status === 'error' || selectedObject.status === 'RED' ? '#ef4444' :
                              selectedObject.status === 'unknown' || selectedObject.status === 'DISCONNECTED' ? '#6b7280' :
                              '#3b82f6' // 기본값 (연결중)
            }}
          ></div>
          <span className="text-sm font-medium text-gray-300">
            {selectedObject.isSensor ? '센서 정보' : '객체 정보'}
          </span>
          {selectedObject.sensorData && (
            <span className="text-lg">{getStatusEmoji(selectedObject.status)}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* 내용 */}
      <div className="p-4 space-y-4">
        <div>
          {selectedObject.isSensor && (
            <div className="space-y-2">
              {/* 센서 타입 한글 이름 */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {selectedObject.name?.includes('TEMP') ? '온도센서' :
                 selectedObject.name?.includes('HUM') ? '습도센서' :
                 selectedObject.name?.includes('ESD') ? '정전기센서' :
                 selectedObject.name?.includes('LPM') ? '먼지센서' :
                 selectedObject.name?.includes('WD') ? '풍향센서' :
                 '센서'}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">센서 ID:</span>
                <span className="text-sm text-white">{selectedObject.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">상태:</span>
                <span className="text-sm text-white">{getStatusText(selectedObject.status)}</span>
              </div>
              {selectedObject.sensorData && (
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">센서 데이터:</div>
                  <div className="text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    {JSON.stringify(selectedObject.sensorData, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 액션 버튼 */}
      {selectedObject.isSensor && (
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium">
            상세 데이터 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default SensorInfoPanel;
