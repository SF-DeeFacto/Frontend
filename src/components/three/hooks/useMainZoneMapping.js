import { useCallback } from 'react';
import { ZONE_MAPPING } from '../../../config/zoneConfig';

export const useMainZoneMapping = () => {
  // 오브젝트와 Zone 이름 매핑 (소문자만 - 신호등용)
  const objectZoneMapping = ZONE_MAPPING.LOWER_TO_UPPER;

  // 대문자 메쉬 매핑 (존 이동 전용 - 신호등 없음)
  const upperCaseZoneMapping = ZONE_MAPPING.ID_TO_NAME;

  // Zone 상태 키 매핑
  const getZoneStatusKey = useCallback((meshName) => {
    return ZoneUtils.getZoneStatusKey(meshName);
  }, []);

  // Zone 매핑 설정
  const setupZoneMapping = useCallback((scene, navigate) => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // 소문자 메쉬 확인 (신고등 기능 포함)
        const lowerCaseZoneName = objectZoneMapping[child.name];
        // 대문자 메쉬 확인 (존 이동만)
        const upperCaseZoneName = upperCaseZoneMapping[child.name];
        
        if (lowerCaseZoneName) {
          // 소문자 메쉬 - 신호등 + 존 이동 기능
          child.userData = {
            isClickable: true,
            blockName: child.name,
            zoneName: lowerCaseZoneName,
            targetPath: `/home/zone/${lowerCaseZoneName.toLowerCase().replace('zone ', '').replace(' ', '')}`,
            hasSignalLight: true // 신호등 기능 있음
          };
        } else if (upperCaseZoneName) {
          // 대문자 메쉬 - 존 이동만, 신호등 없음
          child.userData = {
            isClickable: true,
            blockName: child.name,
            zoneName: upperCaseZoneName,
            targetPath: `/home/zone/${upperCaseZoneName.toLowerCase().replace('zone ', '').replace(' ', '')}`,
            hasSignalLight: false // 신호등 기능 없음
          };
        } else {
          // 다른 메시들은 클릭 불가능하게 설정
          child.userData = {
            isClickable: false
          };
        }
      }
    });
  }, []);

  return {
    objectZoneMapping,
    upperCaseZoneMapping,
    getZoneStatusKey,
    setupZoneMapping
  };
};
