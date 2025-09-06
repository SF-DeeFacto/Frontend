import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
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
  // 선택된 구역들 (다중 선택)
  const [selectedZones, setSelectedZones] = useState(['a', 'b', 'c']); // 기본적으로 모든 구역 선택
  
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
  }, [selectedZones]);

  // 현재 선택된 구역들의 센서 데이터
  const currentSensors = selectedZones.length === 0 
    ? [] // 아무 구역도 선택되지 않으면 빈 배열
    : selectedZones.length === 3 
      ? Object.values(sensorThresholds).flat() 
      : selectedZones.flatMap(zone => sensorThresholds[zone] || []);

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

    if (selectedZones.length === 0) {
      alert('수정하려면 구역을 선택해주세요.');
      return;
    }
    
    if (selectedZones.length !== 1) {
      alert('수정하려면 하나의 구역만 선택해주세요.');
      return;
    }

    const now = new Date();
    
    // API로 전송할 데이터 구성
    const updatedSensor = {
      zoneId: selectedZones[0], // 선택된 구역이 하나일 때만 수정 가능
      sensorType: editingType,
      warningLow: v.warningLow,
      warningHigh: v.warningHigh,
      alertLow: v.alertLow,
      alertHigh: v.alertHigh,
      updatedUserId: 'current_user', // 실제 로그인 사용자로 교체 필요
      updatedAt: now.toISOString()
    };

    // 원본 데이터 찾기
    const originalSensor = currentSensors.find(s => s.sensorType === editingType);
    
    // 변경된 값 확인 함수
    const isChanged = (newValue, originalValue) => {
      return newValue !== originalValue;
    };
    
    const formatValue = (newValue, originalValue) => {
      const displayValue = newValue !== null ? newValue : '-';
      return isChanged(newValue, originalValue) ? displayValue : `${displayValue} (변경없음)`;
    };
    
    // 수정 내용 확인창
    const confirmMessage = `다음 내용으로 수정하시겠습니까?\n\n구역: ${selectedZones[0].toUpperCase()}구역\n센서 유형: ${sensorTypeMapping[editingType] || editingType}\n\n경고 Low: ${formatValue(v.warningLow, originalSensor?.warningLow)}\n경고 High: ${formatValue(v.warningHigh, originalSensor?.warningHigh)}\n알림 Low: ${formatValue(v.alertLow, originalSensor?.alertLow)}\n알림 High: ${formatValue(v.alertHigh, originalSensor?.alertHigh)}`;
    
    if (!window.confirm(confirmMessage)) {
      return; // 사용자가 취소한 경우
    }

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



  // 구역 목록
  const zones = ['a', 'b', 'c'];

  // 구역 토글 핸들러
  const toggleZone = (zone) => {
    setSelectedZones(prev => {
      if (prev.includes(zone)) {
        // 구역이 선택되어 있으면 제거
        const newZones = prev.filter(z => z !== zone);
        return newZones; // 빈 배열도 허용
      } else {
        // 구역이 선택되어 있지 않으면 추가
        return [...prev, zone];
      }
    });
  };

  // 전체 구역 선택/해제
  const toggleAllZones = () => {
    if (selectedZones.length === zones.length) {
      // 모든 구역이 선택되어 있으면 전체 해제 (빈 배열)
      setSelectedZones([]);
    } else {
      // 모든 구역 선택
      setSelectedZones([...zones]);
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
    <div>
      {/* 필터 및 구역 선택 영역 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="space-y-4">
          {/* 구역 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              구역 선택
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {/* 토글 버튼들을 한 줄로 나열 */}
              <div className="flex flex-wrap gap-2">
                {/* 전체 선택/해제 버튼 */}
                <button
                  onClick={() => {
                    toggleAllZones();
                    setEditingType(null); // 구역 변경 시 편집 상태 초기화
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedZones.length === zones.length
                      ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                      : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                  }`}
                >
                  {selectedZones.length === zones.length ? '전체 해제' : '전체 선택'}
                </button>
                
                {/* 개별 구역 토글 버튼들 */}
                {zones.map(zone => (
                  <button
                    key={zone}
                    onClick={() => {
                      toggleZone(zone);
                      setEditingType(null); // 구역 변경 시 편집 상태 초기화
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedZones.includes(zone)
                        ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                        : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                    }`}
                  >
                    {zone.toUpperCase()}구역
                  </button>
                ))}
              </div>
              
              {/* 결과 수 - 버튼들과 가깝게 배치 */}
              <div className="text-sm text-gray-600">
                총 {currentSensors.length}개의 센서
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mb-3 flex items-start space-x-2">
        <Info className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-500 tracking-wide">
          각 구역별로 Warning(경고) 및 Alert(알림) 임계치만 수정 가능합니다. 저장 시 수정일자와 수정인이 자동 갱신됩니다.
        </p>
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
              const isEditing = editingType === s.sensorType && selectedZones.length === 1;
              const uniqueKey = selectedZones.length > 1 ? `${s.zoneId}-${s.sensorType}` : s.sensorType;
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

                  <td className="px-4 py-3 text-sm text-right">
                    {isEditing ? (
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={onSave}
                          className="inline-flex items-center px-2 py-1 text-xs rounded bg-[#494FA2] text-white hover:bg-[#3d4490]"
                        >
                          저장
                        </button>
                        <button
                          onClick={onCancel}
                          className="inline-flex items-center px-2 py-1 text-xs rounded bg-gray-400 text-white hover:bg-gray-500"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEditClick(s)}
                        className="inline-flex items-center px-2 py-1 text-xs rounded bg-[#494FA2] text-white hover:bg-[#3d4490] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={editingType !== null || selectedZones.length === 0 || selectedZones.length !== 1}
                        title={selectedZones.length === 0 ? '구역을 선택해주세요' : selectedZones.length !== 1 ? '수정하려면 하나의 구역만 선택해주세요' : editingType !== null ? '다른 행 수정 중' : '수정'}
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
                  {selectedZones.length === 0 ? '구역을 선택해주세요.' : '데이터가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Equipset;
