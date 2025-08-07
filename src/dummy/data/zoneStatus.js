// 초기 상태
export const zoneStatusData = {
  "code": "OK",
  "message": "요청 성공",
  "data": [
    { "zoneName": "zone_A", "status": "GREEN" },
    { "zoneName": "zone_B", "status": "GREEN" },
    { "zoneName": "zone_A02", "status": "GREEN" },
    { "zoneName": "zone_B02", "status": "YELLOW" },
    { "zoneName": "zone_B03", "status": "GREEN" },
    { "zoneName": "zone_B04", "status": "YELLOW" },
    { "zoneName": "zone_C01", "status": "GREEN" },
    { "zoneName": "zone_C02", "status": "GREEN" }
  ]
};

// 30초 후 상태 변화 시뮬레이션
export const zoneStatusDataV2 = {
  "code": "OK",
  "message": "요청 성공",
  "data": [
    { "zoneName": "zone_A", "status": "YELLOW" },
    { "zoneName": "zone_B", "status": "YELLOW" },
    { "zoneName": "zone_A02", "status": "GREEN" },
    { "zoneName": "zone_B02", "status": "YELLOW" },
    { "zoneName": "zone_B03", "status": "YELLOW" },
    { "zoneName": "zone_B04", "status": "GREEN" },
    { "zoneName": "zone_C01", "status": "GREEN" },
    { "zoneName": "zone_C02", "status": "YELLOW" }
  ]
};

// 60초 후 상태 변화 시뮬레이션
export const zoneStatusDataV3 = {
  "code": "OK",
  "message": "요청 성공",
  "data": [
    { "zoneName": "zone_A", "status": "GREEN" },
    { "zoneName": "zone_B", "status": "YELLOW" },
    { "zoneName": "zone_A02", "status": "YELLOW" },
    { "zoneName": "zone_B02", "status": "GREEN" },
    { "zoneName": "zone_B03", "status": "YELLOW" },
    { "zoneName": "zone_B04", "status": "YELLOW" },
    { "zoneName": "zone_C01", "status": "YELLOW" },
    { "zoneName": "zone_C02", "status": "GREEN" }
  ]
};

// 90초 후 상태 변화 시뮬레이션
export const zoneStatusDataV4 = {
  "code": "OK",
  "message": "요청 성공",
  "data": [
    { "zoneName": "zone_A", "status": "YELLOW" },
    { "zoneName": "zone_B", "status": "GREEN" },
    { "zoneName": "zone_A02", "status": "GREEN" },
    { "zoneName": "zone_B02", "status": "YELLOW" },
    { "zoneName": "zone_B03", "status": "YELLOW" },
    { "zoneName": "zone_B04", "status": "GREEN" },
    { "zoneName": "zone_C01", "status": "GREEN" },
    { "zoneName": "zone_C02", "status": "YELLOW" }
  ]
}; 