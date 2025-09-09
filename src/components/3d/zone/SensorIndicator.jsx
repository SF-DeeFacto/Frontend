import React, { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { getStatusHexColor } from '../../../config/sensorConfig';

// 3D 센서 인디케이터 컴포넌트
function SensorIndicator({ position, status, onClick, sensorName, sensorData }) {
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousValue, setPreviousValue] = useState(null);
  const meshRef = useRef();
  const glowRef = useRef();
   
  const getColor = () => {
    return getStatusHexColor(status);
  };

  // 센서 인디케이터 크기 조정
  const getSensorSize = () => {
    return 0.3; // 작은 크기로 조정
  };

  // 센서 데이터 변경 감지 및 애니메이션 트리거
  useEffect(() => {
    if (!sensorData || !sensorName) return;

    // 센서 데이터에서 현재 센서의 값 찾기
    const getCurrentSensorValue = () => {
      for (const [sensorType, sensors] of Object.entries(sensorData)) {
        if (Array.isArray(sensors)) {
          const foundSensor = sensors.find(sensor => {
            const sensorId = sensor.sensorId || sensor.id || '';
            return sensorId.toLowerCase() === sensorName.toLowerCase();
          });
          
          if (foundSensor) {
            if (foundSensor.sensorType === 'particle') {
              return `${foundSensor.val_0_1}-${foundSensor.val_0_3}-${foundSensor.val_0_5}`;
            }
            return foundSensor.val;
          }
        }
      }
      return null;
    };

    const currentValue = getCurrentSensorValue();
    
    if (previousValue !== null && previousValue !== currentValue) {
      setIsAnimating(true);
      // 애니메이션 지속 시간 후 상태 리셋
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    setPreviousValue(currentValue);
  }, [sensorData, sensorName, previousValue]);

  // 애니메이션 프레임 업데이트
  useFrame((state) => {
    if (isAnimating && meshRef.current && glowRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = Math.sin(time * 8) * 0.1 + 1; // 빠른 깜빡임
      const opacity = Math.sin(time * 6) * 0.3 + 0.7; // 투명도 변화
      
      meshRef.current.scale.setScalar(pulse);
      glowRef.current.scale.setScalar(pulse * 1.3);
      glowRef.current.material.opacity = opacity;
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
        ref={meshRef}
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
      <mesh ref={glowRef} scale={hovered ? 1.5 : 1.3}>
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
