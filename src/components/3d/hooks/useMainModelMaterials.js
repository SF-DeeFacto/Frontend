import { useCallback } from 'react';
import * as THREE from 'three';
import { getStatus3DColor } from '../../../config/sensorConfig';

export const useMainModelMaterials = () => {
  // Zone 상태 키 매핑
  const getZoneStatusKey = useCallback((meshName) => {
    const zoneMapping = {
      // 소문자 메쉬
      'a01': 'zone_A',
      'a02': 'zone_A02',
      'b01': 'zone_B', 
      'b02': 'zone_B02',
      'b03': 'zone_B03',
      'b04': 'zone_B04',
      'c01': 'zone_C01',
      'c02': 'zone_C02',
      // 대문자 메쉬
      'A01': 'zone_A',
      'A02': 'zone_A02',
      'B01': 'zone_B', 
      'B02': 'zone_B02',
      'B03': 'zone_B03',
      'B04': 'zone_B04',
      'C01': 'zone_C01',
      'C02': 'zone_C02'
    };
    return zoneMapping[meshName];
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
