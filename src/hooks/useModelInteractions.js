import { useCallback } from 'react';
import * as THREE from 'three';

// 모델 상호작용 훅
export const useModelInteractions = ({ onHoverZoneChange, onZoneClick }) => {
  // 호버 이벤트 핸들러
  const handlePointerOver = useCallback((event) => {
    if (event.object.userData && event.object.userData.isClickable) {
      const zoneId = event.object.name;
      const zoneName = event.object.userData.zoneName;
      
      document.body.style.cursor = 'pointer';
      
      // 호버 효과를 위한 메쉬 하이라이트
      if (event.object.material) {
        event.object.material.emissive = new THREE.Color(0x444444);
        event.object.material.emissiveIntensity = 0.3;
      }
      
      // 호버된 존 정보를 부모 컴포넌트로 전달
      if (onHoverZoneChange) {
        onHoverZoneChange(zoneId);
      }
    }
  }, [onHoverZoneChange]);

  const handlePointerOut = useCallback((event) => {
    if (event.object.userData && event.object.userData.isClickable) {
      // 호버 효과 제거
      if (event.object.material) {
        event.object.material.emissive = new THREE.Color(0x000000);
        event.object.material.emissiveIntensity = 0;
      }
      
      if (onHoverZoneChange) {
        onHoverZoneChange(null);
      }
      document.body.style.cursor = 'default';
    }
  }, [onHoverZoneChange]);

  // 클릭 이벤트 핸들러
  const handleClick = useCallback((event) => {
    if (event.object.userData && event.object.userData.isClickable) {
      const zoneName = event.object.userData.zoneName;
      const targetPath = event.object.userData.targetPath;
      
      if (zoneName && onZoneClick) {
        onZoneClick({
          zoneName,
          targetPath,
          zoneId: event.object.name
        });
      }
    }
  }, [onZoneClick]);

  return {
    handlePointerOver,
    handlePointerOut,
    handleClick
  };
};
