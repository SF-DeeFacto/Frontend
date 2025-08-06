import React from 'react';
import { OptionFrame } from '../components/common/option';

const Graph = () => {
  return (
    <OptionFrame>
      {/* ↓ 펼쳐질 영역에 자유롭게 섹션 구성 */}
      <div className="space-y-4 text-sm text-[#001d6c] font-medium">
        {/* Section 1: 존 */}
        <div className="flex items-center space-x-4">
          <span className="w-[70px]">Zone</span>
          <div className="flex space-x-4">
            <button>Zone A01</button>
            <button>Zone A02</button>
            <button>Zone B01</button>
            <button>Zone B02</button>
            <button>Zone B03</button>
            <button>Zone B04</button>
            <button>Zone C01</button>
            <button>Zone C02</button>
          </div>
        </div>
        {/* Section 2: 센서 */}
        <div className="flex items-center space-x-4">
          <span className="w-[70px]">Sensor</span>
          <div className="flex space-x-4">
            <button>온도</button>
            <button>습도</button>
            <button>정전기</button>
            <button>풍속</button>
            <button>먼지</button>
          </div>
        </div>

        {/* Section 3: 기간 */}
        <div className="flex items-center space-x-4">
          <span className="w-[70px]">기간</span>
          <div className="flex space-x-4">
            <button>1시간</button>
            <button>3시간</button>
            <button>6시간</button>
            <button>12시간</button>
            <button>1일</button>
            <button>3일</button>
            <button>1주</button>
            <button>직접입력</button>
          </div>
        </div>
      </div>
    </OptionFrame>
  );
};

export default Graph; 