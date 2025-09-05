import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useMainZoneMapping, useMainModelMaterials } from '../hooks';
import { SectionLoading } from '../../ui';

function Model({ zoneStatuses, onHoverZoneChange }) {
  const gltf = useLoader(GLTFLoader, '/models/mainhome.glb');
  const navigate = useNavigate();
  const [object38Position, setObject38Position] = useState(null);

  const [modelInfo, setModelInfo] = useState({
    position: [0, -18, 0],
    rotation: [0, 58 * Math.PI / 180, 0],
    scale: [0.01, 0.01, 0.01]
  });

  // Zone 매핑 훅 사용
  const { setupZoneMapping } = useMainZoneMapping();
  
  // 재질 관리 훅 사용
  const { updateZoneMaterials } = useMainModelMaterials();

  // 모델 로딩 후 초기 설정
  useEffect(() => {
    if (gltf.scene) {
      // Zone 매핑 설정
      setupZoneMapping(gltf.scene, navigate);
      
      // B01 오브젝트 위치 저장
      gltf.scene.traverse((child) => {
        if (child.isMesh && (child.name === 'b01' || child.name === 'B01')) {
          setObject38Position(child.position.clone());
        }
      });
    }
  }, [gltf, setupZoneMapping, navigate]);

  // Zone 상태 변경 시 재질 업데이트
  useEffect(() => {
    if (gltf.scene && zoneStatuses) {
      updateZoneMaterials(gltf.scene, zoneStatuses);
    }
  }, [zoneStatuses, gltf, updateZoneMaterials]);

  // 클릭 이벤트 핸들러
  const handleClick = (event) => {
    // 클릭 가능한 메시인지 확인
    if (event.object.userData && event.object.userData.isClickable) {
      const zoneName = event.object.userData.zoneName;
      const targetPath = event.object.userData.targetPath;
      
      if (zoneName) {
        // 바로 페이지 이동
        if (targetPath) {
          navigate(targetPath);
        }
      }
    }
  };

  // 호버 이벤트 핸들러
  const handlePointerOver = (event) => {
    if (event.object.userData && event.object.userData.isClickable) {
      const zoneId = event.object.name; // 메쉬 이름 (a01/A01, b01/B01)
      const zoneName = event.object.userData.zoneName;
      
      document.body.style.cursor = 'pointer';
      
      // 호버된 존 정보를 부모 컴포넌트로 전달
      onHoverZoneChange(zoneId);
    }
  };

  const handlePointerOut = (event) => {
    if (event.object.userData && event.object.userData.isClickable) {
      onHoverZoneChange(null);
      document.body.style.cursor = 'default';
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
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      
      {/* 기본 조명 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="w-80">
        <SectionLoading 
          loading={true}
          loadingText="메인 홈 모델을 불러오는 중..."
          showHeader={false}
          size="lg"
        />
      </div>
    </Html>
  );
}

// 메인 모델 에러 바운더리
class MainModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MainModel 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="w-80">
            <SectionLoading 
              loading={false}
              error="메인 홈 모델을 불러올 수 없습니다."
              errorText="서버 연결을 확인해주세요."
              showHeader={false}
              size="lg"
            />
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}

export default function MainModelViewer({ zoneStatuses, onHoverZoneChange }) {
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
    <MainModelErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Model zoneStatuses={zoneStatuses} onHoverZoneChange={onHoverZoneChange} />
        <OrbitControls 
          ref={controlsRef}
          target={[2.096, -3.749, 3.199]}
          position={[3.989, 7.212, 5.067]}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Suspense>
    </MainModelErrorBoundary>
  );
} 