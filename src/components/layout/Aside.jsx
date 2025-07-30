import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLayers,
  FiBarChart2,
  FiFileText,
  FiMessageCircle,
  FiLogOut,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronDown,
} from "react-icons/fi";
import MenuItem from "./MenuItem";

const iconClass = "w-[24px] h-[24px]";

const Aside = () => {
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
    <aside
      className={`${
        isCollapsed ? "w-[70px]" : "w-[240px]"
      } h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-sm flex flex-col justify-center items-center px-2.5 pb-16 pt-2.5 transition-all duration-300 ease-in-out`}
    >
      {/* 메뉴 */}
      <nav className="flex flex-col space-y-[25px] px-3 pt-6">
        <MenuItem
          icon={<FiHome className={iconClass} />}
          label="Home"
          onClick={() => navigate("/home")}
          collapsed={isCollapsed}
        />

        <MenuItem
          icon={<FiLayers className={iconClass} />}
          label="Zone"
          onClick={() => setZoneOpen(!zoneOpen)}
          collapsed={isCollapsed}
          rightIcon={
            !isCollapsed ? (
              <FiChevronDown className={iconClass + " transition-transform duration-200 " + (zoneOpen ? "rotate-0" : "-rotate-90")}/>
            ) : null
          }
        />

        {zoneOpen && !isCollapsed && (
          <div className="space-y-1 mt-2 ml-2">
            {renderSubMenuItem("ZoneA", "/zone/a")}
          </div>
        )}

        <MenuItem
          icon={<FiBarChart2 className={iconClass} />}
          label="Graph"
          onClick={() => navigate("/graph")}
          collapsed={isCollapsed}
        />
        <MenuItem
          icon={<FiFileText className={iconClass} />}
          label="Report"
          onClick={() => navigate("/report")}
          collapsed={isCollapsed}
        />
        <MenuItem
          icon={<FiMessageCircle className={iconClass} />}
          label="Chatbot"
          onClick={() => navigate("/chatbot")}
          collapsed={isCollapsed}
        />
      </nav>

      {/* 하단 */}
      <div className="flex flex-col space-y-6 mt-auto w-full items-start pb-6">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100 ml-[12px]"
        >
          {isCollapsed ? (
            <FiChevronsRight className={iconClass} />
          ) : (
            <FiChevronsLeft className={iconClass} />
          )}
        </button>
        <FiLogOut
          className={iconClass + " text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ml-[12px]"}
          onClick={() => {
            localStorage.removeItem("token");
            alert("로그아웃되었습니다.");
            navigate("/");
          }}
        />
      </div>
    </aside>
  );
};

export default Aside; 