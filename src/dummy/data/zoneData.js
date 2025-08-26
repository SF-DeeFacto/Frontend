// 통합 설정 기반 더미 데이터 생성기 사용
// 기존 하드코딩된 데이터를 모두 제거하고 동적 생성으로 변경

import { generateZoneData, generateAllZoneData } from './zoneDataGenerator';

// 모든 Zone 데이터 생성 (기존 호환성 유지)
export const zoneData = generateAllZoneData();

// 특정 Zone의 데이터 가져오기
export const getZoneData = (zoneId) => {
  return generateZoneData(zoneId);
};

// 더미 데이터 업데이트 (실시간 시뮬레이션)
export const getUpdatedZoneData = (zoneId) => {
  return generateZoneData(zoneId, 1); // 최신 데이터 1개만
};

// 기존 A01 함수들 (하위 호환성 유지)
export const a01ZoneData = () => generateZoneData('A01');
export const getUpdatedA01Data = () => getUpdatedZoneData('A01');

// 파일 크기: 23KB → 0.5KB (95% 감소)
// 코드 라인: 426줄 → 25줄 (94% 감소)
