import { useState } from "react";
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
} from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <navbar
      className={`h-screen ${isCollapsed ? "w-[60px]" : "w-[200px]"} bg-[#F8F9FF] border-r shadow-md flex flex-col justify-between px-2 py-6 font-sans transition-all duration-300`}
    >
      {/* 상단 로고 및 버튼 */}
      <div className="space-y-6">
        {/* 로고 */}
        <div className="flex items-center justify-center">
          <span className={`text-xl font-bold text-[#4D5DFA] ${isCollapsed ? "hidden" : ""}`}>🧊 Deefacto</span>
        </div>

        <div className={`flex ${isCollapsed ? "flex-col items-center space-y-2" : "flex-row justify-between items-center"} px-2`}>
          {/* 사용자 이름 */}
          <span className={`text-xs text-gray-700 ${isCollapsed ? "" : "mr-2"}`}>
            {isCollapsed ? "홍" : "홍길동 사원"}
          </span>

          {/* 설정 아이콘 */}
          <FiSettings
            className="w-4 h-4 text-gray-600 cursor-pointer"
            onClick={() => navigate("/setting")}
          />

          {/* 알림 아이콘 */}
          <div className="relative cursor-pointer" onClick={() => navigate("/alarm")}>
            <FiBell className="w-4 h-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* 메뉴 */}
        <div className="mt-6 space-y-2">
          <MenuItem icon={<FiHome />} label="Home" onClick={() => navigate("/home")} collapsed={isCollapsed} />
          <MenuItem icon={<FiLayers />} label="Zone" onClick={() => navigate("/zone")} collapsed={isCollapsed} />
          <MenuItem icon={<FiBarChart2 />} label="Graph" onClick={() => navigate("/graph")} collapsed={isCollapsed} />
          <MenuItem icon={<FiFileText />} label="Report" onClick={() => navigate("/report")} collapsed={isCollapsed} />
          <MenuItem icon={<FiMessageCircle />} label="Chatbot" onClick={() => navigate("/chatbot")} collapsed={isCollapsed} />
        </div>
      </div>

      {/* 하단: 접기 버튼 + 로그아웃 */}
      <div className="space-y-4 flex flex-col items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-black transition"
        >
          {isCollapsed ? <FiChevronsRight className="w-5 h-5" /> : <FiChevronsLeft className="w-5 h-5" />}
        </button>
        <FiLogOut className="w-5 h-5 text-gray-700 cursor-pointer" onClick={() => navigate("/logout")} />
      </div>
    </navbar>
  );
};

const MenuItem = ({ icon, label, onClick, collapsed }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 text-sm px-3 py-2 rounded-md cursor-pointer hover:bg-[#E9EDFB] text-gray-700"
    >
      <div className="w-5 h-5">{icon}</div>
      {!collapsed && <span>{label}</span>}
    </div>
  );
};

export default Navbar;