import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// 커스텀 훅
import { useZoneSensorData } from '../../hooks/useZoneSensorData';

// 컴포넌트
import ZoneDrawingSection from '../../components/3d/zone/ZoneDrawingSection';
import SensorDataSection from '../../components/3d/zone/SensorDataSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import ConnectionError from '../../components/common/ConnectionError';

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

  /**
   * 연결 재시도 핸들러
   */
  const handleRetryConnection = useCallback(() => {
    // 페이지 새로고침으로 연결 재시도
    window.location.reload();
  }, []);

  // 로딩 상태 표시
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <main className="flex items-start gap-[30px] relative w-full min-w-[1200px] p-6 pb-[30px] h-[calc(100vh-156px)]">
        {/* 연결 오류 표시 */}
        <ConnectionError 
          connectionState={connectionState}
          onRetry={handleRetryConnection}
        />
        
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
    </ErrorBoundary>
  );
};

export default Zone;