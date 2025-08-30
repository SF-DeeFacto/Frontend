import React, { useEffect, useRef, useState } from 'react';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import SensorIndicator from './SensorIndicator';
import { getSensorTypeConfig, getStatusText } from '../../../config/sensorConfig';

function ZoneModel({ modelPath, zoneId, onObjectClick, selectedObject }) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const groupRef = useRef();
  const { camera, raycaster, gl } = useThree();
  const [sensorPositions, setSensorPositions] = useState({});
  const [isModelReady, setIsModelReady] = useState(false);
  const [sensorData, setSensorData] = useState({}); // 센서 데이터 상태 추가
  const frameCountRef = useRef(0);

  // 모델 초기 설정 (중심 이동, 그룹 위치/회전)
  useEffect(() => {
    if (!gltf.scene) return;
    
    // 여기서만 모델링 위치 조정해야합니다.!!!!!!!!!!!!!!!!!!
    // 카메라 설정 - 모델을 더 작게 보이게 하기
    camera.position.set(10, 10, 19);
    camera.lookAt(0, 0, 0);

    // 모델 중심 정렬
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(center);

    // 그룹 위치 및 회전
    if (groupRef.current) {
      // groupRef.current.position.set(-1.5, 1, -3); // 위치 설정 제거
      // groupRef.current.rotation.y = Math.PI / 4; // 회전 제거
    }

    setIsModelReady(true);
  }, [gltf.scene, camera]);

  // useFrame으로 모델 안정화 후 센서 위치 계산
  useFrame(() => {
    if (!isModelReady || !gltf.scene || frameCountRef.current > 10) return;
    frameCountRef.current++;

    // 몇 프레임 기다린 후 센서 위치 계산
    if (frameCountRef.current === 5) {
      calculateSensorPositions();
    }
  });

  const calculateSensorPositions = () => {
    if (!gltf.scene) return;

    // 월드 매트릭스 업데이트
    gltf.scene.updateWorldMatrix(true, true);

    const foundSensors = {};
    const sensorNames = Array.from({ length: 55 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`);

    sensorNames.forEach(meshName => {
      const target = gltf.scene.getObjectByName(meshName);
      if (target) {
        // 센서 객체는 클릭 불가능하게 설정
        target.userData.clickable = false;
        target.userData.sensorName = meshName;

        const box = new THREE.Box3().setFromObject(target);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // 센서 데이터 생성 (실제로는 API에서 가져와야 함)
        const sensorInfo = {
          position: [center.x, box.max.y, center.z],
          mesh: target,
          status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.9 ? 'error' : 'normal',
          temperature: Math.floor(Math.random() * 30) + 15, // 15-45°C
          humidity: Math.floor(Math.random() * 40) + 30,   // 30-70%
          pressure: Math.floor(Math.random() * 100) + 900, // 900-1000 hPa
          lastUpdate: new Date().toLocaleTimeString()
        };

        foundSensors[meshName] = sensorInfo;
      }
    });

    setSensorPositions(foundSensors);
    setSensorData(foundSensors);
  };

  // 센서 인디케이터 클릭 이벤트
  const handleSensorIndicatorClick = (sensorName) => {
    const sensor = sensorData[sensorName];
    if (sensor && onObjectClick) {
      onObjectClick({
        name: sensorName,
        position: sensor.position,
        isSensor: true,
        status: sensor.status,
        id: sensorName,
        type: 'sensor',
        temperature: sensor.temperature,
        humidity: sensor.humidity,
        pressure: sensor.pressure,
        lastUpdate: sensor.lastUpdate
      });
    }
  };

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={[0.002, 0.002, 0.002]} />

      {/* 센서 인디케이터들 - 클릭 가능 */}
      {Object.entries(sensorPositions).map(([meshName, sensorData]) => {
        return (
          <SensorIndicator
            key={meshName}
            position={sensorData.position}
            status={sensorData.status}
            sensorName={meshName}
            onClick={() => handleSensorIndicatorClick(meshName)}
          />
        );
      })}

      {/* 광원 */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ambientLight intensity={0.5} />

      {/* 선택된 센서 정보 */}
      {selectedObject && (
        <Html
          position={[0, 2, 0]}
          center
          distanceFactor={15}
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #374151',
            minWidth: '250px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{selectedObject.name} 센서</h3>
              <button onClick={() => onObjectClick(null)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>
            {selectedObject.isSensor && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">상태:</span>
                  <span className={`font-medium ${
                    selectedObject.status === 'normal'
                      ? 'text-green-400'
                      : selectedObject.status === 'warning'
                      ? 'text-yellow-400'
                      : selectedObject.status === 'error'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}>{getStatusText(selectedObject.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">온도:</span>
                  <span className="text-green-400">{selectedObject.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">습도:</span>
                  <span className="text-blue-400">{selectedObject.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">압력:</span>
                  <span className="text-purple-400">{selectedObject.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">센서 ID:</span>
                  <span className="text-white">{selectedObject.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">최근 업데이트:</span>
                  <span className="text-gray-400 text-xs">{selectedObject.lastUpdate}</span>
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default ZoneModel;
