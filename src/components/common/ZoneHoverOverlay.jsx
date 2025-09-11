import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SimpleModel from '../3d/main/SimpleModel';
import { getStatusHexColor, getStatusText } from '../../config/sensorConfig';
import { default as TextComponent } from './Text';

const ZoneHoverOverlay = ({ hoveredZone, zoneStatuses, lastUpdated }) => {
  if (!hoveredZone) return null;

  // 호버된 존의 상태를 가져오는 함수 (실제 SSE 데이터 사용)
  const getZoneStatus = (hoveredZone) => {
    // 대문자로 변환하여 zoneStatuses에서 찾기
    const zoneKey = hoveredZone.toUpperCase();
    return zoneStatuses?.[zoneKey] || 'CONNECTING';
  };

  // 호버된 존의 상태 색상을 가져오는 함수
  const getZoneStatusColor = (hoveredZone) => {
    const status = getZoneStatus(hoveredZone);
    return getStatusHexColor(status);
  };

  // 호버된 존의 상태 텍스트를 가져오는 함수
  const getZoneStatusText = (hoveredZone) => {
    const status = getZoneStatus(hoveredZone);
    return getStatusText(status);
  };

  // A01, A02, B01, B02는 왼쪽에, 나머지는 오른쪽에 표시
  const leftZones = ['a01', 'a02', 'b01', 'b02', 'A01', 'A02', 'B01', 'B02'];
  const isLeftZone = leftZones.includes(hoveredZone);
  const overlayPosition = isLeftZone ? 'left-4' : 'right-4';

  // 현재 존 상태
  const currentStatus = getZoneStatus(hoveredZone);
  const statusColor = getZoneStatusColor(hoveredZone);
  const statusText = getZoneStatusText(hoveredZone);

  return (
    <div className={`absolute top-20 ${overlayPosition} z-50`}>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          border: '2px solid #6b7280',
          width: '320px',
          height: '380px',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400/80 to-purple-500/80 rounded-lg flex items-center justify-center">
              <TextComponent variant="body" size="sm" weight="bold" color="white">
                {hoveredZone.toUpperCase().charAt(0)}
              </TextComponent>
            </div>
            <div>
              <TextComponent variant="title" size="lg" weight="bold" color="white">
                Zone {hoveredZone.toUpperCase()}
              </TextComponent>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${statusColor}15` }}>
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 4px ${statusColor}40`
              }} 
            />
            <TextComponent 
              variant="caption" 
              size="xs" 
              weight="semibold"
              style={{ color: statusColor }}
            >
              {statusText}
            </TextComponent>
          </div>
        </div>
        
        {/* 3D 모델 미리보기 */}
        <div style={{
          width: '100%',
          height: '280px',
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {(() => {
            const zoneId = hoveredZone.toLowerCase();
            const modelPaths = {
              'a01': '/models/A01.glb',
              'a02': '/models/A02.glb',
              'b01': '/models/B01.glb',
              'b02': '/models/B02.glb',
              'b03': '/models/B03.glb',
              'b04': '/models/B04.glb',
              'c01': '/models/C01.glb',
              'c02': '/models/C02.glb'
            };
            
            const modelPath = modelPaths[zoneId];
            
            if (modelPath) {
              return (
                <Canvas
                  camera={{ position: [10, 10, 10], fov: 75 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Suspense fallback={null}>
                    <SimpleModel modelPath={modelPath} />
                  </Suspense>
                  <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate={true}
                    autoRotateSpeed={1}
                  />
                </Canvas>
              );
            } else {
              return <div style={{ color: '#666', fontSize: '12px' }}>미리보기 없음</div>;
            }
          })()}
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ZoneHoverOverlay;
