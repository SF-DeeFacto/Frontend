import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sensorApi } from '../../../services/api/sensor_api';

const SensorListTab = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 센서 목록 API 로드
  useEffect(() => {
    let isMounted = true;
    const loadSensors = async () => {
      const result = await sensorApi.getSensors();
      if (!isMounted) return;
      if (result.success) {
        const payload = result.data;
        const list = payload?.data?.content || payload?.content || (Array.isArray(payload) ? payload : []);
        setSensors(list);
        setFilteredSensors(list);
      } else {
        console.error(result.error);
        setSensors([]);
        setFilteredSensors([]);
      }
    };
    loadSensors();
    return () => { isMounted = false; };
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = sensors;

    // 센서 타입 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(sensor => sensor.sensorType === filterType);
    }

    // 구역 필터
    if (filterZone !== 'all') {
      filtered = filtered.filter(sensor => sensor.zoneId === filterZone);
    }

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(sensor => 
        sensor.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.sensorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.zoneId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSensors(filtered);
  }, [sensors, filterType, filterZone, searchTerm]);

  // 센서 타입별 한글 매핑
  const sensorTypeMapping = {
    'electrostatic': 'ESD',
    'temperature': '온도',
    'humidity': '습도',
    'particle': '미세먼지',
    'windDirection': '풍향'
  };

  // 센서 타입 목록
  const sensorTypes = ['all', 'electrostatic', 'temperature', 'humidity', 'particle', 'windDirection'];
  const zones = ['all', 'a01', 'a02', 'b01', 'b02', 'b03', 'b04', 'c01', 'c02'];

  // 날짜 포맷팅 함수
  const formatDateTime = (isoString) => {
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
    <div>
      {/* 필터 및 검색 영역 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 검색 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색
            </label>
            <input
              type="text"
              placeholder="센서ID, 센서종류, 구역 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 센서 타입 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              센서 종류
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sensorTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? '전체' : sensorTypeMapping[type] || type}
                </option>
              ))}
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
              {zones.map(zone => (
                <option key={zone} value={zone}>
                  {zone === 'all' ? '전체' : zone.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* 결과 수 */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              총 {filteredSensors.length}개의 센서
            </div>
          </div>
        </div>
      </div>

      {/* 센서 목록 테이블 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  센서ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구역ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  센서유형
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  경고L
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  경고H
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  초과L
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  초과H
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수정시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수정자
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSensors.map((sensor, index) => (
                <tr key={sensor.sensorId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sensor.sensorId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sensor.zoneId.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sensorTypeMapping[sensor.sensorType] || sensor.sensorType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatThresholdValue(sensor.warningLow)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatThresholdValue(sensor.warningHigh)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatThresholdValue(sensor.alertLow)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatThresholdValue(sensor.alertHigh)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(sensor.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sensor.updatedUserId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 결과 메시지 */}
        {filteredSensors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">검색 결과가 없습니다.</div>
            <div className="text-gray-400 text-sm mt-2">다른 검색 조건을 시도해보세요.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorListTab;
