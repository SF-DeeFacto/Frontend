import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SimpleModel from '../3d/main/SimpleModel';
import SensorIndicator from '../3d/zone/SensorIndicator';
import { getStatusHexColor, getStatusText } from '../../config/sensorConfig';
import { getMeshoptModelPath } from '../../utils';
import { useZoneSensorData } from '../../hooks/useZoneSensorData';

const ZoneHoverOverlay = ({ hoveredZone, zoneStatuses, lastUpdated }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // 센서 데이터 가져오기
  const { sensorData, isLoading: isSensorLoading } = useZoneSensorData(hoveredZone);
  
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
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '20px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          border: `1px solid ${statusColor}30`,
          width: '340px',
          height: '400px',
          backdropFilter: 'blur(12px)',
          transform: 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400/80 to-purple-500/80 rounded-lg flex items-center justify-center">
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${statusColor}15` }}>
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 4px ${statusColor}40`
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
        <div className="relative w-full h-72 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/5 group">
          {/* 배경 그라디언트 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/3 to-pink-400/5"></div>
          
          {/* 로딩 인디케이터 - Canvas 외부 */}
          {(!isModelLoaded || isSensorLoading) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                {isSensorLoading && (
                  <div className="text-white/70 text-xs">센서 데이터 로딩 중...</div>
                )}
              </div>
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
                    sensorData={sensorData}
                    zoneId={hoveredZone}
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
