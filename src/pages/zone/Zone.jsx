import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hasZoneAccess, showPermissionError, getZoneDisplayName } from '../../utils/permissions';
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// import ThreeElement from '../../ThreeElement.jsx';
// import WarningLight from '../../components/WarningLight.jsx';

const Zone = ({ zoneId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentZoneId = zoneId || params.zoneId;
  
  // 권한 체크
  useEffect(() => {
    if (!hasZoneAccess(currentZoneId)) {
      showPermissionError(currentZoneId);
      navigate('/home'); // 권한이 없으면 홈으로 리다이렉트
      return;
    }
  }, [currentZoneId, navigate]);

  // 권한이 없으면 아무것도 렌더링하지 않음
  if (!hasZoneAccess(currentZoneId)) {
    return null;
  }

  const zoneName = getZoneDisplayName(currentZoneId);

  return (
    <div style={{ 
      display: 'flex',
      width: '870px',
      height: '496px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f0f8ff',
      border: '2px solid #4a90e2',
      borderRadius: '8px',
      padding: '16px',
      position: 'relative'
    }}>
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-blue-800">
          {zoneName} 도면을 넣거에용용
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          현재 Zone: {zoneName}
        </p>
      </div>
      {/* <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ThreeElement />
        <OrbitControls />
      </Canvas> */}
      
      {/* 경고등 */}
      {/* <WarningLight 
        position={{ x: 435, y: 248 }}
        isActive={true}
        targetPosition={{ x: 435, y: 248 }}
      />
       */}

    </div>
  );
};

export default Zone; 