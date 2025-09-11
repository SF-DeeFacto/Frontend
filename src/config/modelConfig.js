/**
 * 3D 모델 관련 설정
 * 모델 경로, 스케일, 카메라 설정 등을 관리
 */

// ==================== 모델 설정 ====================

// 모델 기본 설정
export const MODEL_CONFIG = {
  // 기본 스케일
  DEFAULT_SCALE: [0.002, 0.002, 0.002],
  
  // 기본 위치
  DEFAULT_POSITION: [0, 0, 0],
  
  // 기본 회전
  DEFAULT_ROTATION: [0, 0, 0],
  
  // 모델 경로 설정
  MODEL_PATHS: {
    MAIN: '/models/mainhome-meshopt.glb',
    ZONE_PREFIX: '/models/',
    ZONE_SUFFIX: '-meshopt.glb'
  },
  
  // 존별 모델 설정
  ZONE_MODELS: {
    A01: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    A02: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    B01: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    B02: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    B03: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    B04: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    C01: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    },
    C02: {
      scale: [0.002, 0.002, 0.002],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      camera: { position: [10, 10, 19], lookAt: [0, 0, 0] }
    }
  },
  
  // 메인 모델 설정
  MAIN_MODEL: {
    scale: [0.01, 0.01, 0.01],
    position: [0, -18, 0],
    rotation: [0, 58 * Math.PI / 180, 0],
    camera: {
      rotation: {
        x: -80.33 * Math.PI / 180,
        y: 9.66 * Math.PI / 180,
        z: 44.57 * Math.PI / 180
      },
      target: [2.096, -3.749, 3.199],
      position: [3.989, 7.212, 5.067]
    }
  },
  
  // 카메라 설정
  CAMERA_CONFIG: {
    DEFAULT: {
      position: [10, 10, 10],
      fov: 75
    },
    ZONE: {
      position: [10, 10, 10],
      fov: 75,
      orbitConfig: {
        maxPolarAngle: Math.PI / 2,
        minDistance: 5,
        maxDistance: 50
      }
    },
    HOVER: {
      position: [10, 10, 10],
      fov: 75,
      orbitConfig: {
        enablePan: false,
        enableZoom: false,
        autoRotate: true,
        autoRotateSpeed: 0.8
      }
    },
    MAIN: {
      position: [5, 7, 5],
      fov: 45,
      enableShadows: true
    }
  },
  
  // 센서 패턴
  SENSOR_PATTERNS: ['ESD', 'LPM', 'HUM', 'WD', 'TEMP'],
  
  // 센서 ID 설정
  SENSOR_ID: {
    MAX_COUNT: 55,
    PREFIX: 'S'
  }
};

// ==================== 모델 유틸리티 함수 ====================

// 존 모델 경로 생성
export const getZoneModelPath = (zoneId) => {
  const upperZoneId = zoneId.toUpperCase();
  return `${MODEL_CONFIG.MODEL_PATHS.ZONE_PREFIX}${upperZoneId}${MODEL_CONFIG.MODEL_PATHS.ZONE_SUFFIX}`;
};

// 메인 모델 경로 가져오기
export const getMainModelPath = () => {
  return MODEL_CONFIG.MODEL_PATHS.MAIN;
};

// 존별 모델 설정 가져오기
export const getZoneModelConfig = (zoneId) => {
  const upperZoneId = zoneId.toUpperCase();
  return MODEL_CONFIG.ZONE_MODELS[upperZoneId] || {
    scale: MODEL_CONFIG.DEFAULT_SCALE,
    position: MODEL_CONFIG.DEFAULT_POSITION,
    rotation: MODEL_CONFIG.DEFAULT_ROTATION,
    camera: MODEL_CONFIG.CAMERA_CONFIG.ZONE
  };
};

// 메인 모델 설정 가져오기
export const getMainModelConfig = () => {
  return MODEL_CONFIG.MAIN_MODEL;
};

// 센서 ID 생성
export const generateSensorIds = () => {
  const ids = [];
  for (let i = 1; i <= MODEL_CONFIG.SENSOR_ID.MAX_COUNT; i++) {
    ids.push(`${MODEL_CONFIG.SENSOR_ID.PREFIX}${i.toString().padStart(2, '0')}`);
  }
  return ids;
};

// 센서 패턴 가져오기
export const getSensorPatterns = () => {
  return MODEL_CONFIG.SENSOR_PATTERNS;
};
