import React, { useEffect, useRef, useState } from 'react';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import SensorIndicator from './SensorIndicator';
import { getSensorTypeConfig, getStatusText } from '../../../config/sensorConfig';

function ZoneModel({ modelPath, zoneId, sensorData, selectedObject, onObjectClick }) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const groupRef = useRef();
  const { camera, raycaster, gl } = useThree();
  const [sensorPositions, setSensorPositions] = useState({});
  const [isModelReady, setIsModelReady] = useState(false);
  const clickableObjectsRef = useRef([]);
  const frameCountRef = useRef(0);

  // 센서 데이터에서 센서 상태를 찾는 함수
  const getSensorStatusFromData = (sensorName) => {
    if (!sensorData || Object.keys(sensorData).length === 0) {
      return 'unknown';
    }

    // 센서 이름을 기반으로 센서 데이터에서 찾기
    for (const [sensorType, sensors] of Object.entries(sensorData)) {
      if (Array.isArray(sensors)) {
        const foundSensor = sensors.find(sensor => {
          // 센서 ID나 이름이 매칭되는지 확인
          return sensor.sensorId === sensorName || 
                 sensor.sensorName === sensorName ||
                 sensor.id === sensorName ||
                 sensor.name === sensorName;
        });
        
        if (foundSensor) {
          // 센서 상태 반환 (normal, warning, error 등)
          return foundSensor.status || foundSensor.state || 'normal';
        }
      }
    }
    
    return 'unknown';
  };

  // 센서 데이터에서 센서 정보를 찾는 함수
  const getSensorInfoFromData = (sensorName) => {
    if (!sensorData || Object.keys(sensorData).length === 0) {
      return null;
    }

    for (const [sensorType, sensors] of Object.entries(sensorData)) {
      if (Array.isArray(sensors)) {
        const foundSensor = sensors.find(sensor => {
          return sensor.sensorId === sensorName || 
                 sensor.sensorName === sensorName ||
                 sensor.id === sensorName ||
                 sensor.name === sensorName;
        });
        
        if (foundSensor) {
          return foundSensor;
        }
      }
    }
    
    return null;
  };

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
    const clickableObjects = [];
    
    // 실제 모델에서 센서를 동적으로 찾기 (하드코딩된 센서 이름 제거)
    const actualSensorNames = [];
    
    // 하드코딩된 센서 이름 검색 제거 - traverse로만 센서 찾기

    // traverse로 센서 동적 검색
    const traverseFoundSensors = [];
    
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name) {
        // 실제 센서 패턴 확인 (LPM, TEMP 사용)
        if (child.name.includes('ESD') || 
            child.name.includes('LPM') || 
            child.name.includes('HUM') || 
            child.name.includes('WD') ||
            child.name.includes('TEMP')) {
          traverseFoundSensors.push(child.name);
          
          // 센서 추가
          child.userData.clickable = true;
          child.userData.sensorName = child.name;
          clickableObjects.push(child);

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

    clickableObjectsRef.current = clickableObjects;
    setSensorPositions(foundSensors);
  };

  // 클릭 이벤트
  const handleClick = event => {
    console.log('클릭 이벤트 발생!', event);
    event.stopPropagation();
    
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    console.log('마우스 좌표:', mouse);
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjectsRef.current, false);
    
    console.log('클릭 가능한 객체들:', clickableObjectsRef.current);
    console.log('교차된 객체들:', intersects);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      console.log('클릭된 객체:', clickedObject);
      
      if (clickedObject.userData.clickable) {
        const worldPosition = new THREE.Vector3();
        clickedObject.getWorldPosition(worldPosition);

        if (onObjectClick) {
          onObjectClick({
            name: clickedObject.name,
            position: worldPosition,
            object: clickedObject,
            isSensor: true,
            status: 'normal', // 기본 상태
            id: clickedObject.name,
            type: 'unknown' // 기본 타입
          });
        }
      }
    }
  };

  const handleSensorClick = sensor => {
    if (onObjectClick) {
      onObjectClick({
        name: sensor.name,
        position: sensor.position,
        isSensor: true,
        status: sensor.status,
        id: sensor.id,
        type: sensor.type
      });
    }
  };

  return (
    <group ref={groupRef}>
      <primitive 
        object={gltf.scene} 
        scale={[0.002, 0.002, 0.002]} 
        onPointerDown={handleClick}
      />

      {Object.entries(sensorPositions).map(([meshName, sensorPositionData]) => {
        // 센서 타입 분류
        const getSensorType = (name) => {
          if (name.includes('ESD')) return 'ESD';
          if (name.includes('Handle')) return 'Handle';
          if (name.includes('HUM')) return 'Humidity';
          if (name.includes('WD')) return 'WaterDetector';
          if (name.includes('TEM')) return 'Temperature';
          if (name.includes('LPM')) return 'Particle';
          return 'Unknown';
        };

        // 실제 센서 데이터에서 상태 가져오기
        const actualStatus = getSensorStatusFromData(meshName);
        const sensorInfo = getSensorInfoFromData(meshName);

        return (
          <SensorIndicator
            key={meshName}
            position={sensorPositionData.position}
            status={actualStatus} // 실제 센서 상태 사용
            sensorName={meshName} // 실제 센서 이름 사용
            onClick={() => handleSensorClick({ 
              name: meshName, 
              position: sensorPositionData.position, 
              status: actualStatus, 
              id: meshName, 
              type: getSensorType(meshName),
              sensorInfo: sensorInfo // 실제 센서 정보 추가
            })}
          />
        );
      })}

      {/* 광원 */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ambientLight intensity={0.5} />


    </group>
  );
}

export default ZoneModel;