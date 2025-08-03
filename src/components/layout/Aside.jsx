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
import { handleDummyLogout } from '../../dummy/services/user';

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
  const renderSubMenuItem = (label, path, key) => (
    <div
      key={key}
      onClick={() => navigate(path)}
      className="text-gray-600 cursor-pointer hover:bg-[#E9EDFB] px-6 py-2 rounded-md ml-8 transition-colors duration-200 pr-[75px]"
    >
      <Text variant="menu" size="sm" weight="medium" color="gray-600">
        {label}
      </Text>
    </div>
  );

  // 모든 Zone 서브메뉴 아이템들
  const getAllZoneItems = () => {
    return [
      { label: 'A01', path: '/home/zone/a', zoneId: 'a' },
      { label: 'A02', path: '/home/zone/b', zoneId: 'b' },
      { label: 'B01', path: '/home/zone/c', zoneId: 'c' },
      { label: 'B02', path: '/home/zone/d', zoneId: 'd' },
      { label: 'B03', path: '/home/zone/e', zoneId: 'e' },
      { label: 'B04', path: '/home/zone/f', zoneId: 'f' },
      { label: 'C01', path: '/home/zone/g', zoneId: 'g' },
      { label: 'C02', path: '/home/zone/h', zoneId: 'h' }
    ];
  };

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
      onClick: () => navigate("/home/graph"),
    },
    {
      icon: <FiFileText />,
      label: "Report",
      onClick: () => navigate("/home/report"),
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
            '/home/chatbot?new=true',
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
      onClick: async () => {
        try {
          const token = localStorage.getItem('token');
          
          // 실제 백엔드 API 호출 시도
          const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            // 실제 백엔드 응답 처리
            alert("로그아웃되었습니다.");
          } else {
            // 백엔드 API가 실패하면 더미 로그아웃으로 처리
            console.log('백엔드 API 호출 실패, 더미 로그아웃으로 처리');
            handleDummyLogout();
            alert("로그아웃되었습니다.");
          }
          
          navigate("/login");
        } catch (error) {
          // 네트워크 오류 등으로 API 호출이 실패하면 더미 로그아웃으로 처리
          console.log('API 호출 중 오류 발생, 더미 로그아웃으로 처리:', error);
          handleDummyLogout();
          alert("로그아웃되었습니다.");
          navigate("/login");
        }
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
            
            {/* Zone 서브메뉴 - 모든 Zone 표시 */}
            {item.label === "Zone" && (
              <div className="space-y-1 mt-2" style={{ minHeight: zoneOpen && !isCollapsed ? '120px' : '0px', overflow: 'hidden', transition: 'min-height 0.3s ease-in-out' }}>
                {zoneOpen && !isCollapsed && getAllZoneItems().map(zone => 
                  renderSubMenuItem(zone.label, zone.path, zone.zoneId)
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Aside; 