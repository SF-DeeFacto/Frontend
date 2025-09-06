import React, { useState, useEffect } from 'react';
import { aiRecommendService } from '../../../services/api/aiRecommend';

const AIRecommend = () => {
  // 상태 변수들
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [filterZone, setFilterZone] = useState('all');
  const [filterSensorType, setFilterSensorType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // 임계치 추천 데이터 로드
  const loadRecommendations = async () => {
    try {
      if (!loading) setLoading(true);
      setError(null);

      let recommendationsArray = [];

      // API 호출 시 월별 파라미터 전달
      const apiParams = {
        year: filterYear,
        month: filterMonth
      };

      if (filterStatus === 'all') {
        recommendationsArray = await aiRecommendService.getRecommendations(apiParams);
      } else if (filterStatus === 'APPROVED') {
        recommendationsArray = await aiRecommendService.getApprovedRecommendations(apiParams);
      } else if (filterStatus === 'REJECTED') {
        recommendationsArray = await aiRecommendService.getRejectedRecommendations(apiParams);
      } else if (filterStatus === 'PENDING') {
        recommendationsArray = await aiRecommendService.getRecommendationsByStatus(['PENDING'], apiParams);
      }

      // 전체 데이터 저장
      setRecommendations(recommendationsArray);
      setFilteredRecommendations(recommendationsArray);
    } catch (err) {
      console.error('임계치 추천 데이터 로드 실패:', err);
      setError(`API 연결에 실패했습니다: ${err.message}`);
      setRecommendations([]);
      setFilteredRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // 승인 처리
  const handleApprove = async (id) => {
    try {
      console.log('승인 처리 시작:', id);
      setLoading(true);
      
      const result = await aiRecommendService.updateRecommendationStatus(id, 'APPROVE');
      console.log('승인 API 결과:', result);
      
      alert('임계치 추천이 승인되어 적용되었습니다.');
      
      // 데이터 다시 로드
      await loadRecommendations();
      console.log('데이터 재로드 완료');
      
    } catch (err) {
      console.error('승인 처리 실패:', err);
      alert(`승인 처리에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 거부 처리
  const handleReject = async (id) => {
    // 확인 메시지 표시
    const confirmed = window.confirm('정말로 이 임계치 추천을 거부하시겠습니까?');
    if (!confirmed) {
      return; // 사용자가 취소한 경우 함수 종료
    }

    try {
      console.log('거부 처리 시작:', id);
      setLoading(true);
      
      const result = await aiRecommendService.updateRecommendationStatus(id, 'REJECT');
      console.log('거부 API 결과:', result);
      
      alert('임계치 추천이 거부되었습니다.');
      
      // 데이터 다시 로드
      await loadRecommendations();
      console.log('데이터 재로드 완료');
      
    } catch (err) {
      console.error('거부 처리 실패:', err);
      alert(`거부 처리에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 필터링 로직
  useEffect(() => {
    let filtered = recommendations;

    // 구역 필터
    if (filterZone !== 'all') {
      filtered = filtered.filter(rec => rec.zoneId === filterZone);
    }

    // 센서 타입 필터
    if (filterSensorType !== 'all') {
      filtered = filtered.filter(rec => rec.sensorType === filterSensorType);
    }

    // 월별 필터 (년도/월 기준)
    if (filterYear && filterMonth) {
      filtered = filtered.filter(rec => {
        if (!rec.recommendedAt) return false;
        
        const recDate = new Date(rec.recommendedAt);
        const recYear = recDate.getFullYear().toString();
        const recMonth = (recDate.getMonth() + 1).toString().padStart(2, '0');
        
        return recYear === filterYear && recMonth === filterMonth;
      });
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, filterZone, filterSensorType, filterYear, filterMonth]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadRecommendations();
  }, [filterStatus, filterYear, filterMonth]);

  // 달력 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // 센서 타입 매핑
  const sensorTypeMapping = {
    'temperature': '온도',
    'humidity': '습도',
    'winddirection': '풍향',
    'electrostatic': '정전기',
    'particle_0_1um': '0.1μm 파티클',
    'particle_0_3um': '0.3μm 파티클',
    'particle_0_5um': '0.5μm 파티클'
  };

  // 날짜 포맷팅 함수
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    const year = date.getFullYear().toString().slice(-2); // 뒤 2자리만
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}. ${month}. ${day} T${hours}:${minutes}`;
  };

  // 임계치 값 포맷팅 함수
  const formatThresholdValue = (value) => {
    if (value === null || value === undefined) return '-';
    return value.toString();
  };

  // 현재 선택된 년월을 YY/MM 형태로 포맷팅
  const formatSelectedDate = () => {
    const year = filterYear.slice(); // 아무것도 설정 안하면 4자리
    const month = filterMonth;
    return `${year}/${month}`;
  };

  // 달력에서 년월 선택 시 호출
  const handleDateSelect = (year, month) => {
    setFilterYear(year.toString());
    setFilterMonth(month.toString().padStart(2, '0'));
    setShowDatePicker(false);
  };


  // 로딩 상태
  if (loading && recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#494FA2]"></div>
        <span className="ml-3 text-gray-600">임계치 추천 데이터를 불러오는 중...</span>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('임계치 추천 렌더링:', {
    recommendationsLength: recommendations.length,
    filteredRecommendationsLength: filteredRecommendations.length,
    selectedRecommendation,
    loading,
    error
  });

  return (
    <div>
      {/* 필터 영역 */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {/* 년월 선택기 */}
          <div className="relative date-picker-container">
            <label className="block text-sm font-medium text-gray-700 mb-2">조회 기간</label>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#494FA2] focus:border-transparent text-left flex items-center justify-between"
            >
              <span className="text-gray-900">{formatSelectedDate()}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </button>
            
            {/* 달력 드롭다운 */}
            {showDatePicker && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-4">
                  {/* 년도 선택 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">년도</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <button
                            key={year}
                            onClick={() => setFilterYear(year.toString())}
                            className={`px-3 py-2 text-sm rounded-md ${
                              filterYear === year.toString()
                                ? 'bg-[#494FA2] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* 월 선택 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">월</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = i + 1;
                        const monthStr = month.toString().padStart(2, '0');
                        return (
                          <button
                            key={month}
                            onClick={() => setFilterMonth(monthStr)}
                            className={`px-3 py-2 text-sm rounded-md ${
                              filterMonth === monthStr
                                ? 'bg-[#494FA2] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {month}월
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* 확인 버튼 */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 bg-[#494FA2] text-white text-sm font-medium rounded-md hover:bg-[#3d3f8a]"
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 구역 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">구역</label>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#494FA2] focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="a">A구역</option>
              <option value="b">B구역</option>
              <option value="c">C구역</option>
            </select>
          </div>

          {/* 센서 종류 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">센서 종류</label>
            <select
              value={filterSensorType}
              onChange={(e) => setFilterSensorType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#494FA2] focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="temperature">온도</option>
              <option value="humidity">습도</option>
              <option value="particle_0_1">미세먼지 0.1μm</option>
              <option value="particle_0_3">미세먼지 0.3μm</option>
              <option value="particle_0_5">미세먼지 0.5μm</option>
            </select>
          </div>

          {/* 처리 상태 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">처리 상태</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#494FA2] focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="PENDING">대기중</option>
              <option value="APPROVED">승인됨</option>
              <option value="REJECTED">거부됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* 임계치 추천 목록 - 데스크톱 테이블 */}
      <div className="hidden lg:block bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200" style={{minWidth: '800px'}}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">추천일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서타입</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>현재 Warning</div>
                  <div className="text-xs font-normal normal-case">Low/High</div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>추천 Warning</div>
                  <div className="text-xs font-normal normal-case">Low/High</div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>현재 Alert</div>
                  <div className="text-xs font-normal normal-case">Low/High</div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>추천 Alert</div>
                  <div className="text-xs font-normal normal-case">Low/High</div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecommendations.map((rec) => (
                <tr key={rec.id} 
                    onClick={() => {
                      console.log('행 클릭됨:', rec);
                      setSelectedRecommendation(rec);
                    }}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      rec.appliedStatus === 'APPROVED' ? 'bg-green-50' : 
                      rec.appliedStatus === 'REJECTED' ? 'bg-red-50' : ''
                    }`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(rec.recommendedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.zoneId.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sensorTypeMapping[rec.sensorType] || rec.sensorType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {formatThresholdValue(rec.currentWarningLow)} / {formatThresholdValue(rec.currentWarningHigh)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className={`font-medium ${
                      rec.appliedStatus === 'APPROVED' ? 'text-green-600' : 
                      rec.appliedStatus === 'REJECTED' ? 'text-red-600' : 'text-[#494FA2]'
                    }`}>
                      {formatThresholdValue(rec.warningLow)} / {formatThresholdValue(rec.warningHigh)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {formatThresholdValue(rec.currentAlertLow)} / {formatThresholdValue(rec.currentAlertHigh)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className={`font-medium ${
                      rec.appliedStatus === 'APPROVED' ? 'text-green-600' : 
                      rec.appliedStatus === 'REJECTED' ? 'text-red-600' : 'text-[#494FA2]'
                    }`}>
                      {formatThresholdValue(rec.alertLow)} / {formatThresholdValue(rec.alertHigh)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {rec.appliedStatus === 'APPROVED' ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        승인됨
                      </span>
                    ) : rec.appliedStatus === 'REJECTED' ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        거부됨
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#494FA2]/10 text-[#494FA2]">
                        대기중
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 임계치 추천 목록 - 모바일 카드 */}
      <div className="lg:hidden space-y-4">
        {filteredRecommendations.map((rec) => (
          <div
            key={rec.id}
            onClick={() => {
              console.log('카드 클릭됨:', rec);
              setSelectedRecommendation(rec);
            }}
            className={`bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow ${
              rec.appliedStatus === 'APPROVED' ? 'border-green-200 bg-green-50' : 
              rec.appliedStatus === 'REJECTED' ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          >
            {/* 헤더 */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {rec.zoneId.toUpperCase()}구역 - {sensorTypeMapping[rec.sensorType] || rec.sensorType}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(rec.recommendedAt)}
                </p>
              </div>
              <div>
                {rec.appliedStatus === 'APPROVED' ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    승인됨
                  </span>
                ) : rec.appliedStatus === 'REJECTED' ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    거부됨
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#494FA2]/10 text-[#494FA2]">
                    대기중
                  </span>
                )}
              </div>
            </div>

            {/* 임계치 정보 */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-gray-500 mb-1">현재 Warning</div>
                <div className="font-medium">
                  {formatThresholdValue(rec.currentWarningLow)} / {formatThresholdValue(rec.currentWarningHigh)}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">추천 Warning</div>
                <div className={`font-medium ${
                  rec.appliedStatus === 'APPROVED' ? 'text-green-600' : 
                  rec.appliedStatus === 'REJECTED' ? 'text-red-600' : 'text-[#494FA2]'
                }`}>
                  {formatThresholdValue(rec.warningLow)} / {formatThresholdValue(rec.warningHigh)}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">현재 Alert</div>
                <div className="font-medium">
                  {formatThresholdValue(rec.currentAlertLow)} / {formatThresholdValue(rec.currentAlertHigh)}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">추천 Alert</div>
                <div className={`font-medium ${
                  rec.appliedStatus === 'APPROVED' ? 'text-green-600' : 
                  rec.appliedStatus === 'REJECTED' ? 'text-red-600' : 'text-[#494FA2]'
                }`}>
                  {formatThresholdValue(rec.alertLow)} / {formatThresholdValue(rec.alertHigh)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빈 결과 메시지 */}
      {filteredRecommendations.length === 0 && !loading && !error && (
        <div className="text-center py-8 sm:py-12">
          <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">임계치 추천이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">현재 조건에 맞는 임계치 추천 데이터가 없습니다.</p>
          <p className="mt-1 text-xs text-gray-400">데이터 개수: {recommendations.length}, 필터링된 개수: {filteredRecommendations.length}</p>
        </div>
      )}

      {/* 안내 문구 */}
      <div className="mt-4 sm:mt-6 bg-primary-100 p-3 sm:p-4 rounded-lg">
        <h5 className="text-sm font-bold text-primary-900 mb-2">임계치 추천 안내</h5>
        <ul className="text-xs sm:text-sm text-primary-800 space-y-1">
          <li>• AI를 통해 센서 데이터를 분석하여 최적의 임계치를 추천합니다.</li>
          <li>• 행을 클릭하면 상세 정보와 추천 사유를 확인할 수 있습니다.</li>
          <li>• 승인된 추천은 자동으로 센서 임계치에 적용됩니다.</li>
          <li>• 한 번 승인/거부 한 추천은 수정이 불가능합니다.</li>
        </ul>
      </div>

      
      {selectedRecommendation && (() => {
        try {
          return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedRecommendation(null)}>
              <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3">
                  {/* 모달 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">임계치 추천 상세 정보</h3>
                    <button
                      onClick={() => setSelectedRecommendation(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>

                  {/* 기본 정보 */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      기본 정보
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-[#494FA2]/5 border border-[#494FA2]/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <label className="text-sm font-medium text-[#494FA2]">추천일시</label>
                        </div>
                        <p className="text-sm text-gray-900 font-medium whitespace-nowrap">{formatDateTime(selectedRecommendation.recommendedAt) || '-'}</p>
                      </div>
                      
                      <div className="bg-[#494FA2]/5 border border-[#494FA2]/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          <label className="text-sm font-medium text-[#494FA2]">구역</label>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{selectedRecommendation.zoneId?.toUpperCase() || '-'}</p>
                      </div>
                      
                      <div className="bg-[#494FA2]/5 border border-[#494FA2]/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                          </svg>
                          <label className="text-sm font-medium text-[#494FA2]">센서타입</label>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{sensorTypeMapping[selectedRecommendation.sensorType] || selectedRecommendation.sensorType || '-'}</p>
                      </div>
                      
                      <div className="bg-[#494FA2]/5 border border-[#494FA2]/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <label className="text-sm font-medium text-[#494FA2]">처리상태</label>
                        </div>
                        <div className="flex items-center">
                          {selectedRecommendation.appliedStatus === 'APPROVED' ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                              승인됨
                            </span>
                          ) : selectedRecommendation.appliedStatus === 'REJECTED' ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                              </svg>
                              거부됨
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-[#494FA2]/10 text-[#494FA2]">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                              </svg>
                              대기중
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {selectedRecommendation.appliedAt && (
                        <div className="bg-[#494FA2]/5 border border-[#494FA2]/20 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <label className="text-sm font-medium text-[#494FA2]">적용시간</label>
                          </div>
                          <p className="text-sm text-gray-900 font-medium whitespace-nowrap">
                            {formatDateTime(selectedRecommendation.appliedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 추천 사유 */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#494FA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      추천 사유
                    </h4>
                    <div className="bg-gradient-to-r from-[#494FA2]/5 to-[#494FA2]/10 border border-[#494FA2]/20 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 mr-3 text-[#494FA2] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <div className="text-sm text-gray-900 leading-relaxed">
                          {selectedRecommendation.reasonContent || selectedRecommendation.reason || '추천 사유가 제공되지 않았습니다.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    {/* 대기중 상태일 때만 승인/거부 버튼 표시 */}
                    {selectedRecommendation.appliedStatus === 'PENDING' && (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              console.log('승인 클릭:', selectedRecommendation.id);
                              await handleApprove(selectedRecommendation.id);
                              setSelectedRecommendation(null);
                            } catch (error) {
                              console.error('승인 처리 오류:', error);
                              alert('승인 처리 중 오류가 발생했습니다.');
                            }
                          }}
                          className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? '처리중...' : '승인'}
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              console.log('거부 클릭:', selectedRecommendation.id);
                              await handleReject(selectedRecommendation.id);
                              setSelectedRecommendation(null);
                            } catch (error) {
                              console.error('거부 처리 오류:', error);
                              alert('거부 처리 중 오류가 발생했습니다.');
                            }
                          }}
                          className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? '처리중...' : '거부'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedRecommendation(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.error('모달 렌더링 오류:', error);
          return (
            <div className="fixed inset-0 bg-red-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedRecommendation(null)}>
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-red-900">오류 발생</h3>
                  <p className="mt-2 text-sm text-red-700">모달을 표시하는 중 오류가 발생했습니다.</p>
                  <p className="mt-1 text-xs text-gray-500">{error.message}</p>
                  <button
                    onClick={() => setSelectedRecommendation(null)}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default AIRecommend;