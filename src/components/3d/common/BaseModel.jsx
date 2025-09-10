import React from 'react';
import { useModelLoader } from '../../../hooks/useModelLoader';
import { SensorRenderer } from './SensorRenderer';
import { BasicLighting, SoftLighting, EnhancedLighting } from './Lighting';

// 기본 모델 컴포넌트
export const BaseModel = ({ 
  modelPath, 
  onLoad, 
  sensorData, 
  zoneId, 
  onSensorClick,
  lighting = 'basic',
  scale = [0.002, 0.002, 0.002],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
  zoneStatuses,
  updateZoneMaterials,
  autoCenter = true,
  ...props 
}) => {
  const { gltf, isLoaded, error, sensorPositions } = useModelLoader(modelPath, {
    autoCenter,
    onLoad: (loadedGltf) => {
      if (onLoad) onLoad(loadedGltf);
    },
    onError: (err) => {
      console.error('모델 로딩 에러:', err);
    }
  });

  // Zone 상태 변경 시 재질 업데이트
  React.useEffect(() => {
    if (gltf?.scene && zoneStatuses && updateZoneMaterials) {
      updateZoneMaterials(gltf.scene, zoneStatuses);
    }
  }, [zoneStatuses, gltf?.scene, updateZoneMaterials]);

  if (error) {
    return (
      <group {...props}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <text position={[0, 2, 0]} fontSize={0.5} color="red">
          모델 로딩 실패: {error.message}
        </text>
      </group>
    );
  }

  if (!isLoaded || !gltf.scene) {
    return null;
  }

  const LightingComponent = {
    basic: BasicLighting,
    soft: SoftLighting,
    enhanced: EnhancedLighting
  }[lighting] || BasicLighting;

  return (
    <group {...props}>
      <primitive 
        object={gltf.scene} 
        scale={scale}
        position={position}
        rotation={rotation}
      />
      
      {/* 센서 렌더링 */}
      {sensorData && (
        <SensorRenderer
          sensorPositions={sensorPositions}
          sensorData={sensorData}
          onSensorClick={onSensorClick}
          zoneId={zoneId}
        />
      )}
      
      {/* 조명 설정 */}
      <LightingComponent />
      
      {/* 추가 자식 컴포넌트 */}
      {children}
    </group>
  );
};
