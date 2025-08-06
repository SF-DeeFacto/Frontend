import React from 'react';
import { OptionFrame } from '../components/common/option';

const Report = () => {
  return (
    <OptionFrame>
      {/* ↓ 펼쳐질 영역에 자유롭게 섹션 구성 */}
      <div className="space-y-4 text-sm text-[#001d6c] font-medium">
        {/* Section 1: 정렬 */}
        <div className="flex items-center space-x-4">
          <span className="w-[70px]">정렬</span>
          <div className="flex space-x-4">
            <button>전체</button>
            <button>정기</button>
            <button>비정기</button>
          </div>
        </div>
        {/* Section 2: 기간 */}
        <div className="flex items-center space-x-4">
          <span className="w-[70px]">기간</span>
          <div className="flex space-x-4">
            <button>1주</button>
            <button>1개월</button>
            <button>3개월</button>
            <button>6개월</button>
            <button>1년</button>
            <button>직접입력</button>
          </div>
        </div>
      </div>
    </OptionFrame>
  );
};

export default Report; 