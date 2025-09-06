import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// 커스텀 훅
import { useZoneSensorData } from '../../hooks/useZoneSensorData';

// 컴포넌트
import ZoneDrawingSection from '../../components/3d/zone/ZoneDrawingSection';
import SensorDataSection from '../../components/3d/zone/SensorDataSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// 스타일은 index.css에서 관리

const Zone = ({ zoneId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentZoneId = zoneId || params.zoneId;
  
  // 접근 권한 체크 (직접 URL 접근 대비)
  useEffect(() => {
    if (!currentZoneId) return;
    if (!user?.scope) return; // scope 미설정이면 모든 구역 접근 허용
    const scopes = user.scope.split(',').map((s) => s.trim().toLowerCase());
    const zoneScope = String(currentZoneId)[0]?.toLowerCase();
    if (!scopes.includes(zoneScope)) {
      window.alert('해당 구역에 대한 접근 권한이 없습니다.');
      navigate('/home');
    }
  }, [currentZoneId, user?.scope, navigate]);
  
  // 센서 데이터 관리 훅 사용
  const { sensorData, isLoading, connectionState } = useZoneSensorData(currentZoneId);
  
  // 선택된 객체 상태 관리
  const [selectedObject, setSelectedObject] = useState(null);
  
  /**
   * 센서 클릭 핸들러
   */
  const handleObjectClick = useCallback((objectInfo) => {
    setSelectedObject(objectInfo);
  }, []);

  /**
   * 센서 정보 패널 닫기 핸들러
   */
  const handleCloseSensorInfo = useCallback(() => {
    setSelectedObject(null);
  }, []);

  // 로딩 상태 표시
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="flex items-start gap-[15px] relative w-full pb-[30px] h-[calc(100vh-156px)]">
      {/* Zone 도면 영역 */}
      <ZoneDrawingSection
        zoneId={currentZoneId}
        sensorData={sensorData}
        selectedObject={selectedObject}
        onObjectClick={handleObjectClick}
        onCloseSensorInfo={handleCloseSensorInfo}
      />

      {/* 실시간 센서 데이터 영역 */}
      <SensorDataSection
        sensorData={sensorData}
        connectionState={connectionState}
        zoneId={currentZoneId}
      />
    </main>
  );
};

export default Zone;
