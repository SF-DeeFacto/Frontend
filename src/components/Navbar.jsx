// components/Navbar/Navbar.jsx
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
  FiChevronRight,
} from "react-icons/fi";
import MenuItem from "./MenuItem";
import SubMenuZone from "./SubMenuZone";

const Navbar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setZoneOpen(false);
  };

  return (
    <nav
      className={`h-screen ${
        isCollapsed ? "w-[60px]" : "w-[200px]"
      } bg-[#F8F9FF] border-r shadow-md flex flex-col justify-between px-2 py-6 font-sans transition-all duration-300`}
    >
      {/* 상단 */}
      <div className="space-y-6">
        {/* 로고 */}
        <div className="flex items-center justify-center">
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
              ? "flex-col items-center space-y-2"
              : "flex-row justify-between items-center"
          } px-2`}
        >
          <span className={`text-xs text-gray-700 ${isCollapsed ? "" : "mr-2"}`}>
            {isCollapsed ? "홍" : "홍길동 사원"}
          </span>

          <FiSettings
            className="w-4 h-4 text-gray-600 cursor-pointer"
            onClick={() => navigate("/setting")}
          />
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/alarm")}
          >
            <FiBell className="w-4 h-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* 메뉴 */}
        <div className="mt-6 space-y-2">
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
            rightIcon={!isCollapsed ? (zoneOpen ? <FiChevronDown /> : <FiChevronRight />) : null}
          />
          {zoneOpen && !isCollapsed && (
            <div className="ml-8 space-y-1">
              <SubMenuZone label="ZoneA" onClick={() => navigate("/zone/a")} />
              <SubMenuZone label="ZoneB" onClick={() => navigate("/zone/b")} />
              <SubMenuZone label="ZoneC" onClick={() => navigate("/zone/c")} />
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
      <div className="space-y-4 flex flex-col items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-black transition"
        >
          {isCollapsed ? <FiChevronsRight className="w-5 h-5" /> : <FiChevronsLeft className="w-5 h-5" />}
        </button>
        <FiLogOut
          className="w-5 h-5 text-gray-700 cursor-pointer"
          onClick={() => navigate("/logout")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
