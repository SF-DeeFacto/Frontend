// 통합 설정 기반 Zone 상태 데이터 생성기 사용
// 기존 하드코딩된 데이터를 모두 제거하고 동적 생성으로 변경

import { 
  generateZoneStatusData, 
  generateZoneStatusVersions,
  getZoneStatusData,
  getAllZoneStatusVersions,
  zoneStatusData,
  zoneStatusDataV2,
  zoneStatusDataV3,
  zoneStatusDataV4
} from './zoneStatusGenerator';

// 기존 호환성을 위한 상수들
export { 
  zoneStatusData,
  zoneStatusDataV2,
  zoneStatusDataV3,
  zoneStatusDataV4
};

// 동적 Zone 상태 데이터 생성 함수들
export { 
  getZoneStatusData,
  getAllZoneStatusVersions
};
