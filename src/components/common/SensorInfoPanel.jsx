import React from 'react';
import { getStatusColor, getStatusEmoji, getStatusText, getSensorTypeFromName, getSensorTypeMapping, getSensorTypeConfig } from '../../config/sensorConfig';
import { COLORS } from '../../config/constants';
import { SENSOR_STATUS } from '../../config/sensorConfig';
import Text from './Text';

const SensorInfoPanel = ({ selectedObject, onClose }) => {
  if (!selectedObject) return null;

  return (
    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-2xl z-50 min-w-80 max-w-96 backdrop-blur-sm border border-gray-700">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div 
            className={`w-3 h-3 rounded-full ${getStatusColor(selectedObject.sensorData?.status || selectedObject.status)}`}
            style={{ 
              backgroundColor: (() => {
                const status = selectedObject.sensorData?.status || selectedObject.status;
                return status === 'normal' || status === SENSOR_STATUS.GREEN ? COLORS.SUCCESS :
                       status === 'warning' || status === SENSOR_STATUS.YELLOW ? COLORS.WARNING :
                       status === 'error' || status === SENSOR_STATUS.RED ? COLORS.ERROR :
                       status === 'unknown' || status === SENSOR_STATUS.DISCONNECTED ? COLORS.SECONDARY :
                       COLORS.INFO; // 기본값 (연결중)
              })()
            }}
          ></div>
          <Text variant="body" size="sm" weight="medium" color="neutral-300">
            {selectedObject.isSensor ? '센서 정보' : '객체 정보'}
          </Text>
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
          {selectedObject.isSensor ? (
            <div className="space-y-2">
              {/* 센서 타입 한글 이름 */}
              <Text variant="title" size="lg" weight="semibold" color="white" className="mb-2">
                {selectedObject.sensorData?.sensorType ? 
                  getSensorTypeMapping(selectedObject.sensorData.sensorType) + '센서' :
                  getSensorTypeMapping(getSensorTypeFromName(selectedObject.name)) + '센서'
                }
              </Text>
              <div className="flex justify-between items-center">
                <Text variant="body" size="sm" color="neutral-400">센서 ID:</Text>
                <Text variant="body" size="sm" color="white">
                  {selectedObject.sensorData?.sensorId || selectedObject.id || '알 수 없음'}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text variant="body" size="sm" color="neutral-400">상태:</Text>
                <Text variant="body" size="sm" color="white">
                  {selectedObject.sensorData?.status ? getStatusText(selectedObject.sensorData.status) : 
                   selectedObject.status ? getStatusText(selectedObject.status) : '알 수 없음'}
                </Text>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">센서 데이터:</div>
                {selectedObject.sensorData ? (
                  <div className="text-xs text-gray-300 bg-gray-800 p-3 rounded space-y-2">
                    {selectedObject.sensorData.val !== undefined && (
                      <div className="py-1">값: {selectedObject.sensorData.val} {getSensorTypeConfig(selectedObject.sensorData.sensorType?.toLowerCase())?.unit || ''}</div>
                    )}
                    {selectedObject.sensorData.val_0_1 !== undefined && (
                      <div className="py-1">0.1μm: {selectedObject.sensorData.val_0_1} μg/m³</div>
                    )}
                    {selectedObject.sensorData.val_0_3 !== undefined && (
                      <div className="py-1">0.3μm: {selectedObject.sensorData.val_0_3} μg/m³</div>
                    )}
                    {selectedObject.sensorData.val_0_5 !== undefined && (
                      <div className="py-1">0.5μm: {selectedObject.sensorData.val_0_5} μg/m³</div>
                    )}
                    {selectedObject.sensorData.timestamp && (
                      <div className="py-1">시간: {new Date(selectedObject.sensorData.timestamp).toLocaleString()}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 bg-gray-800 p-3 rounded">
                    센서 데이터 없음
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* 일반 객체 정보 */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {selectedObject.name || '객체'}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">ID:</span>
                <span className="text-sm text-white">{selectedObject.id || selectedObject.name}</span>
              </div>
              {selectedObject.status && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">상태:</span>
                  <span className="text-sm text-white">{getStatusText(selectedObject.status)}</span>
                </div>
              )}
              {selectedObject.type && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">타입:</span>
                  <span className="text-sm text-white">{selectedObject.type}</span>
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
