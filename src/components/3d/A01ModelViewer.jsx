import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

function A01Model() {
  const gltf = useLoader(GLTFLoader, '/models/A01.glb');
  const sceneRef = useRef();

  useEffect(() => {
    console.log('=== 초기 설정 ===');
    console.log('모델 원본 위치:', gltf.scene.position);
    console.log('모델 원본 스케일:', gltf.scene.scale);
  }, [gltf]);

  const handleClick = () => {
    if (sceneRef.current) {
      console.log('=== 현재 상태 ===');
      console.log('모델 현재 위치:', sceneRef.current.position);
      console.log('모델 현재 스케일:', sceneRef.current.scale);
    }
  };

  return (
    <group>
      <primitive 
        ref={sceneRef}
        object={gltf.scene} 
        scale={[0.1, 0.1, 0.1]}
        position={[0, -0.5, 0]}
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

export default function A01ModelViewer() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <A01Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
} 