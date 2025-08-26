import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// 커스텀 훅
import { useZoneSensorData } from '../../hooks/useZoneSensorData';

// 컴포넌트
import ZoneDrawingSection from '../../components/3d/zone/ZoneDrawingSection';
import SensorDataSection from '../../components/3d/zone/SensorDataSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// 스타일
import '../../styles/zone.css';

const Zone = ({ zoneId }) => {
  const params = useParams();
  const currentZoneId = zoneId || params.zoneId;
  
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
    <main className="flex items-start gap-[30px] relative w-full min-w-[1200px] p-6 pb-[30px] h-[calc(100vh-156px)]">
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