import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStatusHexColor } from '../../../config/sensorConfig';

// 3D 센서 인디케이터 컴포넌트
function SensorIndicator({ position, status, onClick, sensorName, sensorData }) {
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousValue, setPreviousValue] = useState(null);
  const meshRef = useRef();
  const glowRef = useRef();
  const haloRef = useRef();
  const rippleRef = useRef();
  const animationStartRef = useRef(0);
   
  const getColor = () => {
    return getStatusHexColor(status);
  };

  // 센서 인디케이터 크기 조정
  const getSensorSize = () => {
    return 0.3; // 작은 크기로 조정
  };

  // 상태별 애니메이션 프로파일
  // TODO: 자열 비교를 사용하고 있으므로 상수로 변경하기 어렵
  const animationProfile = useMemo(() => {
    const base = { breathSpeed: 0.6, breathAmp: 0.08, rippleSpeed: 1.2, rippleDuration: 1.2 };
    switch ((status || '').toString().toUpperCase()) {
      case 'RED':
      case 'ERROR':
      case 'DANGER':
        return { breathSpeed: 1.2, breathAmp: 0.14, rippleSpeed: 1.8, rippleDuration: 1.2 };
      case 'YELLOW':
      case 'WARNING':
        return { breathSpeed: 0.9, breathAmp: 0.12, rippleSpeed: 1.4, rippleDuration: 1.2 };
      case 'DISCONNECTED':
      case 'UNKNOWN':
        return { breathSpeed: 0.5, breathAmp: 0.06, rippleSpeed: 1.0, rippleDuration: 1.0 };
      default:
        return base;
    }
  }, [status]);

  // 광륜 스프라이트 텍스처 생성 (방사 그라데이션)
  const haloTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.18)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

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
            if (foundSensor.sensorType === 'particle' || foundSensor.sensorType?.startsWith('particle_')) {
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
      animationStartRef.current = performance.now() / 1000; // seconds
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
    const time = state.clock.getElapsedTime();

    // 상시 호흡형 광륜
    if (haloRef.current) {
      const breath = 1 + Math.sin(time * (2 * animationProfile.breathSpeed)) * animationProfile.breathAmp;
      haloRef.current.scale.set(breath, breath, breath);
      if (haloRef.current.material) {
        haloRef.current.material.opacity = 0.3 + (breath - 1) * 0.8;
      }
    }

    // 업데이트 리플 & 강화 펄스
    if (isAnimating && glowRef.current) {
      const pulse = Math.sin(time * 8) * 0.1 + 1;
      const opacity = Math.sin(time * 6) * 0.3 + 0.7;
      if (meshRef.current) meshRef.current.scale.setScalar(pulse);
      glowRef.current.scale.setScalar(pulse * 1.25);
      glowRef.current.material.opacity = opacity;

      if (rippleRef.current) {
        const elapsed = Math.max(0, time - animationStartRef.current);
        const t = Math.min(1, elapsed / animationProfile.rippleDuration);
        const ease = t * (2 - t); // ease-out
        const base = getSensorSize();
        const scale = 1 + ease * 2.5; // 확산
        rippleRef.current.scale.set(base * scale, base * scale, 1);
        rippleRef.current.material.opacity = (1 - ease) * 0.6;
        if (t >= 1) {
          // 리플 1회 후 종료
          rippleRef.current.material.opacity = 0;
        }
      }
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
      {/* 광륜 스프라이트 (상시 호흡) */}
      <sprite ref={haloRef} scale={[1.2, 1.2, 1]}> 
        <spriteMaterial
          map={haloTexture}
          color={getColor()}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.35}
        />
      </sprite>

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

      {/* 레이더 리플 (업데이트 트리거) */}
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.27, 32]} />
        <meshBasicMaterial
          color={getColor()}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
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
