import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sensorApi } from '../../../services/api/sensor_api';
import { handleApiError } from '../../../utils/unifiedErrorHandler';
import { getSensorTypeMapping, SENSOR_TYPES_FOR_FILTER, ZONE_INFO } from '../../../config/sensorConfig';
import { useAuth } from '../../../hooks/useAuth';
import SearchFilterSection from '../../../components/common/SearchFilterSection';

const SensorListTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 센서 목록 API 로드
  useEffect(() => {
    let isMounted = true;
    const loadSensors = async () => {
      // 상태 초기화 (이전 데이터 클리어)
      setSensors([]);
      setFilteredSensors([]);
      
      const params = {
        sensorType: filterType !== 'all' ? filterType : undefined,
        zoneId: filterZone !== 'all' ? filterZone.toLowerCase() : undefined,
        page: 0,
        size: 100 // 충분히 큰 크기로 설정
      };
      
      
      const result = await sensorApi.getSensors(params);
      if (!isMounted) return;
      
      
      if (result.success) {
        const payload = result.data;
        const list = payload?.data?.content || payload?.content || (Array.isArray(payload) ? payload : []);
        
        setSensors(list);
        setFilteredSensors(list);
      } else {
        const errorInfo = handleApiError(new Error(result.error), '센서 목록 조회');
        console.error('❌ 센서 목록 조회 실패:', errorInfo.message);
        setSensors([]);
        setFilteredSensors([]);
      }
    };
    loadSensors();
    return () => { isMounted = false; };
  }, [filterType, filterZone]);

  // 센서 타입별 한글 매핑 함수 사용
  const getSensorTypeName = getSensorTypeMapping;

  // 검색어 필터링 (클라이언트 사이드)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSensors(sensors);
      return;
    }
    
    const filtered = sensors.filter(sensor => {
      const searchLower = searchTerm.toLowerCase();
      
      // 기본 필드 검색
      const basicMatch = 
        sensor.sensorId.toLowerCase().includes(searchLower) ||
        sensor.sensorType.toLowerCase().includes(searchLower) ||
        sensor.zoneId.toLowerCase().includes(searchLower);
      
      // 한글 센서 타입명 검색
      const koreanTypeName = getSensorTypeName(sensor.sensorType);
      const koreanMatch = koreanTypeName && koreanTypeName.includes(searchTerm);
      
      return basicMatch || koreanMatch;
    });
    
    setFilteredSensors(filtered);
  }, [sensors, searchTerm, getSensorTypeName]);

  // 센서 타입 목록 (config에서 가져옴)
  const sensorTypes = SENSOR_TYPES_FOR_FILTER;
  
  // 사용자 scope에 따른 구역 목록 필터링
  const getAllowedZones = () => {
    // ZONE_INFO에서 동적으로 구역 목록 생성
    const allZones = Object.keys(ZONE_INFO).map(zoneId => ({
      value: zoneId,
      scope: zoneId[0].toLowerCase() // A01 -> 'a', B01 -> 'b', C01 -> 'c'
    }));
    
    // '전체' 옵션 추가
    allZones.unshift({ value: 'all', scope: null });


    // 사용자 scope가 없으면 모든 구역 표시
    if (!user?.scope) {
      return allZones.map(zone => zone.value);
    }

    // 사용자 scope에 따라 필터링 (배열과 문자열 모두 처리)
    const userScopes = Array.isArray(user.scope) 
      ? user.scope.map(s => s.trim().toLowerCase()) // 이미 배열이면 소문자 변환
      : user.scope.split(',').map(s => s.trim().toLowerCase()); // 문자열이면 split 후 소문자 변환
    
    const filteredZones = allZones
      .filter(zone => zone.scope === null || userScopes.includes(zone.scope))
      .map(zone => zone.value);
    
    return filteredZones;
  };
  
  const zones = getAllowedZones();

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
      <SearchFilterSection
        searchConfig={{
          label: "검색",
          placeholder: "센서ID, 센서종류, 구역 검색",
          value: searchTerm
        }}
        filters={[
          {
            key: "sensorType",
            label: "센서 종류",
            type: "select",
            value: filterType,
            options: sensorTypes.map(type => ({
              value: type,
              label: type === 'all' ? '전체' : getSensorTypeName(type)
            }))
          },
          {
            key: "zone",
            label: "구역",
            type: "select",
            value: filterZone,
            options: zones.map(zone => ({
              value: zone,
              label: zone === 'all' ? '전체' : zone
            }))
          }
        ]}
        resultCount={filteredSensors.length}
        onSearchChange={setSearchTerm}
        onFilterChange={(key, value) => {
          if (key === 'sensorType') setFilterType(value);
          if (key === 'zone') setFilterZone(value);
        }}
      />

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
                <tr key={`${sensor.sensorId}-${sensor.zoneId}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sensor.sensorId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sensor.zoneId.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSensorTypeName(sensor.sensorType)}
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
