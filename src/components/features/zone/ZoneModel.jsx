import React, { useEffect, useRef, useState } from 'react';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import SensorIndicator from '../sensor/SensorIndicator';
import { getSensorTypeConfig, getSensorTypeFromName, isValidSensor, getStatusText } from '../../../utils/sensorUtils';
import { LoadingSpinner } from '../../ui';

function ZoneModel({ modelPath, zoneId, sensorData, selectedObject, onObjectClick }) {
  const [modelError, setModelError] = useState(null);
  
  const gltf = useLoader(GLTFLoader, modelPath, undefined, (error) => {
    console.error('3D 모델 로딩 실패:', error);
    setModelError(error);
  });
  
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
          const sensorId = sensor.sensorId || sensor.id || '';
          
          // 정확한 매칭만 사용 (대소문자 무시)
          return sensorId.toLowerCase() === sensorName.toLowerCase();
        });
        
        if (foundSensor) {
          const status = foundSensor.sensorStatus || foundSensor.status || foundSensor.state || 'normal';
          return status;
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
          const sensorId = sensor.sensorId || sensor.id || '';
          
          // 정확한 매칭만 사용 (대소문자 무시)
          return sensorId.toLowerCase() === sensorName.toLowerCase();
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
    
            // 실제 모델에서 센서를 동적으로 찾기 - 공통 설정 사용
        const traverseFoundSensors = [];
        
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.name) {
            // 센서 타입 분류 규칙을 사용하여 센서 확인
            const sensorType = getSensorTypeFromName(child.name);
            if (isValidSensor(child.name)) {
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
          // 실제 센서 데이터에서 상태 가져오기
          const actualStatus = getSensorStatusFromData(clickedObject.name);
          const sensorInfo = getSensorInfoFromData(clickedObject.name);
          
          onObjectClick({
            name: clickedObject.name,
            position: worldPosition,
            object: clickedObject,
            isSensor: true,
            status: actualStatus, // 실제 센서 상태 사용
            id: clickedObject.name,
            type: getSensorType(clickedObject.name),
            sensorData: sensorInfo // 센서 데이터 추가
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

  // 모델 로딩 에러 처리
  if (modelError) {
    return (
      <Html center>
        <div className="flex flex-col items-center justify-center p-8 bg-red-50/90 dark:bg-red-900/20 rounded-lg shadow-lg backdrop-blur-sm border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center mb-4">
            {zoneId.toUpperCase()} 구역 모델을 불러올 수 없습니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </Html>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive 
        object={gltf.scene} 
        scale={[0.002, 0.002, 0.002]} 
        onPointerDown={handleClick}
      />

      {Object.entries(sensorPositions).map(([meshName, sensorPositionData]) => {
        // 센서 타입 분류 - 통합 센서 설정 사용
        const getSensorType = (name) => {
          return getSensorTypeFromName(name);
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

      {/* 광원 - 적당히 어둡게 조정 */}
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <ambientLight intensity={0.6} />


    </group>
  );
}

export default ZoneModel;