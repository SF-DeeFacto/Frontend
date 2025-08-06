import React from 'react';
import { OptionFrame } from '../components/common/option';
import ChartSection from '../components/common/ChartSection';
import Button from '../components/common/Button';

const Graph = () => {
  const chartSections = [
    {
      title: '온도 그래프',
      zone: 'Zone A01',
      icon: '📊',
      description: '온도 차트 영역'
    },
    {
      title: '습도 그래프',
      zone: 'Zone A01',
      icon: '💧',
      description: '습도 차트 영역'
    },
    {
      title: '정전기 그래프',
      zone: 'Zone A01',
      icon: '⚡',
      description: '정전기 차트 영역'
    },
    {
      title: '풍속 그래프',
      zone: 'Zone A01',
      icon: '🌪️',
      description: '풍속 차트 영역'
    },
    {
      title: '먼지 그래프',
      zone: 'Zone A01',
      icon: '🌫️',
      description: '먼지 차트 영역'
    },
    {
      title: '종합 분석',
      zone: 'Zone A01',
      icon: '📈',
      description: '종합 분석 차트 영역'
    }
  ];

  return (
    <div className="space-y-50">
      {/* 첫 번째 섹션: 옵션 영역 */}
      <OptionFrame>
        <div className="space-y-[20px] text-sm text-[#001d6c] font-medium">
          {/* Section 1: 존 */}
          <div className="flex items-center space-x-4 pb-3 pt-4 border-b border-gray-200">
            <span className="w-[70px]">Zone</span>
            <div className="flex space-x-[25px]">
              <Button>Zone A01</Button>
              <Button>Zone A02</Button>
              <Button>Zone B01</Button>
              <Button>Zone B02</Button>
              <Button>Zone B03</Button>
              <Button>Zone B04</Button>
              <Button>Zone C01</Button>
              <Button>Zone C02</Button>
            </div>
          </div>
          {/* Section 2: 센서 */}
          <div className="flex items-center space-x-4 pb-3 pt-4 border-b border-gray-200">
            <span className="w-[70px]">Sensor</span>
            <div className="flex space-x-[25px]">
              <Button>온도</Button>
              <Button>습도</Button>
              <Button>정전기</Button>
              <Button>풍속</Button>
              <Button>먼지</Button>
            </div>
          </div>

          {/* Section 3: 기간 */}
          <div className="flex items-center space-x-4 pb-3 pt-4 border-b border-gray-200">
            <span className="w-[70px]">기간</span>
            <div className="flex space-x-[25px]">
              <Button>1시간</Button>
              <Button>3시간</Button>
              <Button>6시간</Button>
              <Button>12시간</Button>
              <Button>1일</Button>
              <Button>3일</Button>
              <Button>1주</Button>
              <Button>직접입력</Button>
            </div>
          </div>
        </div>
      </OptionFrame>

      {/* 두 번째 섹션: 차트 영역 */}
      <div>
        <h2 className="text-xl font-semibold text-[#001d6c] mb-6">센서 데이터 차트</h2>
        
        {/* 6개의 동일한 크기 섹션 */}
        <div className="grid grid-cols-2" style={{ gap: '30px' }}>
                     {chartSections.map((section, index) => (
             <ChartSection
               key={index}
               title={section.title}
               icon={section.icon}
               description={section.description}
               showZone={true}
               height="h-[90px]"
             />
           ))}
        </div>
      </div>
    </div>
  );
};

export default Graph; 