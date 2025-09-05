import React, { useState, useEffect } from 'react';

const ThresholdRecommendationModal = ({ isOpen, onClose, onApprove }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState(new Set());

  // AI 추천 데이터 로드 (더미 데이터)
  useEffect(() => {
    if (isOpen) {
      const dummyRecommendations = [
        {
          id: 'rec-001',
          sensorId: 'esd-001',
          sensorType: 'electrostatic',
          zoneId: 'a01',
          current: { warningLow: null, warningHigh: 80.0, alertLow: null, alertHigh: 100.0 },
          recommended: { warningLow: null, warningHigh: 75.0, alertLow: null, alertHigh: 95.0 },
          reason: '최근 3개월 ESD 데이터 분석 결과, 현재 설정된 임계치가 너무 높아 불필요한 알람이 발생하고 있습니다. 권장 임계치로 조정하면 알람 정확도가 15% 향상됩니다.',
          confidence: 92,
          basedOnData: '3개월 (2,160시간)',
          expectedImprovement: '알람 정확도 15% 향상, 허위 알람 23% 감소'
        },
        {
          id: 'rec-002',
          sensorId: 'temp-001',
          sensorType: 'temperature',
          zoneId: 'a01',
          current: { warningLow: 18.0, warningHigh: 25.0, alertLow: 15.0, alertHigh: 30.0 },
          recommended: { warningLow: 20.0, warningHigh: 28.0, alertLow: 17.0, alertHigh: 32.0 },
          reason: '계절별 온도 변화 패턴을 분석한 결과, 현재 임계치가 계절적 변동을 충분히 고려하지 못하고 있습니다. 조정된 임계치는 계절 변화에 더 적응적입니다.',
          confidence: 87,
          basedOnData: '6개월 (4,320시간)',
          expectedImprovement: '계절별 적응성 향상, 예측 정확도 12% 증가'
        },
        {
          id: 'rec-003',
          sensorId: 'humid-001',
          sensorType: 'humidity',
          zoneId: 'a02',
          current: { warningLow: 40.0, warningHigh: 60.0, alertLow: 30.0, alertHigh: 70.0 },
          recommended: { warningLow: 35.0, warningHigh: 65.0, alertLow: 25.0, alertHigh: 75.0 },
          reason: '해당 구역의 습도 패턴이 다른 구역과 상이한 특성을 보입니다. 구역별 최적화된 임계치 적용으로 모니터링 효율성을 높일 수 있습니다.',
          confidence: 89,
          basedOnData: '4개월 (2,880시간)',
          expectedImprovement: '구역별 최적화로 모니터링 효율 18% 향상'
        }
      ];
      setRecommendations(dummyRecommendations);
    }
  }, [isOpen]);

  // 추천 선택/해제
  const toggleRecommendation = (recId) => {
    const newSelected = new Set(selectedRecommendations);
    if (newSelected.has(recId)) {
      newSelected.delete(recId);
    } else {
      newSelected.add(recId);
    }
    setSelectedRecommendations(newSelected);
  };

  // 선택된 추천 승인
  const handleApprove = () => {
    const selectedRecs = recommendations.filter(rec => selectedRecommendations.has(rec.id));
    onApprove(selectedRecs);
    setSelectedRecommendations(new Set());
    onClose();
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* 모달 컨테이너 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* 헤더 */}
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                AI 추천 임계치
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              AI가 분석한 데이터를 바탕으로 최적화된 임계치를 제안합니다. 원하는 추천을 선택하여 승인할 수 있습니다.
            </p>
          </div>

          {/* 컨텐츠 */}
          <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">현재 추천할 임계치가 없습니다.</div>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.id} 
                    className={`border rounded-lg p-4 ${
                      selectedRecommendations.has(rec.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRecommendations.has(rec.id)}
                          onChange={() => toggleRecommendation(rec.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {rec.sensorId} - {rec.sensorType} ({rec.zoneId.toUpperCase()})
                          </h4>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs text-gray-500">신뢰도: </span>
                            <span className="text-xs font-medium text-green-600">{rec.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 임계치 비교 */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">현재 임계치</h5>
                        <div className="bg-gray-100 p-3 rounded text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>경고L: {rec.current.warningLow !== null ? rec.current.warningLow : '-'}</div>
                            <div>경고H: {rec.current.warningHigh !== null ? rec.current.warningHigh : '-'}</div>
                            <div>초과L: {rec.current.alertLow !== null ? rec.current.alertLow : '-'}</div>
                            <div>초과H: {rec.current.alertHigh !== null ? rec.current.alertHigh : '-'}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">추천 임계치</h5>
                        <div className="bg-green-100 p-3 rounded text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>경고L: {rec.recommended.warningLow !== null ? rec.recommended.warningLow : '-'}</div>
                            <div>경고H: {rec.recommended.warningHigh !== null ? rec.recommended.warningHigh : '-'}</div>
                            <div>초과L: {rec.recommended.alertLow !== null ? rec.recommended.alertLow : '-'}</div>
                            <div>초과H: {rec.recommended.alertHigh !== null ? rec.recommended.alertHigh : '-'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 추천 이유 */}
                    <div className="mt-4">
                      <h5 className="text-xs font-medium text-gray-700 mb-1">추천 이유</h5>
                      <p className="text-xs text-gray-600">{rec.reason}</p>
                    </div>

                    {/* 추가 정보 */}
                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">분석 기간:</span> {rec.basedOnData}
                      </div>
                      <div>
                        <span className="font-medium">예상 효과:</span> {rec.expectedImprovement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedRecommendations.size}개 추천 선택됨
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                취소
              </button>
              <button
                onClick={handleApprove}
                disabled={selectedRecommendations.size === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  selectedRecommendations.size === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                선택된 추천 승인 ({selectedRecommendations.size})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdRecommendationModal;
