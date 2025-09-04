import React from 'react';
import { Canvas } from '@react-three/fiber';
import MainModelViewer from '../main/MainModelViewer';
import ModelCard from '../../common/ModelCard';
import ZoneHoverOverlay from '../../common/ZoneHoverOverlay';
import StatusIndicator from './StatusIndicator';

const ThreeDModelSection = ({ zoneStatuses, hoveredZone, onHoverZoneChange }) => {
  
  return (
    <div className="h-full flex flex-col">
      {/* 3D 모델 카드 */}
      <div className="modern-card relative overflow-hidden group flex-1 flex flex-col">
        {/* 배경 그라디언트 - 브랜드 색상 적용 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-brand-light/30 to-brand-medium/40 dark:from-neutral-800/60 dark:via-neutral-700/30 dark:to-neutral-600/40 transition-colors duration-300"></div>
        
        {/* 장식적 요소 - 브랜드 색상 적용 */}
        <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-brand-main/15 to-primary-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-tr from-brand-main/10 to-brand-medium/15 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-6 flex-1 flex flex-col">
          {/* 3D 모델 영역 */}
          <div className="flex-1 relative rounded-2xl overflow-hidden min-h-0">
            <Canvas
              camera={{ position: [5, 7, 5], fov: 45 }}
              style={{ background: 'transparent' }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0); // 투명 배경
              }}
              shadows
            >
              <MainModelViewer 
                zoneStatuses={zoneStatuses} 
                onHoverZoneChange={onHoverZoneChange}
              />
            </Canvas>
            
            {/* 호버 오버레이 */}
            <ZoneHoverOverlay 
              hoveredZone={hoveredZone} 
              zoneStatuses={zoneStatuses}
            />
            
            {/* 컨트롤 힌트 */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-sm">
              마우스로 회전 • 휠로 확대/축소
            </div>
          </div>

          {/* 상태 인디케이터 - 3D 도면 아래 */}
          <div className="mt-4 flex justify-center flex-shrink-0">
            <StatusIndicator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDModelSection;
