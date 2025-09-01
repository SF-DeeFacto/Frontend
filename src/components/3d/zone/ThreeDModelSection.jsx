import React from 'react';
import { Canvas } from '@react-three/fiber';
import MainModelViewer from '../main/MainModelViewer';
import ModelCard from '../../common/ModelCard';
import ZoneHoverOverlay from '../../common/ZoneHoverOverlay';
import StatusIndicator from './StatusIndicator';

const ThreeDModelSection = ({ zoneStatuses, hoveredZone, onHoverZoneChange, lastUpdated }) => {
  return (
    <ModelCard
      zoneId="main"
      className="flex flex-col w-full h-[800px] justify-center items-center gap-2 rounded-lg p-4 relative mb-[30px]"
    >
      {/* 3D 모델 영역 */}
      <div className="w-full h-[700px] relative">
        <Canvas
          camera={{ position: [5, 7, 5], fov: 45 }}
          className="bg-transparent"
          shadows
        >
          <MainModelViewer 
            zoneStatuses={zoneStatuses} 
            onHoverZoneChange={onHoverZoneChange}
          />
        </Canvas>
        <ZoneHoverOverlay 
          hoveredZone={hoveredZone} 
          zoneStatuses={zoneStatuses}
          lastUpdated={lastUpdated}
        />
      </div>

      {/* 안전 상태 신호등 표시 (하단) */}
      <div className="flex justify-center items-center mt-2">
        <StatusIndicator />
      </div>
    </ModelCard>
  );
};

export default ThreeDModelSection;
