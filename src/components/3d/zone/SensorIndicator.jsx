import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { getStatusHexColor } from '../../../config/sensorConfig';

// 3D 센서 인디케이터 컴포넌트
function SensorIndicator({ position, status, onClick, sensorName }) {
  const [hovered, setHovered] = useState(false);
   
  const getColor = () => {
    return getStatusHexColor(status);
  };

  // 센서 인디케이터 크기 조정
  const getSensorSize = () => {
    return 0.3; // 작은 크기로 조정
  };

  return (
    <group position={position}>
      {/* 메인 센서 인디케이터 (신호등) */}
      <mesh
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[getSensorSize(), 16, 16]} />
        <meshBasicMaterial 
          color={getColor()} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* 발광 효과 (상태등 효과) */}
      <mesh scale={1.3}>
        <sphereGeometry args={[getSensorSize(), 16, 16]} />
        <meshBasicMaterial 
          color={getColor()} 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

export default SensorIndicator;
