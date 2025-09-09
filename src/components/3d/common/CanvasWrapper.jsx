import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// 공통 Canvas 래퍼 컴포넌트
export const CanvasWrapper = ({
  children,
  camera = { position: [10, 10, 10], fov: 75 },
  style = { width: '100%', height: '100%' },
  background = 'transparent',
  enableShadows = false,
  orbitControls = true,
  orbitConfig = {},
  className = '',
  onCreated = null,
  fallback = null
}) => {
  const defaultOrbitConfig = {
    enableDamping: true,
    dampingFactor: 0.05,
    ...orbitConfig
  };

  return (
    <Canvas
      camera={camera}
      style={style}
      className={className}
      shadows={enableShadows}
      onCreated={({ gl }) => {
        if (background === 'transparent') {
          gl.setClearColor(0x000000, 0);
        }
        if (onCreated) onCreated({ gl });
      }}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
      
      {orbitControls && (
        <OrbitControls {...defaultOrbitConfig} />
      )}
    </Canvas>
  );
};

// 특화된 Canvas 래퍼들
export const ZoneCanvas = ({ children, ...props }) => (
  <CanvasWrapper
    camera={{ position: [10, 10, 10], fov: 75 }}
    orbitConfig={{
      maxPolarAngle: Math.PI / 2,
      minDistance: 5,
      maxDistance: 50
    }}
    {...props}
  >
    {children}
  </CanvasWrapper>
);

export const HoverCanvas = ({ children, ...props }) => (
  <CanvasWrapper
    camera={{ position: [10, 10, 10], fov: 75 }}
    orbitConfig={{
      enablePan: false,
      enableZoom: false,
      autoRotate: true,
      autoRotateSpeed: 0.8
    }}
    {...props}
  >
    {children}
  </CanvasWrapper>
);

export const MainCanvas = ({ children, ...props }) => (
  <CanvasWrapper
    camera={{ position: [5, 7, 5], fov: 45 }}
    enableShadows={true}
    {...props}
  >
    {children}
  </CanvasWrapper>
);
