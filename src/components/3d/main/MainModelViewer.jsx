import React, { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useMainZoneMapping, useMainModelMaterials } from '../hooks';
import { useAuth } from '../../../hooks/useAuth';
import { BaseModel } from '../common/BaseModel';
import { useModelInteractions } from '../../../hooks/useModelInteractions';

function Model({ zoneStatuses, onHoverZoneChange }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canAccessPath = (path) => {
    if (!path) return false;
    // /home/zone/a01 형태에서 a01 추출
    const parts = String(path).split('/');
    const last = parts[parts.length - 1] || '';
    const zoneScope = last[0]?.toLowerCase();
    if (!user?.scope) return true;
    
    // scope가 문자열인지 확인
    if (typeof user.scope !== 'string') {
      console.warn('user.scope is not a string:', user.scope);
      return true; // 안전하게 접근 허용
    }
    
    const scopes = Array.isArray(user.scope) 
      ? user.scope.map(s => s.trim().toLowerCase())
      : user.scope.split(',').map((s) => s.trim().toLowerCase());
    
    return scopes.includes(zoneScope);
  };

  const [modelInfo, setModelInfo] = useState({
    position: [0, -18, 0],
    rotation: [0, 58 * Math.PI / 180, 0],
    scale: [0.01, 0.01, 0.01]
  });

  // Zone 매핑 훅 사용
  const { setupZoneMapping } = useMainZoneMapping();
  
  // 재질 관리 훅 사용
  const { updateZoneMaterials } = useMainModelMaterials();

  // 모델 로딩 후 초기 설정과 재질 업데이트를 BaseModel에서 처리
  const handleModelLoad = (loadedGltf) => {
    if (loadedGltf.scene) {
      // Zone 매핑 설정
      setupZoneMapping(loadedGltf.scene, navigate);
    }
  };



  const { handlePointerOver, handlePointerOut, handleClick } = useModelInteractions({
    onHoverZoneChange,
    onZoneClick: (zoneInfo) => {
      if (zoneInfo.targetPath && canAccessPath(zoneInfo.targetPath)) {
        navigate(zoneInfo.targetPath);
      }
    }
  });

  return (
    <BaseModel
      modelPath="/models/mainhome-meshopt.glb"
      onLoad={handleModelLoad}
      lighting="enhanced"
      scale={modelInfo.scale}
      position={modelInfo.position}
      rotation={modelInfo.rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      zoneStatuses={zoneStatuses}
      updateZoneMaterials={updateZoneMaterials}
      autoCenter={false}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export default function MainModelViewer({ zoneStatuses, onHoverZoneChange }) {
  const controlsRef = useRef();

  // 카메라 초기 설정
  useEffect(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      // 이미지에 표시된 회전값 적용 (도 단위를 라디안으로 변환)
      camera.rotation.x = -80.33 * Math.PI / 180; // -80.33°
      camera.rotation.y = 9.66 * Math.PI / 180;   // 9.66°
      camera.rotation.z = 44.57 * Math.PI / 180;  // 44.57°
    }
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model zoneStatuses={zoneStatuses} onHoverZoneChange={onHoverZoneChange} />
      <OrbitControls 
        ref={controlsRef}
        target={[2.096, -3.749, 3.199]}
        position={[3.989, 7.212, 5.067]}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Suspense>
  );
} 
