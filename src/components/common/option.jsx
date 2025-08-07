import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Text from "./Text";

// 아래로 향하는 아이콘 (토글)
const ChevronDown = ({ isOpen }) => (
  <FiChevronDown
    className="w-5 h-5"
  />
);

// 옵션 프레임
export const OptionFrame = ({ children, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onToggle) {
      onToggle(newIsOpen);
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-start p-4">
      {/* 옵션 텍스트 + 아이콘 버튼 */}
      <div className="flex items-center w-full pb-2 mb-9">
        <div className="text-blue-600 font-bold mr-2" style={{ fontSize: '20px' }}>옵션</div>

        <button
          onClick={handleToggle}
          className="p-1 bg-transparent border-none outline-none focus:outline-none"
        >
          <ChevronDown isOpen={isOpen} />
        </button>
      </div>

      {/* 펼쳐지는 콘텐츠 영역 */}
      {isOpen && <div className="w-full">{children}</div>}
    </div>
  );
};