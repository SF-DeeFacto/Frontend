import { useCallback } from 'react';

export const useMainZoneMapping = () => {
  // 오브젝트와 Zone 이름 매핑 (소문자만 - 신호등용)
  const objectZoneMapping = {
    'a01': 'Zone A01',
    'a02': 'Zone A02', 
    'b01': 'Zone B01',
    'b02': 'Zone B02',
    'b03': 'Zone B03',
    'b04': 'Zone B04',
    'c01': 'Zone C01',
    'c02': 'Zone C02'
  };

  // 대문자 메쉬 매핑 (존 이동 전용 - 신호등 없음)
  const upperCaseZoneMapping = {
    'A01': 'Zone A01',
    'A02': 'Zone A02', 
    'B01': 'Zone B01',
    'B02': 'Zone B02',
    'B03': 'Zone B03',
    'B04': 'Zone B04',
    'C01': 'Zone C01',
    'C02': 'Zone C02'
  };

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
