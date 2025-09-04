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
  const { isAuthenticated, isLoading } = useAuth();
  
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
    <div>
      {/* 전체도면 섹션 (안전 상태 신호등 포함) */}
      <ThreeDModelSection
        zoneStatuses={zoneStatuses}
        hoveredZone={hoveredZone}
        onHoverZoneChange={setHoveredZone}
        lastUpdated={lastUpdated}
      />

      {/* Zone 버튼들 */}
      <ZoneButtons
        zones={zones}
        zoneStatuses={zoneStatuses}
        connectionStates={connectionStates}
        lastUpdated={lastUpdated}
      />
    </div>
  );
};

export default Home; 