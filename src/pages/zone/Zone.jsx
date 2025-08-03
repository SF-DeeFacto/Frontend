import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Zone = ({ zoneId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentZoneId = zoneId || params.zoneId;

  const zoneName = `Zone ${currentZoneId?.toUpperCase() || 'Unknown'}`;

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