import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import ZoneModel from './ZoneModel';
import { LoadingSpinner } from '../../ui';

// 범용 존 뷰어 컴포넌트
function GenericZoneViewer({ zoneId, sensorData, selectedObject, onObjectClick }) {
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
        <Suspense fallback={
          <Html center>
            <LoadingSpinner 
              size="lg" 
              text={`${zoneId.toUpperCase()} 구역을 불러오는 중...`}
            />
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