import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SimpleModel from '../3d/main/SimpleModel';
import { getStatusHexColor, getStatusText } from '../../config/sensorConfig';

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
        <div style={{ 
          borderBottom: '1px solid rgba(255,255,255,0.2)', 
          paddingBottom: '8px', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '16px' }}>
            Zone {hoveredZone.toUpperCase()}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusColor,
              boxShadow: `0 0 4px ${statusColor}`
            }} />
            <span style={{
              color: statusColor,
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              {statusText}
            </span>
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
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ZoneHoverOverlay;
