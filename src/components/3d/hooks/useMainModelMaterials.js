import { useCallback } from 'react';
import * as THREE from 'three';
import { getStatus3DColor, ZONE_MAPPING } from '../../../config/sensorConfig';

export const useMainModelMaterials = () => {
  // Zone 상태 키 매핑 (API 응답 형식에 맞게 수정)
  const getZoneStatusKey = useCallback((meshName) => {
    // ZONE_MAPPING을 사용하되, 대소문자 모두 지원
    const lowerCaseMapping = Object.fromEntries(
      Object.entries(ZONE_MAPPING).map(([key, value]) => [key.toLowerCase(), value])
    );
    const upperCaseMapping = Object.fromEntries(
      Object.entries(ZONE_MAPPING).map(([key, value]) => [key.toUpperCase(), value])
    );
    
    return lowerCaseMapping[meshName] || upperCaseMapping[meshName] || ZONE_MAPPING[meshName];
  }, []);

  // Zone 상태에 따른 재질 업데이트
  const updateZoneMaterials = useCallback((scene, zoneStatuses) => {
    if (!zoneStatuses) return;

    let updatedMeshCount = 0;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.userData?.isClickable && child.userData?.hasSignalLight) {
          const zoneStatusKey = getZoneStatusKey(child.name);
          const status = zoneStatuses[zoneStatusKey];
          
          if (status) {
            const statusColor = getStatus3DColor(status);
            
            // 새로운 재질 생성 (MeshStandardMaterial 사용)
            const newMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(statusColor),
              emissive: new THREE.Color(statusColor).multiplyScalar(0.5),
              metalness: 0.1,
              roughness: 0.7,
              transparent: true,
              opacity: 0.4  // 60% 투명도 (40% 불투명)
            });
            
            // 기존 재질의 속성 복사 (텍스처 등)
            if (child.material.map) newMaterial.map = child.material.map;
            if (child.material.normalMap) newMaterial.normalMap = child.material.normalMap;
            
            child.material = newMaterial;
            updatedMeshCount++;
          }
        }
      }
    });
  }, [getZoneStatusKey]);

  return {
    getZoneStatusKey,
    updateZoneMaterials
  };
};
