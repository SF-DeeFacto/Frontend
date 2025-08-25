import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, getStatusText } from '../../../utils/sensorUtils';
import { CONNECTION_STATE } from '../../../types/sensor';

const ZoneButtons = ({ zones, zoneStatuses, connectionStates, lastUpdated }) => {
  const navigate = useNavigate();

  // 연결 상태에 따른 색상 반환
  const getConnectionColor = (connectionState) => {
    switch (connectionState) {
      case CONNECTION_STATE.CONNECTING:
        return '#3b82f6'; // 파란색 (연결 중)
      case CONNECTION_STATE.CONNECTED:
        return '#10b981'; // 초록색 (연결됨)
      case CONNECTION_STATE.ERROR:
        return '#ef4444'; // 빨간색 (연결 실패)
      default:
        return '#9ca3af'; // 회색 (알 수 없음)
    }
  };

  // 존별 연결 정보 확인
  const getZoneConnectionInfo = (zone) => {
    const isRealtimeZone = zone.zone_name === 'zone_A' || zone.zone_name === 'zone_B';
    const status = zoneStatuses[zone.zone_name];
    const lastUpdate = lastUpdated[zone.zone_name];
    
    if (isRealtimeZone) {
      const zoneSSEState = connectionStates.zoneSSE[zone.id] || CONNECTION_STATE.DISCONNECTED;
      const mainSSEState = connectionStates.mainSSE;
      
      return {
        status: status || 'CONNECTING',
        isRealtime: true,
        connectionState: zoneSSEState === CONNECTION_STATE.CONNECTED || mainSSEState === CONNECTION_STATE.CONNECTED ? CONNECTION_STATE.CONNECTED : zoneSSEState,
        lastUpdate,
        dataSource: '실시간'
      };
    }
    
    return {
      status: status || 'UNKNOWN',
      isRealtime: false,
      connectionState: 'static',
      lastUpdate: null,
      dataSource: '더미'
    };
  };

  return (
    <div className="flex flex-wrap gap-[30px] justify-center">
      {zones.map((zone) => {
        const connectionInfo = getZoneConnectionInfo(zone);
        const statusColor = getStatusColor(connectionInfo.status);
        const connectionColor = getConnectionColor(connectionInfo.connectionState);
        
        return (
          <div
            key={zone.id}
            onClick={() => navigate(`/home/zone/${zone.id}`)}
            className="text-black font-bold bg-white border border-gray-300 hover:bg-gray-50 flex flex-col items-center gap-2 px-4 py-3 rounded cursor-pointer transition-colors min-w-[120px]"
          >
            {/* Zone 이름과 상태 아이콘 */}
            <div className="flex items-center gap-2">
              <span className="text-sm">{zone.name}</span>
              
              {/* 상태 아이콘 */}
              <div 
                className="w-[17.54px] h-[17.54px] rounded-[8.77px] border border-gray-300 transition-colors"
                style={{ 
                  backgroundColor: statusColor,
                  animation: connectionInfo.connectionState === CONNECTION_STATE.CONNECTING ? 'pulse 2s infinite' : 'none'
                }}
                title={`상태: ${getStatusText(connectionInfo.status)} | 연결: ${connectionInfo.connectionState} | 데이터: ${connectionInfo.dataSource}`}
              ></div>
              
              {/* 실시간 표시 */}
              {connectionInfo.isRealtime && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: connectionColor }}
                  title={`연결 상태: ${connectionInfo.connectionState}`}
                ></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ZoneButtons;
