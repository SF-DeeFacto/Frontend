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
  const hasLogged = useRef(false);

  // 모델 정보를 한 번만 출력
  useEffect(() => {
    if (!hasLogged.current) {
      console.log('=== 3D 모델 정보 ===');
      console.log('Position:', JSON.stringify(modelInfo.position));
      console.log('Rotation (radians):', JSON.stringify(modelInfo.rotation));
      console.log('Rotation (degrees):', JSON.stringify([0, 45, 0]));
      console.log('Scale:', JSON.stringify(modelInfo.scale));
      hasLogged.current = true;
    }
  }, [modelInfo]);

  useEffect(() => {
    // 모델 로딩 후 객체별 클릭 가능 여부와 이동 경로 설정
    console.log('🎯 객체 클릭 이벤트 설정 중...');
    
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log(`메시 발견: "${child.name}"`);
        
        // object_10은 A01로 이동
        if (child.name === 'object_10') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/a01'
          };
          console.log(`✅ ${child.name} -> A01 설정`);
        }
        // object_22는 A02로 이동
        else if (child.name === 'object_22') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/a02'
          };
          console.log(`✅ ${child.name} -> A02 설정`);
        }
        // object_24는 B01로 이동
        else if (child.name === 'object_24') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b01'
          };
          console.log(`✅ ${child.name} -> B01 설정`);
          setObject38Position(child.position.clone());
        }
        // object_1은 B02로 이동
        else if (child.name === 'object_1') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b02'
          };
          console.log(`✅ ${child.name} -> B02 설정`);
        }
        // object_12는 B03으로 이동
        else if (child.name === 'object_12') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b03'
          };
          console.log(`✅ ${child.name} -> B03 설정`);
        }
        // object_9는 B04로 이동
        else if (child.name === 'object_9') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/b04'
          };
          console.log(`✅ ${child.name} -> B04 설정`);
        }
        // object_16은 C01로 이동
        else if (child.name === 'object_16') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/c01'
          };
          console.log(`✅ ${child.name} -> C01 설정`);
        }
        // object_15는 C02로 이동
        else if (child.name === 'object_15') {
          child.userData = {
            isClickable: true,
            blockName: child.name,
            targetPath: '/home/zone/c02'
          };
          console.log(`✅ ${child.name} -> C02 설정`);
        }

        else {
          // 다른 메시들은 클릭 불가능하게 설정
          child.userData = {
            isClickable: false
          };
        }
      }
    });
    
    console.log('🎯 객체 클릭 이벤트 설정 완료!');
  }, [gltf]);

  // 클릭 이벤트 핸들러
  const handleClick = (event) => {
    console.log('=== 🖱️ 클릭 이벤트 발생 ===');
    console.log('클릭된 객체 이름:', event.object.name);
    console.log('클릭된 객체 userData:', event.object.userData);
    
    // 클릭 가능한 메시인지 확인
    if (event.object.userData && event.object.userData.isClickable) {
      const targetPath = event.object.userData.targetPath;
      if (targetPath) {
        console.log('✅ 클릭 성공! 이동 중...');
        console.log('클릭된 오브젝트:', event.object.name);
        console.log('클릭된 오브젝트 위치:', event.object.position);
        console.log('이동할 경로:', targetPath);
        navigate(targetPath);
      } else {
        console.log('❌ targetPath가 없습니다');
      }
    } else {
      console.log('❌ 클릭 불가능한 객체입니다');
      console.log('객체 이름:', event.object.name);
      console.log('💡 이 객체를 클릭 가능하게 만들려면 이름을 확인하세요: "' + event.object.name + '"');
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
      
      {/* object_38에 Zone B01 텍스트 라벨 추가 - 바닥에 눕혀서 표시 */}
      <Text
        position={[4.1, 0.01, 0.1]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="black"
        rotation={[-Math.PI / 2, Math.PI / 4, 0]}
      >
        Zone B01
      </Text>
      
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

  // 카메라 위치와 모델 정보를 실시간으로 출력하는 함수
  const handleControlsChange = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      
      console.log('=== 카메라 및 컨트롤 정보 ===');
      console.log('카메라 위치:', {
        x: camera.position.x.toFixed(3),
        y: camera.position.y.toFixed(3),
        z: camera.position.z.toFixed(3)
      });
      console.log('카메라 회전:', {
        x: (camera.rotation.x * 180 / Math.PI).toFixed(2) + '°',
        y: (camera.rotation.y * 180 / Math.PI).toFixed(2) + '°',
        z: (camera.rotation.z * 180 / Math.PI).toFixed(2) + '°'
      });
      console.log('카메라 타겟:', {
        x: target.x.toFixed(3),
        y: target.y.toFixed(3),
        z: target.z.toFixed(3)
      });
      console.log('줌 레벨:', camera.position.distanceTo(target).toFixed(3));
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model />
      <OrbitControls 
        ref={controlsRef}
        target={[2.096, -3.749, 3.199]}
        position={[3.989, 7.212, 5.067]}
        onChange={handleControlsChange}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Suspense>
  );
} 