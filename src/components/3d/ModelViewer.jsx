import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/mainhome.glb');
  const navigate = useNavigate();

  useEffect(() => {
    // 모델 로딩 후 객체별 클릭 가능 여부와 이동 경로 설정
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // object_11은 A01로 이동
        if (child.name === 'object_11') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/a01'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> A01');
        }
        // object_2는 C01로 이동
        else if (child.name === 'object_2') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/c01'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> C01');
        }
        // object_36은 B04로 이동
        else if (child.name === 'object_36') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b04'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> B04');
        }
        // object_37은 B03으로 이동
        else if (child.name === 'object_37') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b03'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> B03');
        }
        // object_38은 B02로 이동
        else if (child.name === 'object_38') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b02'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> B02');
        }
        // object_39은 B01로 이동
        else if (child.name === 'object_39') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b01'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> B01');
        }
        // object_40은 A02로 이동
        else if (child.name === 'object_40') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/a02'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> A02');
        }
        // object_9는 C02로 이동
        else if (child.name === 'object_9') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/c02'
          };
          console.log('클릭 가능한 메시 설정:', child.name, '-> C02');
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
    console.log('클릭된 객체:', event.object.name);
    
    // 클릭 가능한 메시인지 확인
    if (event.object.userData && event.object.userData.isClickable) {
      console.log('클릭 가능한 메시 클릭됨:', event.object.name);
      const targetPath = event.object.userData.targetPath;
      if (targetPath) {
        navigate(targetPath);
      }
    } else {
      console.log('클릭 불가능한 메시:', event.object.name);
    }
  };

  return (
    <group>
      <primitive 
        object={gltf.scene} 
        scale={[0.0013, 0.0013, 0.0013]}
        position={[0, 0, 0]}
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
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model />
      <OrbitControls />
    </Suspense>
  );
} 