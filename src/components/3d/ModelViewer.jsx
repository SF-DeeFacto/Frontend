import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/mainhome.glb');
  const navigate = useNavigate();
  const [object38Position, setObject38Position] = useState(null);
  const [modelInfo, setModelInfo] = useState({
    position: [4, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [0.001, 0.001, 0.001]
  });




  useEffect(() => {
    // 모델 로딩 후 객체별 클릭 가능 여부와 이동 경로 설정
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // object_10은 A01로 이동
        if (child.name === 'object_10') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/a01'
          };
        }
        // object_22는 A02로 이동
        else if (child.name === 'object_22') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/a02'
          };
        }
        // object_24는 B01로 이동
        else if (child.name === 'object_24') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b01'
          };
          setObject38Position(child.position.clone());
        }
        // object_1은 B02로 이동
        else if (child.name === 'object_1') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b02'
          };
        }
        // object_12는 B03으로 이동
        else if (child.name === 'object_12') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b03'
          };
        }
        // object_9는 B04로 이동
        else if (child.name === 'object_9') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b04'
          };
        }
        // object_16은 C01로 이동
        else if (child.name === 'object_16') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/c01'
          };
        }
        // object_15는 C02로 이동
        else if (child.name === 'object_15') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/c02'
          };
        }
        else {
          // 다른 메시들은 클릭 불가능하게 설정
          child.userData = {
            isClickable: false
          };
        }
      }
    });
  }, [gltf]);

  // 클릭 이벤트 핸들러
  const handleClick = (event) => {
    // 클릭 가능한 메시인지 확인
    if (event.object.userData && event.object.userData.isClickable) {
      const targetPath = event.object.userData.targetPath;
      if (targetPath) {
        navigate(targetPath);
      }
    }
  };

  return (
    <group>
      <primitive 
        object={gltf.scene} 
        scale={modelInfo.scale}
        position={modelInfo.position}
        rotation={modelInfo.rotation}
        onClick={handleClick}
      />
      
      {/* 기본 조명 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export default function ModelViewer() {
  const controlsRef = useRef();

  // 카메라 초기 설정
  useEffect(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      // 이미지에 표시된 회전값 적용 (도 단위를 라디안으로 변환)
      camera.rotation.x = -80.33 * Math.PI / 180; // -80.33°
      camera.rotation.y = 9.66 * Math.PI / 180;   // 9.66°
      camera.rotation.z = 44.57 * Math.PI / 180;  // 44.57°
    }
  }, []);



  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model />
      <OrbitControls 
        ref={controlsRef}
        target={[2.096, -3.749, 3.199]}
        position={[3.989, 7.212, 5.067]}

        enableDamping={true}
        dampingFactor={0.05}
      />
    </Suspense>
  );
} 