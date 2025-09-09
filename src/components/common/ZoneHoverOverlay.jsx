import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SimpleModel from '../3d/main/SimpleModel';
import { getStatusHexColor, getStatusText } from '../../config/sensorConfig';
import { getMeshoptModelPath } from '../../utils';

const ZoneHoverOverlay = ({ hoveredZone, zoneStatuses, lastUpdated }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // 호버된 존이 변경될 때 로딩 상태 리셋
  useEffect(() => {
    setIsModelLoaded(false);
  }, [hoveredZone]);
  
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
    <div className={`absolute top-20 ${overlayPosition} z-50 animate-in slide-in-from-left-4 fade-in duration-300`}>
      <div
        className="modern-card relative overflow-hidden group"
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          padding: '20px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          border: `2px solid ${statusColor}40`,
          width: '340px',
          height: '400px',
          backdropFilter: 'blur(15px)',
          transform: 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {hoveredZone.toUpperCase().charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Zone {hoveredZone.toUpperCase()}
              </h3>
              <p className="text-xs text-gray-300">3D 모델 미리보기</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${statusColor}20` }}>
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${statusColor}60`
              }} 
            />
            <span 
              className="text-xs font-semibold"
              style={{ color: statusColor }}
            >
              {statusText}
            </span>
          </div>
        </div>
        
        {/* 3D 모델 미리보기 */}
        <div className="relative w-full h-72 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden border border-white/10 group">
          {/* 배경 그라디언트 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
          
          {/* 로딩 인디케이터 - Canvas 외부 */}
          {!isModelLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          
          {(() => {
            const zoneId = hoveredZone.toUpperCase();
            const modelPath = getMeshoptModelPath(zoneId);
            
            return (
              <Canvas
                camera={{ position: [10, 10, 10], fov: 75 }}
                style={{ width: '100%', height: '100%' }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                <Suspense fallback={null}>
                  <SimpleModel 
                    modelPath={modelPath} 
                    onLoad={() => setIsModelLoaded(true)}
                  />
                </Suspense>
                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  autoRotate={true}
                  autoRotateSpeed={0.8}
                  enableDamping={true}
                  dampingFactor={0.05}
                />
              </Canvas>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ZoneHoverOverlay;
