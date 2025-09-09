import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import SensorIndicator from '../zone/SensorIndicator';

// 호버 오버레이용 간단한 3D 모델
function SimpleModel({ modelPath, onLoad, sensorData, zoneId }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sensorPositions, setSensorPositions] = useState({});
  
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  

  
  // 모델을 중심으로 위치 조정 및 센서 위치 찾기
  useEffect(() => {
    if (gltf.scene) {
      // 모델 중심화
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      
      // 센서 위치 찾기 (최적화된 방식)
      const foundSensors = {};
      const sensorPatterns = ['ESD', 'LPM', 'HUM', 'WD', 'TEMP'];
      
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name) {
          // 센서 패턴 확인 (더 효율적인 방식)
          const isSensor = sensorPatterns.some(pattern => 
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
      
      setSensorPositions(foundSensors);
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [gltf.scene, onLoad]);

  // 센서 상태를 가져오는 함수 (최적화)
  const getSensorStatus = (sensorName) => {
    if (!sensorData || Object.keys(sensorData).length === 0) {
      return 'unknown';
    }

    const lowerSensorName = sensorName.toLowerCase();
    
    // 센서 데이터를 한 번만 순회
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

  return (
    <group>
      <primitive 
        object={gltf.scene} 
        scale={[0.002, 0.002, 0.002]}
        position={[0, 0, 0]}
      />
      
      {/* 센서 인디케이터들 */}
      {Object.entries(sensorPositions).map(([sensorName, sensorData]) => (
        <SensorIndicator
          key={sensorName}
          position={sensorData.position}
          status={getSensorStatus(sensorName)}
          sensorName={sensorName}
          sensorData={sensorData}
          onClick={() => console.log(`센서 클릭: ${sensorName}`)}
        />
      ))}
      
      {/* 부드러운 조명 설정 */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8}
        castShadow={false}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.15} color="#4f46e5" />
      <pointLight position={[5, -5, 5]} intensity={0.1} color="#06b6d4" />
    </group>
  );
}

export default SimpleModel;
