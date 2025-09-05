import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import SimpleModel from '../three/main/SimpleModel';
import { getStatusHexColor, getStatusText } from '../../utils/sensorUtils';
import { ZONE_POSITIONS, ZONE_MAPPING } from '../../config/zoneConfig';
import { UI_COLORS } from '../../config/colorConfig';
import LoadingSpinner from './LoadingSpinner';

// 에러 바운더리 컴포넌트
class SimpleModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SimpleModel 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="flex flex-col items-center justify-center p-4 bg-red-50/90 dark:bg-red-900/20 rounded-lg shadow-lg backdrop-blur-sm border border-red-200 dark:border-red-800">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
              모델을 불러올 수 없습니다
            </p>
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}

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

  // Zone 위치에 따른 오버레이 위치 결정
  const isLeftZone = ZONE_POSITIONS.LEFT.includes(hoveredZone.toUpperCase());
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
          border: `2px solid ${UI_COLORS.BORDER.DARK}`,
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
            const zoneId = hoveredZone.toUpperCase();
            const modelPath = ZONE_MAPPING.ID_TO_MODEL_PATH[zoneId];
            
            if (modelPath) {
              return (
                <Canvas
                  camera={{ position: [10, 10, 10], fov: 75 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <SimpleModelErrorBoundary>
                    <Suspense fallback={
                      <Html center>
                        <LoadingSpinner 
                          size="sm" 
                          text={`${hoveredZone.toUpperCase()} 구역을 불러오는 중...`}
                        />
                      </Html>
                    }>
                      <SimpleModel modelPath={modelPath} />
                    </Suspense>
                  </SimpleModelErrorBoundary>
                  <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate={true}
                    autoRotateSpeed={1}
                  />
                </Canvas>
              );
            } else {
              return <div style={{ color: UI_COLORS.TEXT.MUTED, fontSize: '12px' }}>미리보기 없음</div>;
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
