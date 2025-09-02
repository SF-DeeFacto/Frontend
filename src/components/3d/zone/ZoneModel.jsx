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
  const clickableObjectsRef = useRef([]);
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

  // 모든 매쉬 이름 출력 함수
  const logAllMeshNames = () => {
    if (!gltf.scene) return;
    
    console.log('=== 3D 모델의 모든 매쉬 이름 ===');
    const allMeshes = [];
    const sensorLikeMeshes = [];
    const esdMeshes = [];
    const lpmMeshes = [];
    const humMeshes = [];
    const wdMeshes = [];
    const tempMeshes = [];
    
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        const meshInfo = {
          name: child.name,
          type: child.type,
          position: child.position.toArray(),
          visible: child.visible,
          parent: child.parent ? child.parent.name : 'No Parent'
        };
        
        allMeshes.push(meshInfo);
        
        // 센서 패턴 분류 (모든 센서 타입)
        if (child.name.match(/^S\d{2}$/)) {
          sensorLikeMeshes.push(child.name);
        } else if (child.name.includes('ESD')) {
          esdMeshes.push(child.name);
        } else if (child.name.includes('LPM')) {
          lpmMeshes.push(child.name);
        } else if (child.name.includes('HUM')) {
          humMeshes.push(child.name);
        } else if (child.name.includes('WD')) {
          wdMeshes.push(child.name);
        } else if (child.name.includes('TEMP')) {
          tempMeshes.push(child.name);
        }
      }
    });
    
    // 이름순으로 정렬
    allMeshes.sort((a, b) => a.name.localeCompare(b.name));
    
    allMeshes.forEach(mesh => {
      console.log(`📦 "${mesh.name}" (${mesh.type}) - 부모: ${mesh.parent} - 위치: [${mesh.position.map(p => p.toFixed(3)).join(', ')}] - 보임: ${mesh.visible}`);
    });
    
    console.log(`\n총 ${allMeshes.length}개의 매쉬 발견`);
    console.log(`S** 패턴 센서: ${sensorLikeMeshes.length}개 -`, sensorLikeMeshes.sort());
    console.log(`ESD 관련: ${esdMeshes.length}개 -`, esdMeshes.sort());
    console.log(`LPM 관련: ${lpmMeshes.length}개 -`, lpmMeshes.sort());
    console.log(`HUM 관련: ${humMeshes.length}개 -`, humMeshes.sort());
    console.log(`WD 관련: ${wdMeshes.length}개 -`, wdMeshes.sort());
    console.log(`TEMP 관련: ${tempMeshes.length}개 -`, tempMeshes.sort());
    console.log('================================');
  };

  const calculateSensorPositions = () => {
    if (!gltf.scene) return;

    // 모든 매쉬 이름 로그 출력
    logAllMeshNames();

    // 월드 매트릭스 업데이트
    gltf.scene.updateWorldMatrix(true, true);

    const foundSensors = {};
    const clickableObjects = [];
    
    // 실제 모델에서 센서를 동적으로 찾기 (하드코딩된 센서 이름 제거)
    const actualSensorNames = [];
    
    // 하드코딩된 센서 이름 검색 제거 - traverse로만 센서 찾기

    // traverse로 센서 동적 검색 (하드코딩된 센서 이름 제거)
    console.log('=== traverse로 센서 동적 검색 ===');
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
          console.log(`🔍 traverse로 찾은 센서: "${child.name}"`);
          
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
    
    console.log(`traverse로 찾은 센서 총 ${traverseFoundSensors.length}개:`, traverseFoundSensors.sort());
    console.log(`최종 발견된 센서: ${Object.keys(foundSensors).length}개`);

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

      {Object.entries(sensorPositions).map(([meshName, sensorData]) => {
        // 센서 타입 분류
        const getSensorType = (name) => {
          if (name.includes('ESD')) return 'ESD';
          if (name.includes('Handle')) return 'Handle';
          if (name.includes('HUM')) return 'Humidity';
          if (name.includes('WD')) return 'WaterDetector';
          if (name.includes('TEM')) return 'Temperature';
          return 'Unknown';
        };

        return (
          <SensorIndicator
            key={meshName}
            position={sensorData.position}
            status="normal" // 기본 상태
            sensorName={meshName} // 실제 센서 이름 사용
            onClick={() => handleSensorClick({ 
              name: meshName, 
              position: sensorData.position, 
              status: 'normal', 
              id: meshName, 
              type: getSensorType(meshName)
            })}
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
            minWidth: '220px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{selectedObject.name}</h3>
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
                  <span className="text-gray-300">센서 ID:</span>
                  <span className="text-white font-mono">{selectedObject.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">센서 타입:</span>
                  <span className="text-blue-400">{selectedObject.type}</span>
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