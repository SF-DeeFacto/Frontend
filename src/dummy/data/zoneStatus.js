// 더미데이터 시작 - 이 파일 전체가 더미데이터 래퍼입니다
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
// 더미데이터 끝 (삭제) - 이 파일 전체가 더미데이터 래퍼입니다
