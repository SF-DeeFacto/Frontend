import React, { useState } from 'react';
import ThresholdRecommendationModal from '../../../components/setting/ThresholdRecommendationModal';

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

const Equipset = () => {
  // 실제 API 구조에 맞춘 더미 데이터
  const [sensors, setSensors] = useState([
    {
      sensorId: 'esd-001',
      zoneId: 'a01',
      sensorType: 'electrostatic',
      updatedAt: '2025-08-22T16:38:40',
      updatedUserId: 'admin',
      warningLow: null,
      warningHigh: 80.0,
      alertLow: null,
      alertHigh: 100.0
    },
    {
      sensorId: 'temp-001',
      zoneId: 'a01',
      sensorType: 'temperature',
      updatedAt: '2025-08-22T15:20:15',
      updatedUserId: 'admin',
      warningLow: 18.0,
      warningHigh: 25.0,
      alertLow: 15.0,
      alertHigh: 30.0
    },
    {
      sensorId: 'humid-001',
      zoneId: 'a02',
      sensorType: 'humidity',
      updatedAt: '2025-08-22T14:45:30',
      updatedUserId: 'user01',
      warningLow: 40.0,
      warningHigh: 60.0,
      alertLow: 30.0,
      alertHigh: 70.0
    }
  ]);

  // 인라인 수정 상태
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    warningLow: '',
    warningHigh: '',
    alertLow: '',
    alertHigh: '',
  });

  // AI 추천 모달 상태
  const [showRecommendations, setShowRecommendations] = useState(false);

  const onEditClick = (sensor) => {
    setEditingId(sensor.sensorId);
    setEditForm({
      warningLow: sensor.warningLow !== null ? String(sensor.warningLow) : '',
      warningHigh: sensor.warningHigh !== null ? String(sensor.warningHigh) : '',
      alertLow: sensor.alertLow !== null ? String(sensor.alertLow) : '',
      alertHigh: sensor.alertHigh !== null ? String(sensor.alertHigh) : '',
    });
  };

  const onCancel = () => {
    setEditingId(null);
    setEditForm({ warningLow: '', warningHigh: '', alertLow: '', alertHigh: '' });
  };

  const onChange = (key, value) => {
    // 숫자, 소수점, 음수 부호만 허용
    if (/^-?\d*(\.\d*)?$/.test(value) || value === '') {
      setEditForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSave = () => {
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

    const now = new Date();
    const updated = sensors.map((s) =>
      s.sensorId === editingId
        ? {
            ...s,
            warningLow: v.warningLow,
            warningHigh: v.warningHigh,
            alertLow: v.alertLow,
            alertHigh: v.alertHigh,
            updatedAt: now.toISOString(),
            updatedUserId: 'current_user', // 실제 로그인 사용자로 교체 필요
          }
        : s
    );
    setSensors(updated);
    onCancel();
  };

  // AI 추천 승인 처리
  const handleApproveRecommendations = (approvedRecommendations) => {
    const now = new Date();
    const updatedSensors = sensors.map(sensor => {
      const recommendation = approvedRecommendations.find(rec => rec.sensorId === sensor.sensorId);
      if (recommendation) {
        return {
          ...sensor,
          warningLow: recommendation.recommended.warningLow,
          warningHigh: recommendation.recommended.warningHigh,
          alertLow: recommendation.recommended.alertLow,
          alertHigh: recommendation.recommended.alertHigh,
          updatedAt: now.toISOString(),
          updatedUserId: 'AI_SYSTEM',
        };
      }
      return sensor;
    });
    
    setSensors(updatedSensors);
    alert(`${approvedRecommendations.length}개의 AI 추천이 적용되었습니다.`);
  };

  // 센서 타입별 한글 매핑
  const sensorTypeMapping = {
    'electrostatic': 'ESD',
    'temperature': '온도',
    'humidity': '습도',
    'particle': '미세먼지',
    'windDirection': '풍향'
  };

  // 날짜 포맷팅 함수
  const formatDateTimeFromISO = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
        <h4 className="text-lg font-medium text-gray-900">센서 임계치 설정</h4>
        <button
          onClick={() => setShowRecommendations(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          AI 추천 임계치 보기
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서유형</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">경고L</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">경고H</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">초과L</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">초과H</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정시간</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정자</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sensors.map((s) => {
              const isEditing = editingId === s.sensorId;
              return (
                <tr key={s.sensorId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{s.sensorId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.zoneId.toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{sensorTypeMapping[s.sensorType] || s.sensorType}</td>

                  {/* 경고L */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.warningLow}
                        onChange={(e) => onChange('warningLow', e.target.value)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
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
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
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
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
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
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                        placeholder="-"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{formatThresholdValue(s.alertHigh)}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">{formatDateTimeFromISO(s.updatedAt)}</td>
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
                        className="inline-flex items-center px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        disabled={editingId !== null}
                        title={editingId !== null ? '다른 행 수정 중' : '수정'}
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {sensors.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={10}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 안내 문구 */}
      <p className="mt-3 text-sm text-gray-500">
        임계치1L/H, 임계치2L/H만 수정할 수 있습니다. 저장 시 수정일자와 수정인이 갱신됩니다.
      </p>

      {/* AI 추천 모달 */}
      <ThresholdRecommendationModal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        onApprove={handleApproveRecommendations}
      />
    </div>
  );
};

export default Equipset;
