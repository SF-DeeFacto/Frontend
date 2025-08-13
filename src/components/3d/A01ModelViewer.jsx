import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function A01Model({ onObjectClick }) {
  const gltf = useLoader(GLTFLoader, '/models/A01.glb');
  const groupRef = useRef();
  const { raycaster, camera, gl } = useThree();
  
  // 클릭 가능한 객체들을 저장
  const clickableObjects = useMemo(() => {
    const objects = [];
    // 센서 그룹 정의
    console.log('🔍 A01 모델 로딩 중... 객체들을 스캔합니다.');
    
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
          
          // A01존의 센서들을 매칭 (온도센서 2개, 습도센서 2개, 정전기센서 4개, 먼지센서 2개, 풍향센서 2개)
          const sensorMappings = {
            // 온도센서 2개
            'A01_TEMP_01': [1, 2, 3], // 예시 ID
            'A01_TEMP_02': [4, 5, 6], // 예시 ID
            // 습도센서 2개
            'A01_HUMI_01': [7, 8, 9], // 예시 ID
            'A01_HUMI_02': [10, 11, 12], // 예시 ID
            // 정전기센서 4개
            'A01_ESD_01': [13, 14, 15], // 예시 ID
            'A01_ESD_02': [16, 17, 18], // 예시 ID
            'A01_ESD_03': [19, 20, 21], // 예시 ID
            'A01_ESD_04': [22, 23, 24], // 예시 ID
            // 먼지센서 2개
            'A01_LPM_01': [25, 26, 27], // 예시 ID
            'A01_LPM_02': [28, 29, 30], // 예시 ID
            // 풍향센서 2개
            'A01_WD_01': [31, 32, 33], // 예시 ID
            'A01_WD_02': [34, 35, 36]  // 예시 ID
          };
          
          // 센서 매칭 확인
          for (const [sensorId, targetIds] of Object.entries(sensorMappings)) {
            if (targetIds.includes(child.id)) {
              sensorName = sensorId;
              console.log(`✅ 센서 그룹 매칭: ${child.name} (ID: ${child.id}) -> ${sensorName}`);
              break;
            }
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

export default function A01ModelViewer() {
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
            <A01Model onObjectClick={handleObjectClick} />
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