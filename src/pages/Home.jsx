import React, { useState } from 'react';
import { 
  ZoneButtons, 
  ThreeDModelSection 
} from '../components/3d/zone';
import { useZoneManager } from '../hooks/useZoneManager';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // 인증 상태 확인
  const { isAuthenticated, isLoading } = useAuth({ redirectOnFail: false });
  
  // Zone 상태 관리 훅 사용
  const { zoneStatuses, connectionStates, lastUpdated, zones } = useZoneManager();

  // 로딩 중이면 스피너 표시
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 인증되지 않은 경우 useAuth에서 자동으로 리다이렉트됨
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* 3D 모델 섹션 - 상단 영역 */}
      <section className="flex-1 min-h-0">
        <ThreeDModelSection
          zoneStatuses={zoneStatuses}
          hoveredZone={hoveredZone}
          onHoverZoneChange={setHoveredZone}
          lastUpdated={lastUpdated}
        />
      </section>

      {/* Zone 버튼 섹션 - 하단 영역 */}
      <section className="flex-shrink-0 mb-6">
        <ZoneButtons
          zones={zones}
          zoneStatuses={zoneStatuses}
          connectionStates={connectionStates}
          lastUpdated={lastUpdated}
        />
      </section>
    </div>
  );
};

export default Home; 