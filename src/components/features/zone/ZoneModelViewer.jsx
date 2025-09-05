import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import ZoneModel from './ZoneModel';
import { SectionLoading } from '../../ui';

// 에러 바운더리 컴포넌트
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ZoneModel 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="flex flex-col items-center justify-center p-8 bg-red-50/90 dark:bg-red-900/20 rounded-lg shadow-lg backdrop-blur-sm border border-red-200 dark:border-red-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center mb-4">
              {this.props.zoneId?.toUpperCase()} 구역 모델을 불러올 수 없습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}

// 범용 존 뷰어 컴포넌트
function GenericZoneViewer({ zoneId, sensorData, selectedObject, onObjectClick }) {
  const modelPath = `/models/${zoneId.toUpperCase()}.glb`;
  const [isModelChecking, setIsModelChecking] = React.useState(true);
  const [modelExists, setModelExists] = React.useState(true);
  
  // 모델 파일 존재 여부 확인
  React.useEffect(() => {
    const checkModelExists = async () => {
      try {
        // 최소 1초는 로딩 스피너를 보여주기 위해 지연
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(modelPath, { method: 'GET' });
        
        if (!response.ok) {
          setModelExists(false);
          return;
        }
        
        // Content-Type 확인 (GLB 파일인지 체크)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('model/gltf-binary') && !contentType.includes('application/octet-stream')) {
          console.warn('모델 파일이 올바른 GLB 형식이 아닙니다:', contentType);
          setModelExists(false);
          return;
        }
        
        // 응답 내용이 HTML인지 확인 (에러 페이지 등)
        const text = await response.text();
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          console.warn('모델 파일 대신 HTML 페이지가 반환되었습니다');
          setModelExists(false);
          return;
        }
        
        setModelExists(true);
      } catch (error) {
        console.error('모델 파일 확인 실패:', error);
        // 네트워크 에러인 경우 서버 연결 문제로 간주
        setModelExists(false);
      } finally {
        setIsModelChecking(false);
      }
    };
    
    checkModelExists();
  }, [modelPath]);
  
  // 모델 확인 중일 때 로딩 표시
  if (isModelChecking) {
    return (
      <SectionLoading 
        loading={true}
        loadingText={`${zoneId.toUpperCase()} 구역을 확인하는 중...`}
        showHeader={false}
        size="lg"
        className="h-full min-h-[600px]"
      />
    );
  }
  
  // 모델이 존재하지 않을 때 에러 표시
  if (!modelExists) {
    return (
      <SectionLoading 
        loading={false}
        error={`${zoneId.toUpperCase()} 구역 모델을 불러올 수 없습니다.`}
        errorText="서버 연결을 확인해주세요."
        showHeader={false}
        size="lg"
        className="h-full min-h-[600px]"
      />
    );
  }
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'transparent'
    }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 75 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0); // 투명 배경
          gl.setClearAlpha(0); // 알파 채널도 투명하게
          scene.background = null; // 씬 배경도 null로 설정
        }}
      >
        <ModelErrorBoundary zoneId={zoneId}>
          <Suspense fallback={
            <Html center>
              <div className="w-80">
                <SectionLoading 
                  loading={true}
                  loadingText={`${zoneId.toUpperCase()} 구역을 불러오는 중...`}
                  showHeader={false}
                  size="lg"
                />
              </div>
            </Html>
          }>
            <ZoneModel 
              modelPath={modelPath} 
              zoneId={zoneId} 
              sensorData={sensorData}
              selectedObject={selectedObject}
              onObjectClick={onObjectClick}
            />
          </Suspense>
        </ModelErrorBoundary>
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}

const ZoneModelViewer = ({ zoneId, sensorData, selectedObject, onObjectClick }) => {
  // 모든 존을 범용 뷰어로 처리
  return (
    <div className="w-full h-full">
      <GenericZoneViewer 
        zoneId={zoneId} 
        sensorData={sensorData}
        selectedObject={selectedObject}
        onObjectClick={onObjectClick} 
      />
    </div>
  );
};

export default ZoneModelViewer; 