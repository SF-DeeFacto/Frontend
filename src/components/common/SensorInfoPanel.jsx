import React from 'react';
import { getStatusColor, getStatusEmoji, getStatusText, getSensorTypeFromName, getSensorTypeMapping } from '../../config/sensorConfig';
import { COLORS } from '../../config/constants';
import { SENSOR_STATUS } from '../../config/sensorConfig';

const SensorInfoPanel = ({ selectedObject, onClose }) => {
  if (!selectedObject) return null;


  return (
    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-2xl z-50 min-w-80 max-w-96 backdrop-blur-sm border border-gray-700">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(selectedObject.status)}`}
            style={{ 
              backgroundColor: selectedObject.status === 'normal' || selectedObject.status === SENSOR_STATUS.GREEN ? COLORS.SUCCESS :
                              selectedObject.status === 'warning' || selectedObject.status === SENSOR_STATUS.YELLOW ? COLORS.WARNING :
                              selectedObject.status === 'error' || selectedObject.status === SENSOR_STATUS.RED ? COLORS.DANGER :
                              selectedObject.status === 'unknown' || selectedObject.status === SENSOR_STATUS.DISCONNECTED ? COLORS.SECONDARY :
                              COLORS.INFO // 기본값 (연결중)
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
                {getSensorTypeMapping(getSensorTypeFromName(selectedObject.name))}센서
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
      
      {/* 액션 버튼 제거됨: 상세 데이터 보기 기능 미사용 */}
    </div>
  );
};

export default SensorInfoPanel;
