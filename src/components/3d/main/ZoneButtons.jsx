import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getStatusHexColor, getStatusText, CONNECTION_STATE, SENSOR_STATUS } from '../../../config/sensorConfig';
import { COLORS } from '../../../config/constants';

const ZoneButtons = ({ zones, zoneStatuses, connectionStates, lastUpdated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canAccessZone = (zoneId) => {
    // scope 정보가 없으면 전체 접근 허용
    if (!user?.scope) return true;
    
    const scopes = Array.isArray(user.scope) 
      ? user.scope.map(s => s.trim().toLowerCase())
      : user.scope.split(',').map((s) => s.trim().toLowerCase());
    
    const zoneScope = (zoneId || '')[0]?.toLowerCase(); // 'a01' -> 'a'
    return scopes.includes(zoneScope);
  };

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

  // 존별 연결 정보 확인
  const getZoneConnectionInfo = (zone) => {
    // Zone 이름을 API 응답 형식에 맞게 변환
    const zoneName = zone.name.replace('Zone ', ''); // "Zone A01" → "A01"
    const status = zoneStatuses[zoneName];
    const lastUpdate = lastUpdated[zoneName];
    
    return {
      status: status || SENSOR_STATUS.CONNECTING,
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
        const connectionInfo = getZoneConnectionInfo(zone);
        const statusColor = getStatusHexColor(connectionInfo.status);
        const connectionColor = getConnectionColor(connectionInfo.connectionState);
        
        return (
          <div
            key={zone.id}
            onClick={() => {
              if (!canAccessZone(zone.id)) {
                window.alert('해당 구역에 대한 접근 권한이 없습니다.');
                return;
              }
              navigate(`/home/zone/${zone.id}`);
            }}
            className="modern-card modern-card-hover group cursor-pointer p-4 min-w-[140px] relative overflow-hidden"
          >
            {/* 배경 그라디언트 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-primary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* 컨텐츠 */}
            <div className="relative z-10 flex items-center justify-center gap-4">
              {/* Zone 이름 */}
              <div className="flex-shrink-0">
                <h3 className="text-lg font-bold text-secondary-800 group-hover:text-primary-600 transition-colors duration-200">
                  {zone.name}
                </h3>
              </div>
              
              {/*TODO: 상태 인디케이터 */}
              <div 
                className="w-4 h-4 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: statusColor,
                  boxShadow: `0 0 6px ${statusColor}40`
                }}
                title={`상태: ${getStatusText(connectionInfo.status)} | 연결: ${connectionInfo.connectionState} | 데이터: ${connectionInfo.dataSource}`}
              ></div>
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
