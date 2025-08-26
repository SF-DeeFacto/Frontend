import React, { useState } from 'react';

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
  // 조회용 더미 데이터 (수정인은 플레이스홀더 사용)
  const [sensors, setSensors] = useState([
    {
      sensorId: 'S-001',
      sensorType: '온도',
      zone: '1층',
      t1L: -5,
      t1H: 35,
      t2L: -10,
      t2H: 45,
      modifiedAt: '2024-01-15 09:10:00',
      modifiedBy: '<사용자>',
    },
    {
      sensorId: 'S-002',
      sensorType: '습도',
      zone: '2층',
      t1L: 30,
      t1H: 70,
      t2L: 20,
      t2H: 80,
      modifiedAt: '2024-01-10 11:22:00',
      modifiedBy: '<사용자>',
    },
    {
      sensorId: 'S-003',
      sensorType: '압력',
      zone: '지하',
      t1L: 0.8,
      t1H: 1.2,
      t2L: 0.6,
      t2H: 1.4,
      modifiedAt: '2024-01-05 08:05:00',
      modifiedBy: '<사용자>',
    },
  ]);

  // 인라인 수정 상태
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    t1L: '',
    t1H: '',
    t2L: '',
    t2H: '',
  });

  const onEditClick = (sensor) => {
    setEditingId(sensor.sensorId);
    setEditForm({
      t1L: String(sensor.t1L),
      t1H: String(sensor.t1H),
      t2L: String(sensor.t2L),
      t2H: String(sensor.t2H),
    });
  };

  const onCancel = () => {
    setEditingId(null);
    setEditForm({ t1L: '', t1H: '', t2L: '', t2H: '' });
  };

  const onChange = (key, value) => {
    // 숫자, 소수점, 음수 부호만 허용
    if (/^-?\d*(\.\d*)?$/.test(value) || value === '') {
      setEditForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSave = () => {
    const v = {
      t1L: parseFloat(editForm.t1L),
      t1H: parseFloat(editForm.t1H),
      t2L: parseFloat(editForm.t2L),
      t2H: parseFloat(editForm.t2H),
    };

    // 유효성 검사
    if (
      Number.isNaN(v.t1L) ||
      Number.isNaN(v.t1H) ||
      Number.isNaN(v.t2L) ||
      Number.isNaN(v.t2H)
    ) {
      alert('임계치 값은 숫자여야 합니다.');
      return;
    }
    if (v.t1L > v.t1H) {
      alert('임계치1L은 임계치1H보다 작거나 같아야 합니다.');
      return;
    }
    if (v.t2L > v.t2H) {
      alert('임계치2L은 임계치2H보다 작거나 같아야 합니다.');
      return;
    }

    const now = new Date();
    const updated = sensors.map((s) =>
      s.sensorId === editingId
        ? {
            ...s,
            t1L: v.t1L,
            t1H: v.t1H,
            t2L: v.t2L,
            t2H: v.t2H,
            modifiedAt: formatDateTime(now),
            modifiedBy: '<사용자>', // 실제 로그인 사용자로 교체 필요
          }
        : s
    );
    setSensors(updated);
    onCancel();
  };

  return (
    <div className="p-2">
      <h4 className="text-lg font-medium text-gray-900 mb-4">센서 설정</h4>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센서종류</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">임계치1L</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">임계치1H</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">임계치2L</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">임계치2H</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정일자</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수정인</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sensors.map((s) => {
              const isEditing = editingId === s.sensorId;
              return (
                <tr key={s.sensorId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{s.sensorId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.sensorType}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.zone}</td>

                  {/* 임계치1L */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.t1L}
                        onChange={(e) => onChange('t1L', e.target.value)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                        placeholder="숫자"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{s.t1L}</span>
                    )}
                  </td>

                  {/* 임계치1H */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.t1H}
                        onChange={(e) => onChange('t1H', e.target.value)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                        placeholder="숫자"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{s.t1H}</span>
                    )}
                  </td>

                  {/* 임계치2L */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.t2L}
                        onChange={(e) => onChange('t2L', e.target.value)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                        placeholder="숫자"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{s.t2L}</span>
                    )}
                  </td>

                  {/* 임계치2H */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.t2H}
                        onChange={(e) => onChange('t2H', e.target.value)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                        placeholder="숫자"
                        inputMode="decimal"
                      />
                    ) : (
                      <span className="block text-center">{s.t2H}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">{s.modifiedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.modifiedBy}</td>

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
    </div>
  );
};

export default Equipset;
