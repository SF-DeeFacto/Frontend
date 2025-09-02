import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ZoneModel from './ZoneModel';

// 범용 존 뷰어 컴포넌트
function GenericZoneViewer({ zoneId, onObjectClick }) {
  const modelPath = `/models/${zoneId.toUpperCase()}.glb`;
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>


      <Canvas
        camera={{ position: [10, 10, 10], fov: 75 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // 투명 배경
        }}
      >
        <Suspense fallback={null}>
          <ZoneModel 
            modelPath={modelPath} 
            zoneId={zoneId} 
            onObjectClick={onObjectClick}
          />
        </Suspense>
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

const ZoneModelViewer = ({ zoneId, onObjectClick }) => {
  // 모든 존을 범용 뷰어로 처리
  return (
    <div className="w-full h-full">
      <GenericZoneViewer zoneId={zoneId} onObjectClick={onObjectClick} />
    </div>
  );
};

export default ZoneModelViewer; 