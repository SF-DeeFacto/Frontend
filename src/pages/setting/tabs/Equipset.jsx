import React, { useState, useEffect } from 'react';
import { thresholdApi } from '../../../services/api/threshold_api';
import { handleApiError } from '../../../utils/unifiedErrorHandler';

const formatDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};

const Equipset = ({ onTabChange }) => {
  // 선택된 구역
  const [selectedZone, setSelectedZone] = useState('all');
  
  // API에서 가져온 임계치 상태 (구역별 배열 매핑)
  const [sensorThresholds, setSensorThresholds] = useState({});

  // 초기 및 구역 변경 시 임계치 로드
  useEffect(() => {
    let isMounted = true;
    const loadThresholds = async () => {
      const result = await thresholdApi.getThresholds();
      if (!isMounted) return;
      if (result.success) {
        const payload = result.data;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : (payload?.data?.content || payload?.content || (Array.isArray(payload) ? payload : []));
        // 서버가 전체 임계치를 내려주므로 zoneId로 그룹핑
        const grouped = list.reduce((acc, item) => {
          const key = item.zoneId?.toLowerCase?.() || 'unknown';
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});
        setSensorThresholds(grouped);
      } else {
        const errorInfo = handleApiError(new Error(result.error), '임계치 목록 조회');
        console.error('임계치 목록 조회 실패:', errorInfo.message);
        setSensorThresholds({});
      }
    };
    loadThresholds();
    return () => { isMounted = false; };
  }, [selectedZone]);

  // 현재 선택된 구역의 센서 데이터
  const currentSensors = selectedZone === 'all' 
    ? Object.values(sensorThresholds).flat() 
    : sensorThresholds[selectedZone] || [];

  // 인라인 수정 상태 - 센서 타입 기준으로 변경
  const [editingType, setEditingType] = useState(null);
  const [editForm, setEditForm] = useState({
    warningLow: '',
    warningHigh: '',
    alertLow: '',
    alertHigh: '',
  });



  const onEditClick = (sensor) => {
    setEditingType(sensor.sensorType);
    setEditForm({
      warningLow: sensor.warningLow !== null ? String(sensor.warningLow) : '',
      warningHigh: sensor.warningHigh !== null ? String(sensor.warningHigh) : '',
      alertLow: sensor.alertLow !== null ? String(sensor.alertLow) : '',
      alertHigh: sensor.alertHigh !== null ? String(sensor.alertHigh) : '',
    });
  };

  const onCancel = () => {
    setEditingType(null);
    setEditForm({ warningLow: '', warningHigh: '', alertLow: '', alertHigh: '' });
  };

  const onChange = (key, value) => {
    // 숫자, 소수점, 음수 부호만 허용
    if (/^-?\d*(\.\d*)?$/.test(value) || value === '') {
      setEditForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSave = async () => {
    const v = {
      warningLow: editForm.warningLow !== '' ? parseFloat(editForm.warningLow) : null,
      warningHigh: editForm.warningHigh !== '' ? parseFloat(editForm.warningHigh) : null,
      alertLow: editForm.alertLow !== '' ? parseFloat(editForm.alertLow) : null,
      alertHigh: editForm.alertHigh !== '' ? parseFloat(editForm.alertHigh) : null,
    };

    // 유효성 검사 - 빈 값이 아닌 경우만 체크
    if (
      (editForm.warningLow !== '' && Number.isNaN(v.warningLow)) ||
      (editForm.warningHigh !== '' && Number.isNaN(v.warningHigh)) ||
      (editForm.alertLow !== '' && Number.isNaN(v.alertLow)) ||
      (editForm.alertHigh !== '' && Number.isNaN(v.alertHigh))
    ) {
      alert('임계치 값은 숫자여야 합니다.');
      return;
    }
    
    // 경고 임계치 범위 검사
    if (v.warningLow !== null && v.warningHigh !== null && v.warningLow > v.warningHigh) {
      alert('경고 하한값은 경고 상한값보다 작거나 같아야 합니다.');
      return;
    }
    
    // 초과 임계치 범위 검사
    if (v.alertLow !== null && v.alertHigh !== null && v.alertLow > v.alertHigh) {
      alert('초과 하한값은 초과 상한값보다 작거나 같아야 합니다.');
      return;
    }

    if (selectedZone === 'all') {
      alert('전체 보기에서는 수정할 수 없습니다. 특정 구역을 선택해주세요.');
      return;
    }

    const now = new Date();
    
    // API로 전송할 데이터 구성
    const updatedSensor = {
      zoneId: selectedZone,
      sensorType: editingType,
      warningLow: v.warningLow,
      warningHigh: v.warningHigh,
      alertLow: v.alertLow,
      alertHigh: v.alertHigh,
      updatedUserId: 'current_user', // 실제 로그인 사용자로 교체 필요
      updatedAt: now.toISOString()
    };

    try {
      const result = await thresholdApi.updateThreshold(updatedSensor);
      if (!result.success) {
        const errorInfo = handleApiError(new Error(result.error), '임계치 업데이트');
        throw new Error(errorInfo.userMessage);
      }

      // 성공 시 목록 갱신
      const reload = await thresholdApi.getThresholds();
      if (reload.success) {
        const payload = reload.data;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : (payload?.data?.content || payload?.content || (Array.isArray(payload) ? payload : []));
        const grouped = list.reduce((acc, item) => {
          const key = item.zoneId?.toLowerCase?.() || 'unknown';
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});
        setSensorThresholds(grouped);
      }

      alert('센서 임계치가 성공적으로 업데이트되었습니다.');
      onCancel();
    } catch (error) {
      const errorInfo = handleApiError(error, '임계치 업데이트');
      console.error('센서 임계치 업데이트 오류:', errorInfo.message);
      alert(errorInfo.userMessage);
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

  // 날짜 포맷팅 함수 - 날짜와 시간 분리
  const formatDateFromISO = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTimeFromISO = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 임계치 값 표시 함수
  const formatThresholdValue = (value) => {
    return value !== null ? value.toString() : '-';
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h4 className="text-lg font-medium text-gray-900">센서 임계치 설정</h4>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">구역 선택:</label>
            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setEditingType(null); // 구역 변경 시 편집 상태 초기화
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="a">A구역</option>
              <option value="b">B구역</option>
              <option value="c">C구역</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => onTabChange && onTabChange('airecommendation')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          AI 추천 관리
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역ID</th>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서유형</th>
              <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Warning(경고)<br/>Low</th>
              <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Warning(경고)<br/>High</th>
              <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Alert(알림)<br/>Low</th>
              <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Alert(알림)<br/>High</th>
              <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정시간</th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정자</th>
              <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentSensors.map((s, index) => {
              const isEditing = editingType === s.sensorType && selectedZone !== 'all';
              const uniqueKey = selectedZone === 'all' ? `${s.zoneId}-${s.sensorType}` : s.sensorType;
              return (
                <tr key={uniqueKey} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{s.zoneId.toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{sensorTypeMapping[s.sensorType] || s.sensorType}</td>

                  {/* 경고L */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.warningLow}
                        onChange={(e) => onChange('warningLow', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-center text-sm"
                        placeholder="-"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{formatThresholdValue(s.warningLow)}</span>
                    )}
                  </td>

                  {/* 경고H */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.warningHigh}
                        onChange={(e) => onChange('warningHigh', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-center text-sm"
                        placeholder="-"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{formatThresholdValue(s.warningHigh)}</span>
                    )}
                  </td>

                  {/* 초과L */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.alertLow}
                        onChange={(e) => onChange('alertLow', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-center text-sm"
                        placeholder="-"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{formatThresholdValue(s.alertLow)}</span>
                    )}
                  </td>

                  {/* 초과H */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.alertHigh}
                        onChange={(e) => onChange('alertHigh', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-center text-sm"
                        placeholder="-"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{formatThresholdValue(s.alertHigh)}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className="text-xs">{formatDateFromISO(s.updatedAt)}</span>
                      <span className="text-xs text-gray-500">{formatTimeFromISO(s.updatedAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.updatedUserId}</td>

                  <td className="px-4 py-3 text-sm text-right space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={onSave}
                          className="inline-flex items-center px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={onCancel}
                          className="inline-flex items-center px-3 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onEditClick(s)}
                        className="inline-flex items-center px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={editingType !== null || selectedZone === 'all'}
                        title={selectedZone === 'all' ? '전체 보기에서는 수정할 수 없습니다' : editingType !== null ? '다른 행 수정 중' : '수정'}
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {currentSensors.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={9}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 안내 문구 */}
      <p className="mt-3 text-sm text-gray-500">
        각 Zone(존)별로 Warning(경고)Low/High, alert(알림)Low/High만 수정할 수 있습니다. 저장 시 수정일자와 수정인이 갱신됩니다.
      </p>
    </div>
  );
};

export default Equipset;
