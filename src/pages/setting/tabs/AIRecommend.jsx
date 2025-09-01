import React, { useState, useEffect } from 'react';

const AIRecommend = () => {
  // 월별 AI 추천 데이터
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [filterZone, setFilterZone] = useState('all');
  const [filterSensorType, setFilterSensorType] = useState('all');


  // 더미 데이터
  useEffect(() => {
    const dummyRecommendations = [
      {
        id: 1,
        zoneId: "a",
        sensorType: "temperature",
        warningLow: 18,
        warningHigh: 25,
        alertLow: 16,
        alertHigh: 28,
        recommendedAt: "2025-01-15T09:00:00",
        appliedStatus: false,
        appliedAt: null,
        currentThresholdId: 1,
        currentWarningLow: 20,
        currentWarningHigh: 22,
        currentAlertLow: 19,
        currentAlertHigh: 24,
        reason: "겨울철 온도 변화 패턴을 고려한 조정"
      },
      {
        id: 2,
        zoneId: "a",
        sensorType: "humidity",
        warningLow: 35,
        warningHigh: 55,
        alertLow: 30,
        alertHigh: 60,
        recommendedAt: "2025-01-15T09:00:00",
        appliedStatus: false,
        appliedAt: null,
        currentThresholdId: 2,
        currentWarningLow: 40,
        currentWarningHigh: 50,
        currentAlertLow: 32,
        currentAlertHigh: 52,
        reason: "실내 습도 최적화를 위한 범위 확장"
      },
      {
        id: 3,
        zoneId: "b",
        sensorType: "electrostatic",
        warningLow: null,
        warningHigh: 80,
        alertLow: null,
        alertHigh: 100,
        recommendedAt: "2025-01-15T09:00:00",
        appliedStatus: true,
        appliedAt: "2025-01-16T14:30:00",
        currentThresholdId: 3,
        currentWarningLow: null,
        currentWarningHigh: 75,
        currentAlertLow: null,
        currentAlertHigh: 95,
        reason: "ESD 위험도 증가에 따른 임계치 상향"
      },
      {
        id: 4,
        zoneId: "c",
        sensorType: "particle_0_1um",
        warningLow: null,
        warningHigh: 1000,
        alertLow: null,
        alertHigh: 1100,
        recommendedAt: "2024-12-15T09:00:00",
        appliedStatus: false,
        appliedAt: null,
        currentThresholdId: 4,
        currentWarningLow: null,
        currentWarningHigh: 1100,
        currentAlertLow: null,
        currentAlertHigh: 1200,
        reason: "미세먼지 농도 개선에 따른 기준 강화"
      }
    ];
    setRecommendations(dummyRecommendations);
    setFilteredRecommendations(dummyRecommendations);
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = recommendations;

    // 월별 필터 (recommendedAt에서 월 추출)
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(rec => {
        const recMonth = rec.recommendedAt.substring(0, 7); // YYYY-MM 형태로 추출
        return recMonth === selectedMonth;
      });
    }

    // 구역 필터
    if (filterZone !== 'all') {
      filtered = filtered.filter(rec => rec.zoneId === filterZone);
    }

    // 센서 타입 필터
    if (filterSensorType !== 'all') {
      filtered = filtered.filter(rec => rec.sensorType === filterSensorType);
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, selectedMonth, filterZone, filterSensorType]);

  // 승인 처리
  const handleApprove = (id) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id 
        ? { ...rec, appliedStatus: true, appliedAt: new Date().toISOString() }
        : rec
    ));
    alert('AI 추천이 승인되어 적용되었습니다.');
  };

  // 거부 처리
  const handleReject = (id) => {
    // 거부는 단순히 목록에서 제거 (또는 별도 상태로 관리)
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    alert('AI 추천이 거부되었습니다.');
  };

  // 일괄 승인
  const handleBulkApprove = () => {
    // 미적용된 추천만 필터링
    const unappliedRecommendations = filteredRecommendations.filter(rec => !rec.appliedStatus);
    
    if (unappliedRecommendations.length === 0) {
      alert('승인할 추천이 없습니다. (이미 적용된 추천은 제외됩니다)');
      return;
    }

    // 월별 유효성 검사 - 모든 추천이 같은 월인지 확인
    const uniqueMonths = [...new Set(unappliedRecommendations.map(rec => rec.recommendedAt.substring(0, 7)))];
    
    if (uniqueMonths.length > 1) {
      alert(`일괄 승인은 동일한 월의 추천만 가능합니다.\n\n현재 선택된 추천의 월: ${uniqueMonths.join(', ')}\n\n월별 필터를 사용하여 특정 월만 선택한 후 다시 시도해주세요.`);
      return;
    }

    // 승인할 항목들의 상세 정보 생성
    const approvalList = unappliedRecommendations.map(rec => {
      const sensorName = sensorTypeMapping[rec.sensorType] || rec.sensorType;
      const zoneName = rec.zoneId.toUpperCase();
      const month = rec.recommendedAt.substring(0, 7);
      return `• ${month} ${zoneName}구역 ${sensorName} 센서`;
    }).join('\n');

    const confirmMessage = `다음 ${unappliedRecommendations.length}개의 AI 추천을 일괄 승인하시겠습니까?\n\n${approvalList}\n\n승인 후에는 해당 임계치가 자동으로 적용됩니다.`;

    if (window.confirm(confirmMessage)) {
      const allIds = unappliedRecommendations.map(rec => rec.id);
      
      setRecommendations(prev => prev.map(rec => 
        allIds.includes(rec.id)
          ? { ...rec, appliedStatus: true, appliedAt: new Date().toISOString() }
          : rec
      ));
      alert(`${allIds.length}개의 AI 추천이 일괄 승인되어 적용되었습니다.`);
    }
  };

  // 센서 타입별 한글 매핑
  const sensorTypeMapping = {
    'electrostatic': 'ESD',
    'temperature': '온도',
    'humidity': '습도',
    'winddirection': '풍향',
    'particle_0_1um': '미세먼지 0.1μm',
    'particle_0_3um': '미세먼지 0.3μm',
    'particle_0_5um': '미세먼지 0.5μm'
  };



  // 날짜 포맷팅
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 임계치 값 표시
  const formatThresholdValue = (value) => {
    return value !== null ? value.toString() : '-';
  };

  return (
    <div className="p-2">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-900">AI 추천 임계치 관리</h4>
        <button
          onClick={handleBulkApprove}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={filteredRecommendations.filter(rec => !rec.appliedStatus).length === 0}
        >
          전체 일괄 승인
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 월 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월별 조회
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="2025-01">2025년 1월</option>
              <option value="2024-12">2024년 12월</option>
              <option value="2024-11">2024년 11월</option>
            </select>
          </div>

          {/* 구역 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              구역
            </label>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="a">Zone A</option>
              <option value="b">Zone B</option>
              <option value="c">Zone C</option>
            </select>
          </div>

          {/* 센서 타입 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              센서 종류
            </label>
            <select
              value={filterSensorType}
              onChange={(e) => setFilterSensorType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="temperature">온도</option>
              <option value="humidity">습도</option>
              <option value="electrostatic">ESD</option>
              <option value="winddirection">풍향</option>
              <option value="particle_0_1um">미세먼지 0.1μm</option>
              <option value="particle_0_3um">미세먼지 0.3μm</option>
              <option value="particle_0_5um">미세먼지 0.5μm</option>
            </select>
          </div>


        </div>

        {/* 결과 수 */}
        <div className="mt-4 text-sm text-gray-600">
          총 {filteredRecommendations.length}개의 AI 추천
        </div>
      </div>

      {/* AI 추천 목록 테이블 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">월</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서타입</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">현재 Warning<br/>Low/High</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">현재 Alert<br/>Low/High</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">추천 Warning<br/>Low/High</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">추천 Alert<br/>Low/High</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">추천 사유</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일시</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecommendations.map((rec) => (
                <tr key={rec.id} className={`hover:bg-gray-50 ${rec.appliedStatus ? 'bg-green-50' : ''}`}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.recommendedAt.substring(0, 7)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.zoneId.toUpperCase()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sensorTypeMapping[rec.sensorType] || rec.sensorType}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-center">
                    <div className="text-xs">
                      {formatThresholdValue(rec.currentWarningLow)} / {formatThresholdValue(rec.currentWarningHigh)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-center">
                    <div className="text-xs">
                      {formatThresholdValue(rec.currentAlertLow)} / {formatThresholdValue(rec.currentAlertHigh)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-center">
                    <div className={`text-xs font-medium ${rec.appliedStatus ? 'text-green-600' : 'text-blue-600'}`}>
                      {formatThresholdValue(rec.warningLow)} / {formatThresholdValue(rec.warningHigh)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-center">
                    <div className={`text-xs font-medium ${rec.appliedStatus ? 'text-green-600' : 'text-blue-600'}`}>
                      {formatThresholdValue(rec.alertLow)} / {formatThresholdValue(rec.alertHigh)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                    <div className="truncate" title={rec.reason}>
                      {rec.reason}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(rec.recommendedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {rec.appliedStatus ? (
                      <span className="text-green-600 text-sm font-medium">
                        적용됨
                      </span>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleApprove(rec.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(rec.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          거부
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 결과 메시지 */}
        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">검색 결과가 없습니다.</div>
            <div className="text-gray-400 text-sm mt-2">다른 검색 조건을 시도해보세요.</div>
          </div>
        )}
      </div>

      {/* 안내 문구 */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2">AI 추천 임계치 안내</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• AI는 월별로 센서 데이터를 분석하여 최적의 임계치를 추천합니다.</li>
          <li>• 승인된 추천은 자동으로  센서 임계치에 적용됩니다.</li>
          <li>• 일괄 승인은 현재 필터링된 모든 추천에 적용됩니다.</li>
          <li>• 개별 승인/거부도 가능합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default AIRecommend;
