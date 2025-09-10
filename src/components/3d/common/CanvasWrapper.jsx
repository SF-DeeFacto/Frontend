import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MODEL_CONFIG } from '../../../config/modelConfig';

// 공통 Canvas 래퍼 컴포넌트
export const CanvasWrapper = ({
  children,
  camera = MODEL_CONFIG.CAMERA_CONFIG.DEFAULT,
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
    camera={MODEL_CONFIG.CAMERA_CONFIG.ZONE}
    orbitConfig={MODEL_CONFIG.CAMERA_CONFIG.ZONE.orbitConfig}
    {...props}
  >
    {children}
  </CanvasWrapper>
);

export const HoverCanvas = ({ children, ...props }) => (
  <CanvasWrapper
    camera={MODEL_CONFIG.CAMERA_CONFIG.HOVER}
    orbitConfig={MODEL_CONFIG.CAMERA_CONFIG.HOVER.orbitConfig}
    {...props}
  >
    {children}
  </CanvasWrapper>
);

export const MainCanvas = ({ children, ...props }) => (
  <CanvasWrapper
    camera={MODEL_CONFIG.CAMERA_CONFIG.MAIN}
    enableShadows={MODEL_CONFIG.CAMERA_CONFIG.MAIN.enableShadows}
    {...props}
  >
    {children}
  </CanvasWrapper>
);
