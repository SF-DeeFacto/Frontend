import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ModelViewer from '../components/3d/ModelViewer';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();

  const zones = [
    { 
      id: 'a01', 
      name: 'Zone A01',
    },
    { 
      id: 'a02', 
      name: 'Zone A02',
    },
    { 
      id: 'b01', 
      name: 'Zone B01',
    },
    { 
      id: 'b02', 
      name: 'Zone B02',
    },
    { 
      id: 'b03', 
      name: 'Zone B03',
    },
    { 
      id: 'b04', 
      name: 'Zone B04',
    },
    { 
      id: 'c01', 
      name: 'Zone C01',
    },
    { 
      id: 'c02', 
      name: 'Zone C02',
    },
  ];

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
        {zones.map((zone) => (
          <Button
            key={zone.id}
            onClick={() => navigate(`/home/zone/${zone.id}`)}
            className="text-black font-bold bg-white border border-gray-300 hover:bg-gray-50"
          >
            {zone.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Home; 