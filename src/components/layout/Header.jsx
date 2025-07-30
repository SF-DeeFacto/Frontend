import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiBell,
} from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex w-full h-[54px] justify-center items-center flex-shrink-0 border-b bg-white">
      {/* 로고 */}
      <div className="flex items-center">
        <span className="flex items-center justify-center w-[45px] h-[45px] text-2xl" style={{fontSize: '45px', lineHeight: '45px'}}>
          🧊
        </span>
        <span
          className="ml-3 font-bold text-[#4D5DFA]"
          style={{ fontSize: '24px', lineHeight: '26.4px', fontWeight: 700 }}
        >
          Deefacto
        </span>
      </div>

      {/* 중앙 공간 - gap 대체 */}
      <div className="flex-1"></div>

      {/* 날짜 및 시간 + 날씨 */}
      <div
        className="flex flex-row gap-2 items-center h-[30px] justify-center w-auto whitespace-nowrap"
        style={{
          fontFeatureSettings: "'dlig' on",
          fontSize: "13px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "30px"
        }}
      >
        {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        <span>날씨 정보 가져왕왕</span>
      </div>

      {/* 유저 정보 및 네비게이션 */}
      <nav className="flex items-center space-x-3">
        <FiSettings
          className="w-[24px] h-[24px] flex-shrink-0 aspect-square text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => navigate("/setting")}
        />
        <div
          className="relative cursor-pointer w-[24px] h-[24px] flex-shrink-0 aspect-square"
          onClick={() => navigate("/alarm")}
        >
          <FiBell className="w-[24px] h-[24px] flex-shrink-0 aspect-square text-gray-500 hover:text-gray-700 transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <span className="text-sm font-medium text-gray-800">
          홍길동 사원
        </span>
      </nav>
    </header>
  );
};

export default Header; 