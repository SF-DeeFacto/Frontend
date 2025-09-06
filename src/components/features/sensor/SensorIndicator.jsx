import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { getStatusHexColor } from '../../../utils/sensorUtils';

// 3D 센서 인디케이터 컴포넌트
function SensorIndicator({ position, status, onClick, sensorName }) {
  const [hovered, setHovered] = useState(false);
  const mainMeshRef = useRef();
  const glowMeshRef = useRef();
  const timeRef = useRef(0);
  
  // 레드 상태인지 확인
  const isRedStatus = status === 'RED' || status === 'error';
   
  const getColor = () => {
    return getStatusHexColor(status);
  };

  // 센서 인디케이터 크기 조정
  const getSensorSize = () => {
    return 0.3; // 작은 크기로 조정
  };

  // 레드 상태 애니메이션
  useFrame((state, delta) => {
    timeRef.current += delta;
    
    if (isRedStatus && mainMeshRef.current && glowMeshRef.current) {
      // 펄스 애니메이션 (크기 변화)
      const pulseScale = 1 + Math.sin(timeRef.current * 3) * 0.1;
      mainMeshRef.current.scale.setScalar(pulseScale);
      
      // 글로우 애니메이션 (투명도 변화)
      const glowOpacity = 0.3 + Math.sin(timeRef.current * 2) * 0.2;
      glowMeshRef.current.material.opacity = glowOpacity;
      
      // 글로우 크기 변화
      const glowScale = 1.3 + Math.sin(timeRef.current * 2.5) * 0.2;
      glowMeshRef.current.scale.setScalar(glowScale);
    }
  });

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
        ref={mainMeshRef}
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
      <mesh 
        ref={glowMeshRef}
        scale={hovered ? 1.5 : 1.3}
      >
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
