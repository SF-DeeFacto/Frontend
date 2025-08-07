import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ModelViewer from '../components/3d/ModelViewer';
import Button from '../components/common/Button';
import { connectMainSSE } from '../services/api/dashboard_api';
import { zoneStatusData, zoneStatusDataV2, zoneStatusDataV3, zoneStatusDataV4 } from '../dummy/data/zoneStatus';

const Home = () => {
  const navigate = useNavigate();
  const [zoneStatuses, setZoneStatuses] = useState({});
  const [dataVersion, setDataVersion] = useState(1);

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

  useEffect(() => {
    console.log('Home 컴포넌트 마운트 - SSE 연결 시작');
    let disconnectSSE = null;
    let interval = null;
    
    // SSE 연결을 통한 실시간 데이터 수신
    try {
      console.log('SSE 연결 초기화 중...');
      disconnectSSE = connectMainSSE({
        onMessage: (data) => {
          console.log('SSE 메인 데이터 수신:', data);
          try {
            if (data.code === 'OK') {
              const statusMap = {};
              data.data.forEach(zone => {
                statusMap[zone.zoneName] = zone.status;
              });
              setZoneStatuses(statusMap);
              
              // 실시간 데이터로 업데이트된 존들 목록 출력 (A01, B01만)
              const realtimeZones = Object.keys(statusMap).filter(zoneName => 
                zoneName === 'zone_A' || zoneName === 'zone_B'
              );
              console.log('SSE 데이터 처리 완료 - 존 상태 업데이트:', statusMap);
              console.log(`실시간 데이터 사용 중인 존들:`, realtimeZones);
              
              // 각 존별로 실시간 데이터임을 표시 (A01, B01만)
              realtimeZones.forEach(zoneName => {
                console.log(`Zone ${zoneName}: 실시간 SSE 데이터 사용 (상태: ${statusMap[zoneName]})`);
              });
              
              // 나머지 존들은 더미 데이터 사용 중임을 표시
              const dummyZones = ['zone_A02', 'zone_B02', 'zone_B03', 'zone_B04', 'zone_C01', 'zone_C02'];
              dummyZones.forEach(zoneName => {
                if (statusMap[zoneName]) {
                  console.log(`Zone ${zoneName}: 더미 데이터 사용 (상태: ${statusMap[zoneName]})`);
                }
              });
            } else {
              console.log('SSE 응답이 성공이 아닙니다:', data);
              // SSE 응답이 실패한 경우 더미 데이터 사용
              useFallbackData();
            }
          } catch (error) {
            console.error('SSE 데이터 처리 오류:', error);
            useFallbackData();
          }
        },
        onError: (error) => {
          console.error('SSE 연결 오류:', error);
          console.log('더미 데이터로 폴백합니다.');
          useFallbackData();
        }
      });
      console.log('SSE 연결 초기화 완료');
    } catch (error) {
      console.error('SSE 연결 초기화 오류:', error);
      useFallbackData();
    }

    // 더미 데이터 사용 함수
    const useFallbackData = () => {
      console.log(`더미 데이터 사용 (버전 ${dataVersion})`);
      let fallbackData;
      switch (dataVersion) {
        case 1:
          fallbackData = zoneStatusData;
          break;
        case 2:
          fallbackData = zoneStatusDataV2;
          break;
        case 3:
          fallbackData = zoneStatusDataV3;
          break;
        case 4:
          fallbackData = zoneStatusDataV4;
          break;
        default:
          fallbackData = zoneStatusData;
      }
      
      const statusMap = {};
      fallbackData.data.forEach(zone => {
        statusMap[zone.zoneName] = zone.status;
      });
      setZoneStatuses(statusMap);
      
      // 더미 데이터로 설정된 존들 목록 출력 (A01, B01 제외)
      const dummyZones = Object.keys(statusMap).filter(zoneName => 
        zoneName !== 'zone_A' && zoneName !== 'zone_B'
      );
      console.log(`더미 데이터 버전 ${dataVersion} 적용:`, statusMap);
      console.log(`더미 데이터 사용 중인 존들:`, dummyZones);
      
      // 각 존별로 더미 데이터임을 표시 (A01, B01 제외)
      dummyZones.forEach(zoneName => {
        console.log(` Zone ${zoneName}: 더미 데이터 사용 (상태: ${statusMap[zoneName]})`);
      });
      
      // A01, B01은 실시간 데이터 대기 중임을 표시
      if (statusMap['zone_A']) {
        console.log(`Zone zone_A (A01): 실시간 SSE 데이터 대기 중 (현재 상태: ${statusMap['zone_A']})`);
      }
      if (statusMap['zone_B']) {
        console.log(`Zone zone_B (B01): 실시간 SSE 데이터 대기 중 (현재 상태: ${statusMap['zone_B']})`);
      }
    };

    // 초기 더미 데이터 로드 (SSE 연결 전까지)
    console.log('초기 더미 데이터 로드');
    useFallbackData();

    // 5초마다 더미 데이터 버전 순환 (적당한 주기)
    interval = setInterval(() => {
      console.log('더미 데이터 버전 순환');
      setDataVersion(prev => {
        const newVersion = prev === 4 ? 1 : prev + 1;
        console.log(`더미 데이터 버전 변경: ${prev} → ${newVersion}`);
        return newVersion;
      });
    }, 5000); // 5초로 변경

    // 컴포넌트 언마운트 시 SSE 연결 해제 및 인터벌 정리
    return () => {
      console.log('Home 컴포넌트 언마운트 - 리소스 정리 시작');
      if (disconnectSSE) {
        try {
          console.log('SSE 연결 해제 중...');
          disconnectSSE();
          console.log('SSE 연결 해제 완료');
        } catch (error) {
          console.log(' SSE 연결 해제 중 오류:', error);
        }
      }
      if (interval) {
        console.log('인터벌 정리 중...');
        clearInterval(interval);
        console.log('인터벌 정리 완료');
      }
      console.log('Home 컴포넌트 리소스 정리 완료');
    };
  }, [dataVersion]);

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
  const getStatusColor = (status) => {
    switch (status) {
      case 'GREEN':
        return '!bg-green-500';
      case 'YELLOW':
        return '!bg-yellow-400';
      case 'RED':
        return '!bg-red-500';
      default:
        return '!bg-gray-400';
    }
  };

  return (
    <div>
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
          const status = zoneStatuses[zone.zone_name];
          const statusColor = getStatusColor(status);
          
          // A01과 B01은 실시간 데이터, 나머지는 더미 데이터
          const isRealtimeZone = zone.zone_name === 'zone_A' || zone.zone_name === 'zone_B';
          const isDummyData = !status || status === 'UNKNOWN' || !isRealtimeZone;
          const dataSource = isDummyData ? '더미 데이터' : '실시간 SSE 데이터';
          
          console.log(`Zone ${zone.name}: status=${status}, color=${statusColor}, 데이터소스=${dataSource} (실시간존: ${isRealtimeZone})`);
          
          return (
            <div
              key={zone.id}
              onClick={() => navigate(`/home/zone/${zone.id}`)}
              className="text-black font-bold bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition-colors"
            >
              {/* zone.name 텍스트 */}
              <span>{zone.name}</span>

              {/* 상태 아이콘 */}
              <div 
                className={`w-[17.54px] h-[17.54px] rounded-[8.77px] border border-gray-300 ${statusColor}`}
                style={{ backgroundColor: status === 'GREEN' ? '#10b981' : status === 'YELLOW' ? '#fbbf24' : status === 'RED' ? '#ef4444' : '#9ca3af' }}
                title={`Status: ${status || 'Unknown'} (${dataSource})`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home; 