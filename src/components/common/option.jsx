import React, { useState } from "react";

// 아래로 향하는 아이콘 (토글)
const ChevronDown = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// 옵션 프레임
export const OptionFrame = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[1100px] flex flex-col items-start justify-start p-4 border border-gray-200 rounded-md bg-white shadow">
      {/* 옵션 텍스트 + 아이콘 버튼 */}
      <div className="flex items-center border-b border-gray-300 w-full pb-2 mb-4">
        <div className="text-blue-900 text-lg font-medium mr-2">옵션</div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <ChevronDown isOpen={isOpen} />
        </button>
      </div>

      {/* 펼쳐지는 콘텐츠 영역 */}
      {isOpen && <div className="w-full">{children}</div>}
    </div>
  );
};