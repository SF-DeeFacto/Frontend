// 더미데이터 시작 - 이 파일 전체가 더미데이터 생성용입니다
import { SENSOR_STATUS } from '../../types/sensor';
import { ZONE_DETAILED_CONFIG } from '../../config/zoneConfig';

// Zone 상태 랜덤 생성
const generateRandomZoneStatus = () => {
  const statuses = [SENSOR_STATUS.GREEN, SENSOR_STATUS.YELLOW, SENSOR_STATUS.RED];
  const weights = [0.5, 0.3, 0.2]; // GREEN: 60%, YELLOW: 30%, RED: 10%
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return statuses[i];
    }
  }
  
  return SENSOR_STATUS.GREEN;
};

// Zone 상태 데이터 생성
export const generateZoneStatusData = (version = 1) => {
  // 실제 API에서 반환되는 존들과 일치하도록 고정
  // 실제 예시에서 zone_B02가 중복되어 있으므로 그대로 유지
  const zones = [
    "A01", "A02", "B01", "B02", "B02", "B03", "B04", "C01", "C02"
  ];
  
  const data = zones.map(zoneId => ({
    zoneName: `zone_${zoneId}`,
    status: generateRandomZoneStatus()
  }));

  return {
    code: "OK",
    message: "요청 성공",
    data
  };
};

// 여러 버전의 Zone 상태 데이터 생성
export const generateZoneStatusVersions = (count = 4) => {
  const versions = {};
  
  for (let i = 1; i <= count; i++) {
    versions[`zoneStatusDataV${i}`] = generateZoneStatusData(i);
  }
  
  return versions;
};

// 기존 호환성을 위한 상수들
export const zoneStatusData = generateZoneStatusData(1);
export const zoneStatusDataV2 = generateZoneStatusData(2);
export const zoneStatusDataV3 = generateZoneStatusData(3);
export const zoneStatusDataV4 = generateZoneStatusData(4);

// 동적 Zone 상태 데이터 생성
export const getZoneStatusData = (version = 1) => {
  return generateZoneStatusData(version);
};

// 모든 버전의 Zone 상태 데이터 가져오기
export const getAllZoneStatusVersions = () => {
  return generateZoneStatusVersions();
};
// 더미데이터 끝 (삭제) - 이 파일 전체가 더미데이터 생성용입니다
