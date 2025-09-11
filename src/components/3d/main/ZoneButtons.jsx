import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getStatusHexColor, getStatusText, CONNECTION_STATE, SENSOR_STATUS } from '../../../config/sensorConfig';
import { COLORS } from '../../../config/constants';
import Text from '../../common/Text';

const ZoneButtons = ({ zones, zoneStatuses, connectionStates, lastUpdated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [zonePermissions, setZonePermissions] = useState({});

  // 권한 체크 함수 (ZoneHoverOverlay와 동일한 패턴)
  const checkPermission = (zoneId) => {
    if (!zoneId) return false;
    if (!user?.scope) return true; // scope 미설정이면 모든 구역 접근 허용
    
    // scope가 문자열인지 확인
    if (typeof user.scope !== 'string') {
      console.warn('user.scope is not a string:', user.scope);
      return true; // 안전하게 접근 허용
    }
    
    const scopes = Array.isArray(user.scope) 
      ? user.scope.map(s => s.trim().toLowerCase())
      : user.scope.split(',').map((s) => s.trim().toLowerCase());
    
    const zoneScope = String(zoneId)[0]?.toLowerCase();
    return scopes.includes(zoneScope);
  };

  // 존별 권한 체크
  useEffect(() => {
    const permissions = {};
    zones.forEach(zone => {
      permissions[zone.id] = checkPermission(zone.id);
    });
    setZonePermissions(permissions);
  }, [zones, user?.scope]);

  // 연결 상태에 따른 색상 반환
  const getConnectionColor = (connectionState) => {
    switch (connectionState) {
      case CONNECTION_STATE.CONNECTING:
        return COLORS.INFO; // 파란색 (연결 중)
      case CONNECTION_STATE.CONNECTED:
        return COLORS.SUCCESS; // 초록색 (연결됨)
      case CONNECTION_STATE.ERROR:
        return COLORS.DANGER; // 빨간색 (연결 실패)
      default:
        return COLORS.SECONDARY; // 회색 (알 수 없음)
    }
  };

  // 상태별 애니메이션 클래스 반환 (호버와 동일한 프로파일 적용)
  const getStatusAnimationClass = (status) => {
    switch ((status || '').toString().toUpperCase()) {
      case 'RED':
      case 'ERROR':
      case 'DANGER':
        return 'animate-pulse'; // 빨간색 - 빠른 깜빡임 (breathSpeed: 1.2)
      case 'YELLOW':
      case 'WARNING':
        return 'animate-pulse'; // 노란색 - 중간 깜빡임 (breathSpeed: 0.9)
      case 'GREEN':
      case 'NORMAL':
        return ''; // 초록색 - 애니메이션 없음 (breathSpeed: 0.6, breathAmp: 0.08 - 매우 부드러움)
      case 'CONNECTING':
        return 'animate-pulse'; // 연결 중 - 깜빡임
      case 'DISCONNECTED':
      case 'UNKNOWN':
        return ''; // 연결 끊김 - 애니메이션 없음
      default:
        return ''; // 기본 - 애니메이션 없음 (호버의 base 프로파일과 동일)
    }
  };

  // 호버와 동일한 로직으로 존 상태 가져오기
  const getZoneStatus = (zone) => {
    // 대문자로 변환하여 zoneStatuses에서 찾기 (호버와 동일한 로직)
    const zoneKey = zone.toUpperCase();
    const status = zoneStatuses?.[zoneKey] || SENSOR_STATUS.CONNECTING;
    
    // 디버깅 로그
    console.log('ZoneButtons - getZoneStatus:', {
      zone,
      zoneKey,
      status,
      zoneStatuses,
      availableKeys: Object.keys(zoneStatuses || {})
    });
    
    return status;
  };

  // 존별 연결 정보 확인
  const getZoneConnectionInfo = (zone) => {
    // 호버와 동일한 방식으로 상태 가져오기
    const status = getZoneStatus(zone);
    const lastUpdate = lastUpdated[zone.toUpperCase()];
    
    return {
      status: status,
      isRealtime: connectionStates.mainSSE === CONNECTION_STATE.CONNECTED,
      connectionState: connectionStates.mainSSE || CONNECTION_STATE.DISCONNECTED,
      lastUpdate,
      dataSource: connectionStates.mainSSE === CONNECTION_STATE.CONNECTED ? '실시간' : '연결끊김'
    };
  };

  return (
    <div className="w-full">
      {/* Zone 버튼 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {zones.map((zone) => {
        // 호버와 동일한 방식으로 존 ID 사용
        const zoneId = zone.id; // 'a01', 'b01' 등
        const connectionInfo = getZoneConnectionInfo(zoneId);
        const statusColor = getStatusHexColor(connectionInfo.status);
        const connectionColor = getConnectionColor(connectionInfo.connectionState);
        
        const hasPermission = zonePermissions[zone.id];
        
        return (
          <div
            key={zone.id}
            onClick={() => {
              if (!hasPermission) {
                window.alert('해당 구역에 대한 접근 권한이 없습니다.');
                return;
              }
              navigate(`/home/zone/${zone.id}`);
            }}
            className={`modern-card group cursor-pointer p-4 min-w-[140px] relative overflow-hidden ${
              hasPermission ? 'modern-card-hover' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {/* 배경 그라디언트 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-primary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* 컨텐츠 */}
            <div className="relative z-10 flex items-center justify-center gap-4">
              {/* Zone 이름 */}
              <div className="flex-shrink-0">
                <Text variant="title" size="lg" weight="bold" color="secondary-800" className="group-hover:text-primary-600 transition-colors duration-200">
                  {zone.name}
                </Text>
              </div>
              
              {/* 상태 인디케이터 - 호버와 동일한 스타일 적용 */}
              <div className="relative">
                {/* 메인 상태 점 */}
                <div 
                  className={`w-4 h-4 rounded-full relative z-10 ${getStatusAnimationClass(connectionInfo.status)}`}
                  style={{ 
                    backgroundColor: statusColor,
                    boxShadow: `0 0 8px ${statusColor}60`
                  }}
                ></div>
                
                {/* 발광 효과 (상태등 효과) */}
                <div 
                  className={`absolute inset-0 w-4 h-4 rounded-full ${getStatusAnimationClass(connectionInfo.status)}`}
                  style={{ 
                    backgroundColor: statusColor,
                    opacity: 0.4,
                    transform: 'scale(1.3)',
                    zIndex: 1
                  }}
                ></div>
                
                {/* 광륜 효과 (상시 호흡) - 호버와 동일한 부드러운 효과 */}
                <div 
                  className="absolute inset-0 w-4 h-4 rounded-full"
                  style={{ 
                    backgroundColor: statusColor,
                    opacity: connectionInfo.status === 'GREEN' ? 0.1 : 0.2, // 초록색일 때 더 투명하게
                    transform: 'scale(1.6)',
                    zIndex: 0
                  }}
                ></div>
              </div>
            </div>
            
            {/* 호버 효과 아이콘 */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-6 h-6 bg-brand-main rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default ZoneButtons;
