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

  const handleClick = (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    if (onClick) {
      onClick();
    }
  };

  return (
    <group position={position}>
      {/* 메인 센서 인디케이터 (신호등) */}
      <mesh
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
        userData={{ clickable: true }}
      >
        <sphereGeometry args={[getSensorSize(), 16, 16]} />
        <meshBasicMaterial 
          color={getColor()} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* 발광 효과 (상태등 효과) */}
      <mesh scale={hovered ? 1.5 : 1.3}>
        <sphereGeometry args={[getSensorSize(), 16, 16]} />
        <meshBasicMaterial 
          color={getColor()} 
          transparent 
          opacity={hovered ? 0.5 : 0.3}
        />
      </mesh>

      {/* 호버 시 센서 이름 표시 */}
      {hovered && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={20}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {sensorName}
        </Html>
      )}
    </group>
  );
}

export default SensorIndicator;
