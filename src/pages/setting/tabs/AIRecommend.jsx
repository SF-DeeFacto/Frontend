import React, { useState, useEffect } from 'react';
import { aiRecommendService } from '../../../services/api/aiRecommend';
import { SectionLoading, ButtonLoading } from '../../../components/ui';
import { useUnifiedLoading } from '../../../hooks';
import { LOADING_TEXTS } from '../../../config';

const AIRecommend = () => {
  // 상태 변수들
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [filterZone, setFilterZone] = useState('all');
  const [filterSensorType, setFilterSensorType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { loading, loadingText, error, withLoading, setLoadingError } = useUnifiedLoading({
    componentName: 'AIRecommend'
  });
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // AI 추천 데이터 로드
  const loadRecommendations = async () => {
    try {
      if (!loading) setLoading(true);
      setError(null);

      let recommendationsArray = [];

      if (filterStatus === 'all') {
        recommendationsArray = await aiRecommendService.getRecommendations();
      } else if (filterStatus === 'APPROVED') {
        recommendationsArray = await aiRecommendService.getApprovedRecommendations();
      } else if (filterStatus === 'REJECTED') {
        recommendationsArray = await aiRecommendService.getRejectedRecommendations();
      } else if (filterStatus === 'PENDING') {
        recommendationsArray = await aiRecommendService.getRecommendationsByStatus(['PENDING']);
      }

      // 전체 데이터 저장
      setRecommendations(recommendationsArray);
      setFilteredRecommendations(recommendationsArray);
    } catch (err) {
      console.error('AI 추천 데이터 로드 실패:', err);
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
      
      alert('AI 추천이 승인되어 적용되었습니다.');
      
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
    try {
      console.log('거부 처리 시작:', id);
      setLoading(true);
      
      const result = await aiRecommendService.updateRecommendationStatus(id, 'REJECT');
      console.log('거부 API 결과:', result);
      
      alert('AI 추천이 거부되었습니다.');
      
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

    setFilteredRecommendations(filtered);
  }, [recommendations, filterZone, filterSensorType]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadRecommendations();
  }, [filterStatus]);

  // 센서 타입 매핑
  const sensorTypeMapping = {
    'temperature': '온도',
    'humidity': '습도',
    'particle_0_1': '미세먼지 0.1μm',
    'particle_0_3': '미세먼지 0.3μm',
    'particle_0_5': '미세먼지 0.5μm'
  };

  // 날짜 포맷팅 함수
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 임계치 값 포맷팅 함수
  const formatThresholdValue = (value) => {
    if (value === null || value === undefined) return '-';
    return value.toString();
  };

  // 로딩 상태
  if (loading && recommendations.length === 0) {
    return (
      <SectionLoading
        loading={true}
        loadingText={loadingText}
        showHeader={false}
        className="h-64"
      />
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

  console.log('AIRecommend 렌더링:', {
    recommendationsLength: recommendations.length,
    filteredRecommendationsLength: filteredRecommendations.length,
    selectedRecommendation,
    loading,
    error
  });

  return (
    <div>
      {/* 필터 영역 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* AI 추천 목록 테이블 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200" style={{minWidth: '800px'}}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">추천일시</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서타입</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">현재 Warning</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">현재 Alert</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">추천 Warning</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">추천 Alert</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {formatThresholdValue(rec.currentAlertLow)} / {formatThresholdValue(rec.currentAlertHigh)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className={`font-medium ${
                      rec.appliedStatus === 'APPROVED' ? 'text-green-600' : 
                      rec.appliedStatus === 'REJECTED' ? 'text-red-600' : 'text-[#494FA2]'
                    }`}>
                      {formatThresholdValue(rec.warningLow)} / {formatThresholdValue(rec.warningHigh)}
                    </div>
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
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        대기중
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 결과 메시지 */}
        {filteredRecommendations.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">AI 추천이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">현재 조건에 맞는 AI 추천 데이터가 없습니다.</p>
            <p className="mt-1 text-xs text-gray-400">데이터 개수: {recommendations.length}, 필터링된 개수: {filteredRecommendations.length}</p>
          </div>
        )}
      </div>

      {/* 안내 문구 */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2">AI 추천 임계치 안내</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• AI는 센서 데이터를 분석하여 최적의 임계치를 추천합니다.</li>
          <li>• 행을 클릭하면 상세 정보와 추천 사유를 확인할 수 있습니다.</li>
          <li>• 승인된 추천은 자동으로 센서 임계치에 적용됩니다.</li>
        </ul>
        
      </div>

      
      {selectedRecommendation && (() => {
        try {
          return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedRecommendation(null)}>
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3">
                  {/* 모달 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">AI 추천 상세 정보</h3>
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
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">추천일시</label>
                      <p className="text-sm text-gray-900">{selectedRecommendation.recommendedAt || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">구역</label>
                      <p className="text-sm text-gray-900">{selectedRecommendation.zoneId || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">센서타입</label>
                      <p className="text-sm text-gray-900">{selectedRecommendation.sensorType || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">처리상태</label>
                      <p className="text-sm text-gray-900">{selectedRecommendation.appliedStatus || '대기중'}</p>
                    </div>
                  </div>

                  {/* 추천 사유 */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">추천 사유</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-700">
                        {selectedRecommendation.reasonContent || selectedRecommendation.reason || '사유 없음'}
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex justify-end space-x-3">
                    <ButtonLoading
                      loading={loading}
                      loadingText={LOADING_TEXTS.ACTIONS.APPROVE}
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
                      승인
                    </ButtonLoading>
                    <ButtonLoading
                      loading={loading}
                      loadingText={LOADING_TEXTS.ACTIONS.REJECT}
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
                      거부
                    </ButtonLoading>
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