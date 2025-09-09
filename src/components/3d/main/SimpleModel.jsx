import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';

// 호버 오버레이용 간단한 3D 모델
function SimpleModel({ modelPath, onLoad }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  

  
  // 모델을 중심으로 위치 조정
  useEffect(() => {
    if (gltf.scene) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [gltf.scene, onLoad]);

  return (
    <group>
      <primitive 
        object={gltf.scene} 
        scale={[0.002, 0.002, 0.002]}
        position={[0, 0, 0]}
      />
      
      {/* 부드러운 조명 설정 */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8}
        castShadow={false}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.15} color="#4f46e5" />
      <pointLight position={[5, -5, 5]} intensity={0.1} color="#06b6d4" />
    </group>
  );
}

export default SimpleModel;
