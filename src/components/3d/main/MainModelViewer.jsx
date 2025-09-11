import React, { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useMainZoneMapping, useMainModelMaterials } from '../hooks';
import { useAuth } from '../../../hooks/useAuth';
import { BaseModel } from '../common/BaseModel';
import { useModelInteractions } from '../../../hooks/useModelInteractions';
import { getMainModelPath, getMainModelConfig } from '../../../config/modelConfig';

function Model({ zoneStatuses, onHoverZoneChange, onModelLoad, onModelError }) {
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

  // 메인 모델 설정 가져오기
  const modelConfig = getMainModelConfig();
  const [modelInfo, setModelInfo] = useState({
    position: modelConfig.position,
    rotation: modelConfig.rotation,
    scale: modelConfig.scale
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
      
      // 상위 컴포넌트에 로딩 완료 알림
      if (onModelLoad) onModelLoad(loadedGltf);
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
      modelPath={getMainModelPath()}
      onLoad={handleModelLoad}
      onError={onModelError}
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
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="gray" transparent opacity={0.3} />
    </mesh>
  );
}

export default function MainModelViewer({ zoneStatuses, onHoverZoneChange, onLoadingChange, onErrorChange }) {
  const controlsRef = useRef();
  
  // 메인 모델 설정 가져오기
  const modelConfig = getMainModelConfig();
  
  const handleModelLoad = () => {
    if (onLoadingChange) onLoadingChange(false);
    if (onErrorChange) onErrorChange(null);
  };
  
  const handleModelError = (error) => {
    if (onLoadingChange) onLoadingChange(false);
    if (onErrorChange) onErrorChange(error);
  };

  // 카메라 초기 설정
  useEffect(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const { rotation } = modelConfig.camera;
      
      // 설정된 회전값 적용
      camera.rotation.x = rotation.x;
      camera.rotation.y = rotation.y;
      camera.rotation.z = rotation.z;
    }
  }, [modelConfig.camera]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model 
        zoneStatuses={zoneStatuses} 
        onHoverZoneChange={onHoverZoneChange}
        onModelLoad={handleModelLoad}
        onModelError={handleModelError}
      />
      <OrbitControls 
        ref={controlsRef}
        target={modelConfig.camera.target}
        position={modelConfig.camera.position}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Suspense>
  );
} 
