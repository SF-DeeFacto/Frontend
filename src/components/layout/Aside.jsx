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
} from "react-icons/fi";
import MenuItem from "./MenuItem";
import Icon from '../common/Icon';
import Text from '../common/Text';

const Aside = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setZoneOpen(false);
  };

  // 서브메뉴 아이템 렌더링 함수
  const renderSubMenuItem = (label, path) => (
    <div
      key={label}
      onClick={() => navigate(path)}
      className="text-gray-600 cursor-pointer hover:bg-[#DDE3FA] px-6 py-2 rounded-md ml-8 transition-colors duration-200 pr-[75px]"
    >
      <Text variant="menu" size="sm" weight="medium" color="gray-600">
        {label}
      </Text>
    </div>
  );

  // 메뉴 아이템 데이터
  const menuItems = [
    {
      icon: <FiHome />,
      label: "Home",
      onClick: () => navigate("/home"),
    },
    {
      icon: <FiLayers />,
      label: "Zone",
      onClick: () => setZoneOpen(!zoneOpen),
      hasSubMenu: true,
    },
    {
      icon: <FiBarChart2 />,
      label: "Graph",
      onClick: () => navigate("/graph"),
    },
    {
      icon: <FiFileText />,
      label: "Report",
      onClick: () => navigate("/report"),
    },
    {
      icon: <FiMessageCircle />,
      label: "Chatbot",
      onClick: () => {
        // 기존 챗봇 창이 있는지 확인
        const existingWindow = window.open('', 'ChatBot');
        
        if (existingWindow && !existingWindow.closed) {
          // 기존 창이 있으면 포커스
          existingWindow.focus();
        } else {
          // 기존 창이 없으면 새 창 열기
          const chatBotWindow = window.open(
            '/chatbot?new=true',
            'ChatBot',
            'width=400,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
          );
          
          if (chatBotWindow) {
            chatBotWindow.focus();
          } else {
            alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
          }
        }
      },
    },
    {
      icon: <FiLogOut />,
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
        navigate("/");
      },
    },
  ];

  // 사이드바 스타일
  const sidebarStyle = {
    backgroundColor: '#F0F0F980',
    borderColor: '#F0F0F9',
    paddingTop: '20px'
  };

  // 토글 버튼 스타일
  const toggleButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    marginRight: '15px'
  };

  return (
              <aside
       className={`${
         isCollapsed ? "w-[70px]" : "w-[240px]"
       } h-[calc(100vh-64px)] shadow-sm flex flex-col items-center px-3 pt-5 transition-all duration-300 ease-in-out border-r`}
       style={sidebarStyle}
     >
       {/* 토글 버튼 */}
       <button
         onClick={toggleSidebar}
         className="text-gray-500 hover:text-gray-700 transition-colors p-1 self-end mb-2"
         style={toggleButtonStyle}
       >
         {isCollapsed ? (
           <Icon><FiChevronsRight /></Icon>
         ) : (
           <Icon><FiChevronsLeft /></Icon>
         )}
       </button>
       
               {/* 메뉴 네비게이션 */}
        <nav className="flex flex-col space-y-[10px]">
                {/* 메인 메뉴 아이템들 */}
         {menuItems.map((item, index) => (
           <div key={index}>
             <MenuItem
               icon={<Icon>{item.icon}</Icon>}
               label={item.label}
               onClick={item.onClick}
               collapsed={isCollapsed}
             />
             
             {/* Zone 서브메뉴 - Zone 메뉴 바로 밑에 렌더링 */}
             {item.label === "Zone" && zoneOpen && !isCollapsed && (
               <div className="space-y-1 mt-2">
                 {renderSubMenuItem("ZoneA", "/zone/a")}
               </div>
             )}
           </div>
         ))}
       </nav>
     </aside>
  );
};

export default Aside; 