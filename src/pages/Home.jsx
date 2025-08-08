import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ModelViewer from '../components/3d/ModelViewer';
import Button from '../components/common/Button';
import { connectMainSSE, connectZoneSSE } from '../services/sse';

const Home = () => {
  const navigate = useNavigate();
  const [zoneStatuses, setZoneStatuses] = useState({
    zone_A: 'CONNECTING', // A01 - 실시간
    zone_A02: 'YELLOW',   // 더미 데이터
    zone_B: 'CONNECTING', // B01 - 실시간
    zone_B02: 'RED',      // 더미 데이터
    zone_B03: 'GREEN',    // 더미 데이터
    zone_B04: 'YELLOW',   // 더미 데이터
    zone_C01: 'GREEN',    // 더미 데이터
    zone_C02: 'GREEN'     // 더미 데이터
  });
  const [connectionStates, setConnectionStates] = useState({
    mainSSE: 'disconnected',
    zoneSSE: {}
  });
  const [lastUpdated, setLastUpdated] = useState({});

  // 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.log('인증 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (!userData.name) {
        console.log('사용자 정보가 불완전합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      navigate('/login');
      return;
    }
  }, [navigate]);

  // A01, B01 실시간 SSE 연결
  useEffect(() => {
    console.log('A01, B01 실시간 SSE 연결 시작');
    let disconnectMainSSE = null;
    let disconnectZoneSSE = {};

    // 메인 SSE 연결
    try {
      console.log('메인 SSE 연결 시작...');
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: 'connecting'
      }));

      disconnectMainSSE = connectMainSSE({
        onOpen: (event) => {
          console.log('메인 SSE 연결 성공!');
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: 'connected'
          }));
        },
        onMessage: (data) => {
          console.log('메인 SSE 데이터 수신:', data);
          
          try {
            if (data && data.code === 'OK' && data.data && Array.isArray(data.data)) {
              const updateTime = new Date().toLocaleTimeString();
              
              data.data.forEach(zone => {
                if (zone.zoneName && zone.status) {
                  // A01, B01만 실시간 데이터 사용
                  if (zone.zoneName === 'zone_A' || zone.zoneName === 'zone_B') {
                    setZoneStatuses(prevStatuses => ({
                      ...prevStatuses,
                      [zone.zoneName]: zone.status
                    }));
                    
                    setLastUpdated(prev => ({
                      ...prev,
                      [zone.zoneName]: updateTime
                    }));
                    
                    console.log(`실시간 데이터 업데이트: ${zone.zoneName} = ${zone.status}`);
                  }
                }
              });
            }
          } catch (error) {
            console.error('메인 SSE 데이터 처리 오류:', error);
          }
        },
        onError: (error) => {
          console.error('메인 SSE 연결 오류:', error);
          setConnectionStates(prev => ({
            ...prev,
            mainSSE: 'error'
          }));
        }
      });
    } catch (error) {
      console.error('메인 SSE 연결 초기화 오류:', error);
      setConnectionStates(prev => ({
        ...prev,
        mainSSE: 'error'
      }));
    }

    // A01, B01 개별 SSE 연결
    const connectIndividualZoneSSE = (zoneId) => {
      try {
        console.log(`존 ${zoneId} SSE 연결 시작...`);
        
        setConnectionStates(prev => ({
          ...prev,
          zoneSSE: {
            ...prev.zoneSSE,
            [zoneId]: 'connecting'
          }
        }));
        
        const disconnect = connectZoneSSE(zoneId, {
          onOpen: (event) => {
            console.log(`존 ${zoneId} SSE 연결 성공!`);
            setConnectionStates(prev => ({
              ...prev,
              zoneSSE: {
                ...prev.zoneSSE,
                [zoneId]: 'connected'
              }
            }));
          },
          onMessage: (data) => {
            console.log(`존 ${zoneId} SSE 데이터 수신:`, data);
            
            try {
              if (data && data.code === 'OK' && data.data) {
                const zoneData = data.data;
                const updateTime = new Date().toLocaleTimeString();
                
                if (zoneData.zoneName && zoneData.status) {
                  setZoneStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [zoneData.zoneName]: zoneData.status
                  }));
                  
                  setLastUpdated(prev => ({
                    ...prev,
                    [zoneData.zoneName]: updateTime
                  }));
                  
                  console.log(`존 ${zoneId} 상태 업데이트: ${zoneData.status}`);
                }
              }
            } catch (error) {
              console.error(`존 ${zoneId} SSE 데이터 처리 오류:`, error);
            }
          },
          onError: (error) => {
            console.error(`존 ${zoneId} SSE 연결 오류:`, error);
            setConnectionStates(prev => ({
              ...prev,
              zoneSSE: {
                ...prev.zoneSSE,
                [zoneId]: 'error'
              }
            }));
          }
        });
        
        disconnectZoneSSE[zoneId] = disconnect;
      } catch (error) {
        console.error(`존 ${zoneId} SSE 연결 초기화 오류:`, error);
        setConnectionStates(prev => ({
          ...prev,
          zoneSSE: {
            ...prev.zoneSSE,
            [zoneId]: 'error'
          }
        }));
      }
    };

    // A01, B01만 연결
    connectIndividualZoneSSE('a01');
    connectIndividualZoneSSE('b01');

    // 클린업
    return () => {
      console.log('SSE 연결 정리');
      
      if (disconnectMainSSE) {
        try {
          disconnectMainSSE();
        } catch (error) {
          console.log('메인 SSE 연결 해제 중 오류:', error);
        }
      }
      
      Object.entries(disconnectZoneSSE).forEach(([zoneId, disconnect]) => {
        try {
          disconnect();
        } catch (error) {
          console.log(`존 ${zoneId} SSE 연결 해제 중 오류:`, error);
        }
      });
    };
  }, []);

  const zones = [
    { 
      id: 'a01', 
      name: 'Zone A01',
      zone_name: 'zone_A'
    },
    { 
      id: 'a02', 
      name: 'Zone A02',
      zone_name: 'zone_A02'
    },
    { 
      id: 'b01', 
      name: 'Zone B01',
      zone_name: 'zone_B'
    },
    { 
      id: 'b02', 
      name: 'Zone B02',
      zone_name: 'zone_B02'
    },
    { 
      id: 'b03', 
      name: 'Zone B03',
      zone_name: 'zone_B03'
    },
    { 
      id: 'b04', 
      name: 'Zone B04',
      zone_name: 'zone_B04'
    },
    { 
      id: 'c01', 
      name: 'Zone C01',
      zone_name: 'zone_C01'
    },
    { 
      id: 'c02', 
      name: 'Zone C02',
      zone_name: 'zone_C02'
    },
  ];

  // 상태에 따른 색상 반환
  const getStatusColor = (status, connectionState) => {
    // 연결 상태에 따른 색상 조정
    if (connectionState === 'connecting') {
      return '#3b82f6'; // 파란색 (연결 중)
    }
    if (connectionState === 'error') {
      return '#9ca3af'; // 회색 (연결 실패)
    }
    
    switch (status) {
      case 'GREEN':
        return '#10b981'; // 초록색 (안전)
      case 'YELLOW':
        return '#fbbf24'; // 노란색 (경고)
      case 'RED':
        return '#ef4444'; // 빨간색 (위험)
      case 'CONNECTING':
        return '#3b82f6'; // 파란색 (연결 중)
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
      const zoneSSEState = connectionStates.zoneSSE[zone.id] || 'disconnected';
      const mainSSEState = connectionStates.mainSSE;
      
      return {
        status: status || 'CONNECTING',
        isRealtime: true,
        connectionState: zoneSSEState === 'connected' || mainSSEState === 'connected' ? 'connected' : zoneSSEState,
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
    <div>
      {/* 연결 상태 표시 섹션 */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-medium text-gray-800">실시간 모니터링</h3>
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 
                    connectionStates.mainSSE === 'connected' ? '#10b981' :
                    connectionStates.mainSSE === 'connecting' ? '#3b82f6' :
                    connectionStates.mainSSE === 'error' ? '#ef4444' : '#9ca3af'
                }}
              ></div>
              <span className="text-sm text-gray-600">
                {connectionStates.mainSSE === 'connected' && '연결됨'}
                {connectionStates.mainSSE === 'connecting' && '연결중'}
                {connectionStates.mainSSE === 'error' && '연결 오류'}
                {connectionStates.mainSSE === 'disconnected' && '미연결'}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            실시간: A01, B01 | 더미: 나머지 6개 존
          </div>
        </div>
      </div>

      {/* 전체도면 섹션 */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        width: 'full',
        height: '600px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f0f8ff',
        border: '2px solid #4a90e2',
        borderRadius: '8px',
        padding: '16px',
        position: 'relative',
        marginBottom: '32px'
      }}>
        {/* 3D 모델 영역 */}
        <div className="w-full h-[500px]">
          <Canvas
            camera={{ position: [5, 7, 5], fov: 45 }}
            style={{ background: 'transparent' }}
            shadows
          >
            <ModelViewer />
          </Canvas>
        </div>

        {/* 신호등 표시 */}
        <div className="flex w-[666.36px] h-[31.88px] items-center justify-center gap-[15.59px] relative">
          <div className="flex w-[142.23px] items-center justify-center gap-[15.59px] relative mt-[-0.06px] mb-[-0.06px]">
            <div className="bg-[#10b981] relative w-[17.54px] h-[17.54px] rounded-[8.77px]" />
            <div className="relative w-fit mt-[-1.95px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[23.4px] tracking-[0] leading-[normal]">
              안전
            </div>
          </div>

          <div className="flex w-[142.23px] items-center justify-center gap-[15.59px] relative mt-[-0.06px] mb-[-0.06px]">
            <div className="bg-[#fff27a] relative w-[17.54px] h-[17.54px] rounded-[8.77px]" />
            <div className="relative w-fit mt-[-1.95px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[23.4px] tracking-[0] leading-[normal]">
              경고
            </div>
          </div>

          <div className="inline-flex flex-[0_0_auto] items-center justify-center gap-[15.59px] relative mt-[-0.06px] mb-[-0.06px]">
            <div className="bg-[#fb5d5d] relative w-[17.54px] h-[17.54px] rounded-[8.77px]" />
            <div className="relative w-fit mt-[-1.95px] [font-family:'Manrope-Medium',Helvetica] font-medium text-black text-[23.4px] tracking-[0] leading-[normal]">
              위험
            </div>
          </div>
        </div>
      </div>

      {/* Zone 버튼들 */}
      <div className="flex flex-wrap gap-[30px] justify-center">
        {zones.map((zone) => {
          const connectionInfo = getZoneConnectionInfo(zone);
          const statusColor = getStatusColor(connectionInfo.status, connectionInfo.connectionState);
          
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
                    animation: connectionInfo.connectionState === 'connecting' ? 'pulse 2s infinite' : 'none'
                  }}
                  title={`상태: ${connectionInfo.status} | 연결: ${connectionInfo.connectionState} | 데이터: ${connectionInfo.dataSource}`}
                ></div>
                
                {/* 실시간 표시 */}
                {connectionInfo.isRealtime && (
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: 
                        connectionInfo.connectionState === 'connected' ? '#10b981' :
                        connectionInfo.connectionState === 'connecting' ? '#3b82f6' :
                        '#ef4444'
                    }}
                    title={`연결 상태: ${connectionInfo.connectionState}`}
                  ></div>
                )}
              </div>
              
              {/* 상태 텍스트와 업데이트 시간 */}
              <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
                <div className="font-medium">
                  {connectionInfo.status === 'GREEN' && '안전'}
                  {connectionInfo.status === 'YELLOW' && '경고'}
                  {connectionInfo.status === 'RED' && '위험'}
                  {connectionInfo.status === 'CONNECTING' && '연결중'}
                  {connectionInfo.status === 'UNKNOWN' && '알수없음'}
                </div>
                
                {/* 마지막 업데이트 시간 */}
                {connectionInfo.lastUpdate && (
                  <div className="text-xs text-gray-500">
                    {connectionInfo.lastUpdate}
                  </div>
                )}
                
                {/* 데이터 소스 표시 */}
                <div className={`text-xs px-2 py-1 rounded ${connectionInfo.isRealtime ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {connectionInfo.dataSource}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home; 