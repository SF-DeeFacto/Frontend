import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/Untitled.glb')
  const groupRef = useRef(null)
  const [floorPosition, setFloorPosition] = useState(null)
  const [blinkIntensity, setBlinkIntensity] = useState(0.5)

  useEffect(() => {
    if (groupRef.current) {
      // 그룹을 중심으로 모델 배치
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = box.getCenter(new THREE.Vector3())
      
      // 모델을 그룹의 중심으로 이동
      gltf.scene.position.sub(center)
      
      // 그룹 자체를 약간 위로 이동
      groupRef.current.position.y = 1

      // 바닥 메시 찾기
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes('a')) {
          // A 바닥 메시의 위치 계산
          const floorBox = new THREE.Box3().setFromObject(child)
          const floorCenter = floorBox.getCenter(new THREE.Vector3())
          setFloorPosition(floorCenter)
        }
      })

      // 깜박이는 애니메이션
      const blinkInterval = setInterval(() => {
        setBlinkIntensity(prev => prev === 0.5 ? 2 : 0.5)
      }, 500)

      return () => clearInterval(blinkInterval)
    }
  }, [gltf])

  return (
    <group ref={groupRef}>
      <primitive 
        object={gltf.scene} 
        scale={[0.05, 0.05, 0.05]}
      />
      
      {/* A 바닥 메시에 깜박이는 빨간 불빛 */}
      {floorPosition && (
        <>
          {/* 깜박이는 바닥 불빛 */}
          <mesh position={[floorPosition.x, floorPosition.y + 0.01, floorPosition.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3, 3]} />
            <meshStandardMaterial 
              color="#ff0000" 
              transparent 
              opacity={0.8}
              emissive="#ff0000"
              emissiveIntensity={blinkIntensity}
            />
          </mesh>
          
          {/* 깜박이는 조명 */}
          <pointLight 
            position={[floorPosition.x, floorPosition.y + 1, floorPosition.z]}
            color="#ff0000"
            intensity={blinkIntensity * 2}
            distance={4}
          />
        </>
      )}
      
      {/* 기본적인 광원 추가 */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ambientLight intensity={0.5} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

export default function ThreeElement() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model />
    </Suspense>
  )
} 