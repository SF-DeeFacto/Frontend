import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

// 호버 오버레이용 간단한 3D 모델
function SimpleModel({ modelPath }) {
  const gltf = useLoader(GLTFLoader, modelPath);
  

  
  // 모델을 중심으로 위치 조정
  useEffect(() => {
    if (gltf.scene) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
    }
  }, [gltf]);

  return (
    <group>
      <primitive 
        object={gltf.scene} 
        scale={[0.002, 0.002, 0.002]}
        position={[0, 0, 0]}
      />
      
      {/* 기본적인 광원 추가 */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ambientLight intensity={0.5} />
    </group>
  );
}

export default SimpleModel;
