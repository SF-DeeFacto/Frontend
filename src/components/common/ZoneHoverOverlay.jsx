import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SimpleModel from '../3d/main/SimpleModel';
import { getStatusHexColor } from '../../config/sensorConfig';

const ZoneHoverOverlay = ({ hoveredZone, zoneStatuses }) => {
  if (!hoveredZone) return null;

  // Zone 상태별 색상 매핑 (공용 유틸리티 사용)

  // 메시 이름을 Zone 상태 키로 변환
  const getZoneStatusKey = (meshName) => {
    const zoneMapping = {
      // 소문자 메쉬
      'a01': 'zone_A',
      'a02': 'zone_A02',
      'b01': 'zone_B', 
      'b02': 'zone_B02',
      'b03': 'zone_B03',
      'b04': 'zone_B04',
      'c01': 'zone_C01',
      'c02': 'zone_C02',
      // 대문자 메쉬
      'A01': 'zone_A',
      'A02': 'zone_A02',
      'B01': 'zone_B', 
      'B02': 'zone_B02',
      'B03': 'zone_B03',
      'B04': 'zone_B04',
      'C01': 'zone_C01',
      'C02': 'zone_C02'
    };
    return zoneMapping[meshName];
  };

  // 호버된 존의 상태 색상을 가져오는 함수
  const getZoneStatusColor = (hoveredZone) => {
    const zoneKey = getZoneStatusKey(hoveredZone);
    const status = zoneStatuses?.[zoneKey];
    return getStatusHexColor(status || 'CONNECTING');
  };

  // 호버된 존의 상태 텍스트를 가져오는 함수
  const getZoneStatusText = (hoveredZone) => {
    const zoneKey = getZoneStatusKey(hoveredZone);
    const status = zoneStatuses?.[zoneKey];
    switch(status) {
      case 'GREEN': return '안전';
      case 'YELLOW': return '경고';
      case 'RED': return '위험';
      default: return '연결중';
    }
  };

  // A01, A02, B01, B02는 왼쪽에, 나머지는 오른쪽에 표시
  const leftZones = ['a01', 'a02', 'b01', 'b02', 'A01', 'A02', 'B01', 'B02'];
  const isLeftZone = leftZones.includes(hoveredZone);
  const overlayPosition = isLeftZone ? 'left-4' : 'right-4';

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
          <div>
            <div style={{ fontSize: '16px', marginBottom: '4px' }}>
              Zone {hoveredZone.toUpperCase()}
            </div>
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
          marginBottom: '12px',
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

        {/* 상태 정보 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <span>상태:</span>
          <span style={{
            color: getZoneStatusColor(hoveredZone),
            fontWeight: 'bold'
          }}>
            {getZoneStatusText(hoveredZone)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ZoneHoverOverlay;
