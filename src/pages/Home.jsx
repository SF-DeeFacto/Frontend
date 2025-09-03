import React, { useState, memo } from 'react';
import { 
  ZoneButtons, 
  ThreeDModelSection 
} from '@components/3d/zone';
import { useZoneManager, useAuthGuard } from '@hooks';

const Home = memo(() => {
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // 인증 가드 적용
  const { isAuthenticated } = useAuthGuard();
  
  // Zone 상태 관리 훅 사용
  const { zoneStatuses, connectionStates, lastUpdated, zones } = useZoneManager();

  // 인증되지 않은 경우 아무것도 렌더링하지 않음
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
});

Home.displayName = 'Home';

export default Home; 