import * as THREE from 'three';

/**
 * 센서 Mesh의 AABB 정보 계산
 * @param {THREE.Object3D} mesh - 대상 메쉬
 * @returns {Object} AABB 정보 (box, size, center, boxMax)
 */
export const calculateMeshBounds = (mesh) => {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  
  box.getSize(size);
  box.getCenter(center);
  
  return {
    box,
    size: [size.x, size.y, size.z],
    center: [center.x, center.y, center.z],
    boxMax: [box.max.x, box.max.y, box.max.z]
  };
};

/**
 * 센서 인디케이터 위치 계산
 * @param {Object} bounds - calculateMeshBounds 결과
 * @param {number} offset - 메쉬 표면에서의 오프셋 (기본값: 0.2)
 * @returns {Array} [x, y, z] 위치 좌표
 */
export const calculateIndicatorPosition = (bounds, offset = 0.2) => {
  const [centerX, centerY, centerZ] = bounds.center;
  const [maxX, maxY, maxZ] = bounds.boxMax;
  
  return [
    centerX,
    maxY + offset, // 메쉬 표면 위에 약간 올림
    centerZ
  ];
};

/**
 * S01부터 S55까지의 센서 ID 배열 생성
 * @returns {Array} 센서 ID 배열
 */
export const generateSensorIds = () => {
  const sensorIds = [];
  for (let i = 1; i <= 55; i++) {
    sensorIds.push(`S${i.toString().padStart(2, '0')}`);
  }
  return sensorIds;
};

/**
 * GLB 모델에서 센서 메쉬들을 찾고 위치 정보 계산
 * @param {THREE.Scene} scene - GLB 모델의 scene
 * @param {string} zoneId - Zone ID (로깅용)
 * @returns {Object} 발견된 센서들의 위치 정보
 */
export const findAndCalculateSensorPositions = (scene, zoneId) => {
  const foundSensors = {};
  const sensorIds = generateSensorIds();
  
  sensorIds.forEach(meshName => {
    const target = scene.getObjectByName(meshName);
    
    if (target) {
      console.log(`✅ ${zoneId} ${meshName} 메쉬 발견:`, target);
      
      // 메쉬의 AABB 구하기
      const bounds = calculateMeshBounds(target);
      
      // 센서 인디케이터 위치 계산
      const indicatorPosition = calculateIndicatorPosition(bounds);
      
      // 센서 정보 저장
      foundSensors[meshName] = {
        mesh: target,
        position: indicatorPosition,
        center: bounds.center,
        size: bounds.size,
        boxMax: bounds.boxMax
      };
      
      console.log(`📍 ${zoneId} ${meshName} 센서 위치:`, {
        center: bounds.center.map(p => p.toFixed(3)),
        size: bounds.size.map(p => p.toFixed(3)),
        indicatorPosition: indicatorPosition.map(p => p.toFixed(3))
      });
    } else {
      console.log(`❌ ${zoneId} ${meshName} 메쉬를 찾을 수 없습니다.`);
    }
  });
  
  return foundSensors;
};

/**
 * 센서 데이터에서 meshName에 해당하는 센서 찾기
 * @param {string} meshName - 찾을 메쉬 이름
 * @param {Object} sensorData - 센서 데이터 객체
 * @returns {Object|null} 찾은 센서 데이터
 */
export const findSensorDataByMeshName = (meshName, sensorData) => {
  if (!sensorData) return null;
  
  // sensorData는 센서 타입별로 그룹화되어 있음
  // 모든 센서 타입에서 해당 meshName을 가진 센서 찾기
  for (const sensorType in sensorData) {
    const sensorsOfType = sensorData[sensorType];
    const foundSensor = sensorsOfType.find(sensor => 
      sensor.sensor_id === meshName || 
      sensor.sensor_id.toLowerCase() === meshName.toLowerCase()
    );
    
    if (foundSensor) {
      return {
        sensorId: foundSensor.sensor_id,
        sensorType: foundSensor.sensor_type,
        sensorStatus: foundSensor.status,
        timestamp: foundSensor.timestamp,
        values: foundSensor.sensor_type === 'particle' 
          ? { '0.1': foundSensor.val_0_1, '0.3': foundSensor.val_0_3, '0.5': foundSensor.val_0_5 }
          : { value: foundSensor.val }
      };
    }
  }
  
  return null;
};

/**
 * 모델의 전체 크기와 중심점 계산
 * @param {THREE.Scene} scene - GLB 모델의 scene
 * @returns {Object} 모델 크기 정보
 */
export const calculateModelBounds = (scene) => {
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = new THREE.Vector3();
  box.getSize(size);
  
  return {
    box,
    center: [center.x, center.y, center.z],
    size: [size.x, size.y, size.z],
    maxDimension: Math.max(size.x, size.y, size.z)
  };
};
