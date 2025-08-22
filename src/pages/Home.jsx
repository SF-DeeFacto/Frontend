import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ZoneButtons, 
  ThreeDModelSection 
} from '../components/3d/zone';
import { useZoneManager } from '../hooks/useZoneManager';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // Zone 상태 관리 훅 사용
  const { zoneStatuses, connectionStates, lastUpdated, zones } = useZoneManager();

  // 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (!userData.name) {
        navigate('/login');
        return;
      }
    } catch (error) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div>
      {/* 전체도면 섹션 (안전 상태 신호등 포함) */}
      <ThreeDModelSection
        zoneStatuses={zoneStatuses}
        hoveredZone={hoveredZone}
        onHoverZoneChange={setHoveredZone}
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