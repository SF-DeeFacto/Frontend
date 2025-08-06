import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ModelViewer from '../components/3d/ModelViewer';
import Button from '../components/common/Button';
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
    // API 호출 시뮬레이션 (백엔드 연동 실패 시 더미 데이터 사용)
    const fetchZoneStatus = async () => {
      try {
        // 실제 API 호출 시도
        const response = await fetch('/api/home/status');
        const data = await response.json();
        
        if (data.code === 'SUCCESS') {
          const statusMap = {};
          data.data.zones.forEach(zone => {
            statusMap[zone.zone_name] = zone.status;
          });
          setZoneStatuses(statusMap);
          console.log('실제 API 데이터 로드됨:', data);
        } else {
          // API 응답이 성공이 아닌 경우 더미 데이터 사용
          throw new Error('API 응답 실패');
        }
      } catch (error) {
        console.error('Zone status fetch error:', error);
        console.log('더미 데이터로 폴백합니다.');
        
        // 에러 발생 시 더미 데이터 사용 (버전별로 순환)
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
        fallbackData.data.zones.forEach(zone => {
          statusMap[zone.zone_name] = zone.status;
        });
        setZoneStatuses(statusMap);
        console.log(`더미 데이터 버전 ${dataVersion} 사용:`, fallbackData);
      }
    };

    // 초기 데이터 로드
    fetchZoneStatus();

    // 20초마다 데이터 업데이트
    const interval = setInterval(() => {
      // 더미 데이터 버전 순환 (1-4)
      setDataVersion(prev => prev === 4 ? 1 : prev + 1);
      fetchZoneStatus();
    }, 20000); // 20초

    return () => clearInterval(interval);
  }, [dataVersion]);

  const zones = [
    { 
      id: 'a01', 
      name: 'Zone A01',
      zone_name: 'Zone_A01'
    },
    { 
      id: 'a02', 
      name: 'Zone A02',
      zone_name: 'Zone_A02'
    },
    { 
      id: 'b01', 
      name: 'Zone B01',
      zone_name: 'Zone_B01'
    },
    { 
      id: 'b02', 
      name: 'Zone B02',
      zone_name: 'Zone_B02'
    },
    { 
      id: 'b03', 
      name: 'Zone B03',
      zone_name: 'Zone_B03'
    },
    { 
      id: 'b04', 
      name: 'Zone B04',
      zone_name: 'Zone_B04'
    },
    { 
      id: 'c01', 
      name: 'Zone C01',
      zone_name: 'Zone_C01'
    },
    { 
      id: 'c02', 
      name: 'Zone C02',
      zone_name: 'Zone_C02'
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
          console.log(`Zone ${zone.name}: status=${status}, color=${statusColor}`);
          
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
                title={`Status: ${status || 'Unknown'}`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home; 