import React, { useState, useCallback } from "react";
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
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { handleDummyLogout } from '../../dummy/services/user';

const Aside = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isAdmin, getAccessibleZones } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  // 디버깅: 사용자 정보와 권한 확인
  console.log('Aside - 현재 사용자:', user);
  console.log('Aside - isAdmin():', isAdmin());
  console.log('Aside - getAccessibleZones():', getAccessibleZones());

  // 사이드바 토글 함수
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setZoneOpen(false);
  }, [isCollapsed]);

  // 서브메뉴 아이템 렌더링 함수
  const renderSubMenuItem = useCallback((label, path, key) => (
    <div
      key={key}
      onClick={() => navigate(path)}
      className="text-gray-600 cursor-pointer hover:bg-[#E9EDFB] px-6 py-2 rounded-md ml-8 transition-colors duration-200 pr-[75px]"
    >
      <span className="text-sm font-medium text-gray-600">
        {label}
      </span>
    </div>
  ), [navigate]);

  // 권한에 맞는 Zone 서브메뉴 아이템들 생성
  const getAccessibleZoneItems = useCallback(() => {
    const allZoneItems = [
      { label: 'A01', path: '/zone/a', zoneId: 'a' },
      { label: 'A02', path: '/zone/b', zoneId: 'b' },
      { label: 'B01', path: '/zone/c', zoneId: 'c' },
      { label: 'B02', path: '/zone/d', zoneId: 'd' },
      { label: 'B03', path: '/zone/e', zoneId: 'e' },
      { label: 'B04', path: '/zone/f', zoneId: 'f' },
      { label: 'C01', path: '/zone/g', zoneId: 'g' },
      { label: 'C02', path: '/zone/h', zoneId: 'h' }
    ];

    // 관리자는 모든 Zone에 접근 가능
    if (isAdmin()) {
      console.log('Aside - 관리자: 모든 Zone 표시');
      return allZoneItems;
    }
    
    // 일반 사용자는 자신의 권한에 맞는 Zone만 접근 가능
    const accessibleZones = getAccessibleZones();
    const filteredItems = allZoneItems.filter(item => accessibleZones.includes(item.zoneId));
    console.log('Aside - 일반 사용자:', user?.role, '접근 가능한 Zone:', accessibleZones, '필터링된 아이템:', filteredItems);
    return filteredItems;
  }, [isAdmin, getAccessibleZones, user?.role]);

  // 챗봇 창 열기 함수
  const openChatBot = useCallback(() => {
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
  }, []);

  // 로그아웃 함수
  const handleLogout = useCallback(async () => {
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
      
      logout();
      navigate("/login");
    } catch (error) {
      // 네트워크 오류 등으로 API 호출이 실패하면 더미 로그아웃으로 처리
      console.log('API 호출 중 오류 발생, 더미 로그아웃으로 처리:', error);
      handleDummyLogout();
      alert("로그아웃되었습니다.");
      logout();
      navigate("/login");
    }
  }, [logout, navigate]);

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
      onClick: openChatBot,
    },
    {
      icon: <FiLogOut />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-[70px]" : "w-[240px]"
      } h-[calc(100vh-64px)] shadow-sm flex flex-col items-center px-3 pt-5 transition-all duration-300 ease-in-out border-r`}
      style={{
        backgroundColor: '#F0F0F980',
        borderColor: '#F0F0F9'
      }}
    >
      {/* 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        className="text-gray-500 hover:text-gray-700 transition-colors p-1 self-end mb-2 bg-transparent border-none mr-[15px]"
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
            
            {/* Zone 서브메뉴 - 권한에 맞는 Zone만 표시 */}
            {item.label === "Zone" && (
              <div 
                className="space-y-1 mt-2" 
                style={{ 
                  minHeight: zoneOpen && !isCollapsed ? '120px' : '0px', 
                  overflow: 'hidden', 
                  transition: 'min-height 0.3s ease-in-out' 
                }}
              >
                {zoneOpen && !isCollapsed && getAccessibleZoneItems().map(zone => 
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