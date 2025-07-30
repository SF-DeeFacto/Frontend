import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLayers,
  FiBarChart2,
  FiFileText,
  FiMessageCircle,
  FiSettings,
  FiBell,
  FiLogOut,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronDown,
} from "react-icons/fi";
import MenuItem from "./MenuItem";

const Navbar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setZoneOpen(false);
  };

  // 서브메뉴 아이템 렌더링 함수
  const renderSubMenuItem = (label, path) => (
    <div
      key={label}
      onClick={() => navigate(path)}
      className="text-sm text-gray-600 cursor-pointer hover:bg-[#DDE3FA] px-6 py-2 rounded-md ml-4 transition-colors duration-200"
    >
      {label}
    </div>
  );

  return (
    <nav
      className={`h-screen ${
        isCollapsed ? "w-[64px]" : "w-[240px]"
      } bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between transition-all duration-300 ease-in-out`}
    >
      {/* 상단 */}
      <div className="space-y-8">
        {/* 로고 */}
        <div className="flex items-center justify-center pt-6 pb-4">
          <span
            className={`text-xl font-bold text-[#4D5DFA] ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            🧊 Deefacto
          </span>
        </div>

        {/* 유저 정보 */}
        <div
          className={`flex ${
            isCollapsed
              ? "flex-col items-center space-y-3"
              : "flex-row justify-between items-center"
          } px-4 py-3 mx-2 bg-gray-50 rounded-lg`}
        >
          <span className={`text-sm font-medium text-gray-800 ${isCollapsed ? "" : "mr-2"}`}>
            {isCollapsed ? "홍" : "홍길동 사원"}
          </span>

          <div className="flex items-center space-x-3">
            <FiSettings
              className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
              onClick={() => navigate("/setting")}
            />
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/alarm")}
            >
              <FiBell className="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="space-y-2 px-3">
          <MenuItem
            icon={<FiHome />}
            label="Home"
            onClick={() => navigate("/home")}
            collapsed={isCollapsed}
          />

          <MenuItem
            icon={<FiLayers />}
            label="Zone"
            onClick={() => setZoneOpen(!zoneOpen)}
            collapsed={isCollapsed}
            rightIcon={
              !isCollapsed ? (
                <FiChevronDown
                  className={`transition-transform duration-200 ${
                    zoneOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              ) : null
            }
          />

          {zoneOpen && !isCollapsed && (
            <div className="space-y-1 mt-2 ml-2">
              {renderSubMenuItem("ZoneA", "/zone/a")}
              {renderSubMenuItem("ZoneB", "/zone/b")}
              {renderSubMenuItem("ZoneC", "/zone/c")}
              {renderSubMenuItem("ZoneD", "/zone/d")}
              {renderSubMenuItem("ZoneE", "/zone/e")}
              {renderSubMenuItem("ZoneF", "/zone/f")}
              {renderSubMenuItem("ZoneG", "/zone/g")}
              {renderSubMenuItem("ZoneH", "/zone/h")}
            </div>
          )}

          <MenuItem
            icon={<FiBarChart2 />}
            label="Graph"
            onClick={() => navigate("/graph")}
            collapsed={isCollapsed}
          />
          <MenuItem
            icon={<FiFileText />}
            label="Report"
            onClick={() => navigate("/report")}
            collapsed={isCollapsed}
          />
          <MenuItem
            icon={<FiMessageCircle />}
            label="Chatbot"
            onClick={() => navigate("/chatbot")}
            collapsed={isCollapsed}
          />
        </div>
      </div>

      {/* 하단 */}
      <div className="space-y-6 flex flex-col items-center pb-6">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <FiChevronsRight className="w-5 h-5" />
          ) : (
            <FiChevronsLeft className="w-5 h-5" />
          )}
        </button>
        <FiLogOut
          className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            alert("로그아웃되었습니다.");
            navigate("/");
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
