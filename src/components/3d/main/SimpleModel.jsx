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
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      
      // 센서 위치 찾기
      const foundSensors = {};
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name) {
          // 센서 패턴 확인
          if (child.name.includes('ESD') || 
              child.name.includes('LPM') || 
              child.name.includes('HUM') || 
              child.name.includes('WD') ||
              child.name.includes('TEMP')) {
            
            const box = new THREE.Box3().setFromObject(child);
            const center = new THREE.Vector3();
            box.getCenter(center);
            
            foundSensors[child.name] = {
              position: [center.x, box.max.y, center.z],
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

  // 센서 상태를 가져오는 함수
  const getSensorStatus = (sensorName) => {
    if (!sensorData || Object.keys(sensorData).length === 0) {
      return 'unknown';
    }

    for (const [sensorType, sensors] of Object.entries(sensorData)) {
      if (Array.isArray(sensors)) {
        const foundSensor = sensors.find(sensor => {
          const sensorId = sensor.sensorId || sensor.id || '';
          return sensorId.toLowerCase() === sensorName.toLowerCase();
        });
        
        if (foundSensor) {
          return foundSensor.sensorStatus || foundSensor.status || foundSensor.state || 'normal';
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
