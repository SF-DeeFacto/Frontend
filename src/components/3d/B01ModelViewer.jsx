import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function B01Model({ onObjectClick }) {
  const gltf = useLoader(GLTFLoader, '/models/B01.glb');
  const groupRef = useRef();
  const { raycaster, camera, gl } = useThree();
  
  // 클릭 가능한 객체들을 저장
  const clickableObjects = useMemo(() => {
    const objects = [];
    // 센서 그룹 정의
    console.log('🔍 B01 모델 로딩 중... 객체들을 스캔합니다.');
    
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // 객체에 이름이 없다면 기본 이름 설정
          if (!child.name || child.name === '') {
            child.name = `Object_${child.id}`;
          }
          
          // 디버깅: 모든 객체 이름 출력
          console.log('객체 이름:', child.name, '객체 ID:', child.id);
          
          // 센서 그룹에 속하는 객체인지 확인 (강제 매칭)
          let sensorName = null;
          
          // 특정 ID들을 LPM-002 먼지센서로 강제 설정
          const targetIds = [7, 6, 12, 15, 18, 14, 13];
          const targetNames = ['Object_7', 'Object_6', 'Object_12', 'Object_15', 'Object_18', 'Object_14', 'Object_13'];
          const targetAltNames = ['object_7', 'object_6', 'object_12', 'object_15', 'object_18', 'object_14', 'object_13'];
          
          if (targetIds.includes(child.id) || 
              targetNames.includes(child.name) || 
              targetAltNames.includes(child.name) ||
              child.name.toLowerCase().includes('object_7') ||
              child.name.toLowerCase().includes('object_6') ||
              child.name.toLowerCase().includes('object_12') ||
              child.name.toLowerCase().includes('object_15') ||
              child.name.toLowerCase().includes('object_18') ||
              child.name.toLowerCase().includes('object_14') ||
              child.name.toLowerCase().includes('object_13')) {
            sensorName = 'LPM-002 먼지센서';
            console.log(`✅ 센서 그룹 매칭: ${child.name} (ID: ${child.id}) -> ${sensorName}`);
          }
          
          // 클릭 가능하도록 설정
          child.userData.clickable = true;
          child.userData.sensorName = sensorName; // 센서 이름 저장
          objects.push(child);
        }
      });
    }
    return objects;
  }, [gltf.scene]);

  useEffect(() => {
    if (groupRef.current) {
      // 그룹을 중심으로 모델 배치
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      
      // 모델을 그룹의 중심으로 이동
      gltf.scene.position.sub(center);
      
      // 그룹 자체를 약간 위로 이동
      groupRef.current.position.y = 1;
    }
  }, [gltf]);

  // 클릭 이벤트 처리
  const handleClick = (event) => {
    event.stopPropagation();
    
    // 마우스 좌표를 정규화된 디바이스 좌표로 변환
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 레이캐스터 설정
    raycaster.setFromCamera(mouse, camera);
    
    // 교차점 계산
    const intersects = raycaster.intersectObjects(clickableObjects, false);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.userData.clickable) {
        console.log('클릭된 객체:', clickedObject.name);
        console.log('센서 이름:', clickedObject.userData.sensorName);
        
        // 센서 그룹에 속하는 객체라면 같은 그룹의 모든 객체 하이라이트
        if (clickedObject.userData.sensorName) {
          highlightSensorGroup(clickedObject.userData.sensorName);
        } else {
          // 일반 객체는 개별 하이라이트
          highlightObject(clickedObject);
        }
        
        // 부모 컴포넌트에 클릭 정보 전달
        if (onObjectClick) {
          const displayName = clickedObject.userData.sensorName || clickedObject.name;
          console.log('표시될 이름:', displayName);
          onObjectClick({
            name: displayName,
            position: clickedObject.position,
            object: clickedObject,
            isSensor: !!clickedObject.userData.sensorName
          });
        }
      }
    }
  };

  // 객체 하이라이트 함수
  const highlightObject = (object) => {
    // 이전 하이라이트 제거
    clickableObjects.forEach(obj => {
      if (obj.material && obj.material.emissive) {
        obj.material.emissive.setHex(0x000000);
      }
    });
    
    // 새로운 객체 하이라이트
    if (object.material && object.material.emissive) {
      object.material.emissive.setHex(0x444444);
    }
  };

  // 센서 그룹 하이라이트 함수
  const highlightSensorGroup = (sensorName) => {
    // 이전 하이라이트 제거
    clickableObjects.forEach(obj => {
      if (obj.material && obj.material.emissive) {
        obj.material.emissive.setHex(0x000000);
      }
    });
    
    // 같은 센서 그룹의 모든 객체 하이라이트
    clickableObjects.forEach(obj => {
      if (obj.userData.sensorName === sensorName) {
        if (obj.material && obj.material.emissive) {
          obj.material.emissive.setHex(0x0066ff); // 센서는 파란색으로 하이라이트
        }
      }
    });
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <primitive 
        object={gltf.scene} 
        scale={[0.01, 0.01, 0.01]}
      />
      
      {/* 기본적인 광원 추가 */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ambientLight intensity={0.5} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function ErrorBoundary({ children }) {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      {children}
    </React.Suspense>
  );
}

export default function B01ModelViewer() {
  const [selectedObject, setSelectedObject] = useState(null);
  
  const handleObjectClick = (objectInfo) => {
    setSelectedObject(objectInfo);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* 선택된 객체 정보 표시 */}
      {selectedObject && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          zIndex: 1000,
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          maxWidth: '300px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
            {selectedObject.isSensor ? '선택된 센서' : '선택된 객체'}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            {selectedObject.name}
          </div>
          {/* {selectedObject.isSensor && (
            <div style={{ fontSize: '12px', color: '#4ade80', marginBottom: '4px' }}>
              ✓ 센서 그룹
            </div>
          )} */}
          {/* <div style={{ fontSize: '12px', color: '#ccc' }}>
            위치: ({selectedObject.position.x.toFixed(2)}, {selectedObject.position.y.toFixed(2)}, {selectedObject.position.z.toFixed(2)})
          </div> */}
          <button
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setSelectedObject(null)}
          >
            ×
          </button>
        </div>
      )}
      
      {/* 사용법 안내 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        zIndex: 1000
      }}>
      * 센서를 클릭하면 센서의 정보를 확인할 수 있습니다.
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [10, 10, 10], fov: 75 }}
          style={{ width: '100%', height: '100%', background: '#f0f0f0' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f0f0f0');
          }}
        >
          <Suspense fallback={null}>
            <B01Model onObjectClick={handleObjectClick} />
          </Suspense>
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </div>
  );
}
