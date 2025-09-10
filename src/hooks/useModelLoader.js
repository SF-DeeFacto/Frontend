import { useState, useEffect, useCallback } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import { calculateMeshBounds, calculateIndicatorPosition } from '../config/sensorConfig';

// 센서 ID 생성 함수 (로컬 정의)
const generateSensorIds = () => {
  const ids = [];
  for (let i = 1; i <= 55; i++) {
    ids.push(`S${i.toString().padStart(2, '0')}`);
  }
  return ids;
};

// 공통 모델 로더 훅
export const useModelLoader = (modelPath, options = {}) => {
  const {
    autoCenter = true,
    onLoad = null,
    onError = null
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [sensorPositions, setSensorPositions] = useState({});

  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  // 센서 위치 찾기 함수
  const findSensorPositions = useCallback((scene) => {
    const foundSensors = {};
    
    scene.traverse((child) => {
      if (child.isMesh && child.name) {
        const isSensor = SENSOR_PATTERNS.some(pattern => 
          child.name.includes(pattern)
        );
        
        if (isSensor) {
          const childBox = new THREE.Box3().setFromObject(child);
          const childCenter = new THREE.Vector3();
          childBox.getCenter(childCenter);
          
          foundSensors[child.name] = {
            position: [childCenter.x, childBox.max.y, childCenter.z],
            mesh: child
          };
        }
      }
    });
    
    return foundSensors;
  }, []);

  // 모델 로딩 후 처리
  useEffect(() => {
    if (gltf.scene) {
      try {
        // 모델 중심화
        if (autoCenter) {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);
        }

        // 센서 위치 찾기
        const sensors = findSensorPositions(gltf.scene);
        setSensorPositions(sensors);
        
        setIsLoaded(true);
        if (onLoad) onLoad(gltf);
      } catch (err) {
        setError(err);
        if (onError) onError(err);
      }
    }
  }, [gltf.scene, autoCenter, findSensorPositions, onLoad, onError]);

  return {
    gltf,
    isLoaded,
    error,
    sensorPositions,
    findSensorPositions
  };
};

// 센서 상태 가져오기 유틸리티
export const getSensorStatus = (sensorName, sensorData) => {
  if (!sensorData || Object.keys(sensorData).length === 0) {
    return 'unknown';
  }

  const lowerSensorName = sensorName.toLowerCase();
  
  for (const sensors of Object.values(sensorData)) {
    if (Array.isArray(sensors)) {
      for (const sensor of sensors) {
        const sensorId = (sensor.sensorId || sensor.id || '').toLowerCase();
        if (sensorId === lowerSensorName) {
          return sensor.sensorStatus || sensor.status || sensor.state || 'normal';
        }
      }
    }
  }
  
  return 'unknown';
};

// 센서 정보 가져오기 유틸리티
export const getSensorInfo = (sensorName, sensorData) => {
  if (!sensorData || Object.keys(sensorData).length === 0) {
    return null;
  }

  const lowerSensorName = sensorName.toLowerCase();
  
  for (const sensors of Object.values(sensorData)) {
    if (Array.isArray(sensors)) {
      for (const sensor of sensors) {
        const sensorId = (sensor.sensorId || sensor.id || '').toLowerCase();
        if (sensorId === lowerSensorName) {
          return sensor;
        }
      }
    }
  }
  
  return null;
};
