// 초기 상태
export const zoneStatusData = {
  "code": "SUCCESS",
  "message": "데이터 조회 성공",
  "data": {
    "zones": [
      { "zone_name": "Zone_A01", "status": "GREEN" },
      { "zone_name": "Zone_A02", "status": "GREEN" },
      { "zone_name": "Zone_B01", "status": "YELLOW" },
      { "zone_name": "Zone_B02", "status": "GREEN" },
      { "zone_name": "Zone_B03", "status": "GREEN" },
      { "zone_name": "Zone_B04", "status": "YELLOW" },
      { "zone_name": "Zone_C01", "status": "RED" },
      { "zone_name": "Zone_C02", "status": "GREEN" }
    ]
  }
};

// 30초 후 상태 변화 시뮬레이션
export const zoneStatusDataV2 = {
  "code": "SUCCESS",
  "message": "데이터 조회 성공",
  "data": {
    "zones": [
      { "zone_name": "Zone_A01", "status": "YELLOW" },
      { "zone_name": "Zone_A02", "status": "GREEN" },
      { "zone_name": "Zone_B01", "status": "RED" },
      { "zone_name": "Zone_B02", "status": "GREEN" },
      { "zone_name": "Zone_B03", "status": "YELLOW" },
      { "zone_name": "Zone_B04", "status": "GREEN" },
      { "zone_name": "Zone_C01", "status": "GREEN" },
      { "zone_name": "Zone_C02", "status": "YELLOW" }
    ]
  }
};

// 60초 후 상태 변화 시뮬레이션
export const zoneStatusDataV3 = {
  "code": "SUCCESS",
  "message": "데이터 조회 성공",
  "data": {
    "zones": [
      { "zone_name": "Zone_A01", "status": "GREEN" },
      { "zone_name": "Zone_A02", "status": "RED" },
      { "zone_name": "Zone_B01", "status": "GREEN" },
      { "zone_name": "Zone_B02", "status": "YELLOW" },
      { "zone_name": "Zone_B03", "status": "GREEN" },
      { "zone_name": "Zone_B04", "status": "RED" },
      { "zone_name": "Zone_C01", "status": "YELLOW" },
      { "zone_name": "Zone_C02", "status": "GREEN" }
    ]
  }
};

// 90초 후 상태 변화 시뮬레이션
export const zoneStatusDataV4 = {
  "code": "SUCCESS",
  "message": "데이터 조회 성공",
  "data": {
    "zones": [
      { "zone_name": "Zone_A01", "status": "YELLOW" },
      { "zone_name": "Zone_A02", "status": "GREEN" },
      { "zone_name": "Zone_B01", "status": "GREEN" },
      { "zone_name": "Zone_B02", "status": "RED" },
      { "zone_name": "Zone_B03", "status": "YELLOW" },
      { "zone_name": "Zone_B04", "status": "GREEN" },
      { "zone_name": "Zone_C01", "status": "GREEN" },
      { "zone_name": "Zone_C02", "status": "RED" }
    ]
  }
}; 