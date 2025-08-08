import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function B01Model() {
  const gltf = useLoader(GLTFLoader, '/models/B01.glb');
  const groupRef = useRef();

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

  return (
    <group ref={groupRef}>
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
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [10, 10, 10], fov: 75 }}
          style={{ width: '100%', height: '100%', background: '#f0f0f0' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f0f0f0');
          }}
        >
          <Suspense fallback={null}>
            <B01Model />
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
