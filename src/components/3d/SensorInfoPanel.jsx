import React from 'react';

// 센서 정보 패널 컴포넌트
function SensorInfoPanel({ selectedObject, onClose }) {
  if (!selectedObject) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-2xl z-50 min-w-80 max-w-96 backdrop-blur-sm border border-gray-700">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            selectedObject.status === 'normal' ? 'bg-green-500' :
            selectedObject.status === 'warning' ? 'bg-yellow-500' :
            selectedObject.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-300">
            {selectedObject.isSensor ? '센서 정보' : '객체 정보'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* 내용 */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{selectedObject.name}</h3>
          {selectedObject.isSensor && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">상태:</span>
                <span className={`text-sm font-medium ${
                  selectedObject.status === 'normal' ? 'text-green-400' :
                  selectedObject.status === 'warning' ? 'text-yellow-400' :
                  selectedObject.status === 'error' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {selectedObject.status === 'normal' ? '정상' :
                   selectedObject.status === 'warning' ? '경고' :
                   selectedObject.status === 'error' ? '오류' : '알 수 없음'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">센서 ID:</span>
                <span className="text-sm text-white">{selectedObject.id}</span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">온도</span>
                    <div className="text-white font-medium">23.5°C</div>
                  </div>
                  <div>
                    <span className="text-gray-400">습도</span>
                    <div className="text-white font-medium">45%</div>
                  </div>
                  <div>
                    <span className="text-gray-400">먼지농도</span>
                    <div className="text-white font-medium">12 μg/m³</div>
                  </div>
                  <div>
                    <span className="text-gray-400">마지막 업데이트</span>
                    <div className="text-white font-medium">14:25</div>
                  </div>
                </div>
              </div>
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
}

export default SensorInfoPanel;
