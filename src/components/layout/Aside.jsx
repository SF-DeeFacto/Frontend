import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  BarChart2,
  FileText,
  MessageCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import MenuItem from "./MenuItem";
import Icon from '../common/Icon';
import Text from '../common/Text';
import { logout } from '../../services/api/auth';
import { openChatBotPopup } from '../chatbot/ChatBotPopup';

const Aside = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved ? JSON.parse(saved) : true;
  });
  const [zoneOpen, setZoneOpen] = useState(false);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebar_collapsed', JSON.stringify(newCollapsed));
    if (!isCollapsed) setZoneOpen(false);
  };

  // 서브메뉴 아이템 렌더링 함수 - 모던 디자인 적용
  const renderSubMenuItem = (label, path, key) => (
    <div
      key={key}
      onClick={() => navigate(path)}
      className="text-secondary-600 dark:text-neutral-300 cursor-pointer hover:bg-primary-50 dark:hover:bg-neutral-700/50 hover:text-primary-600 px-4 py-2.5 rounded-xl ml-6 transition-all duration-200 group hover:scale-105"
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-secondary-400 dark:bg-neutral-500 group-hover:bg-primary-500 transition-colors duration-200"></div>
        <Text variant="menu" size="sm" weight="medium">
          {label}
        </Text>
      </div>
    </div>
  );

  // 모든 Zone 서브메뉴 아이템들
  const getAllZoneItems = () => {
    return [
      { label: 'A01', path: '/home/zone/a01', zoneId: 'a01' },
      { label: 'A02', path: '/home/zone/a02', zoneId: 'a02' },
      { label: 'B01', path: '/home/zone/b01', zoneId: 'b01' },
      { label: 'B02', path: '/home/zone/b02', zoneId: 'b02' },
      { label: 'B03', path: '/home/zone/b03', zoneId: 'b03' },
      { label: 'B04', path: '/home/zone/b04', zoneId: 'b04' },
      { label: 'C01', path: '/home/zone/c01', zoneId: 'c01' },
      { label: 'C02', path: '/home/zone/c02', zoneId: 'c02' }
    ];
  };

  // 메뉴 아이템 데이터
  const menuItems = [
    {
      icon: <Home />,
      label: "Home",
      onClick: () => navigate("/home"),
    },
    {
      icon: <Layers />,
      label: "Zone",
      onClick: () => {
        // 접힌 상태에서 Zone 클릭 시 사이드바 확장
        if (isCollapsed) {
          setIsCollapsed(false);
          localStorage.setItem('sidebar_collapsed', JSON.stringify(false));
        }
        setZoneOpen(!zoneOpen);
      },
      hasSubMenu: true,
    },

    {
      icon: <BarChart2 />,
      label: "Graph",
      onClick: () => navigate("/home/graph"),
    },
    {
      icon: <FileText />,
      label: "Report",
      onClick: () => navigate("/home/report"),
    },
    {
      icon: <MessageCircle />,
      label: "Chatbot",
      onClick: openChatBotPopup,
    },

    {
      icon: <LogOut />,
      label: "Logout",
      onClick: async () => {
        try {
          // auth.js의 logout 함수 사용 (일관성 확보)
          await logout();
          alert("로그아웃되었습니다.");
          navigate("/login");
        } catch (error) {
          console.error('로그아웃 중 오류 발생:', error);
          // 에러가 발생해도 로컬 스토리지는 이미 정리됨 (logout 함수에서 처리)
          alert("로그아웃되었습니다.");
          navigate("/login");
        }
      },
    },
  ];

  // 사이드바 스타일 - 브랜드 색상 더 강하게 적용
  const sidebarStyle = {
    background: 'linear-gradient(180deg, rgba(240, 240, 249, 0.95) 0%, rgba(229, 229, 242, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(229, 229, 242, 0.8)',
    boxShadow: '2px 0 10px rgba(73, 79, 162, 0.15)',
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
        isCollapsed ? "w-20" : "w-48"
      } min-h-[calc(100vh-60px)] flex flex-col px-3.5 pt-5 transition-all duration-300 ease-in-out relative z-40 bg-gradient-to-b from-brand-light/95 to-brand-medium/95 dark:from-neutral-800/95 dark:to-neutral-700/95 backdrop-blur-lg border-r border-white/20 dark:border-neutral-700/30 shadow-soft flex-shrink-0`}
    >
      {/* 메뉴 네비게이션 */}
      <nav className="flex flex-col space-y-2 w-full items-center">
        {/* 토글 버튼을 메뉴와 함께 */}
        <div className="w-full">
          <div
            onClick={toggleSidebar}
            className="nav-item group relative overflow-hidden w-12 h-12 justify-center cursor-pointer"
            title={isCollapsed ? "사이드바 확장" : "사이드바 축소"}
          >
            {/* 호버 배경 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            
            <div className="relative z-10 flex items-center justify-center w-full">
              <div className="flex items-center justify-center transition-all duration-200 text-secondary-600 dark:text-neutral-300 group-hover:text-primary-600 w-6 h-6">
                {isCollapsed ? (
                  <Icon><ChevronsRight /></Icon>
                ) : (
                  <Icon><ChevronsLeft /></Icon>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 메인 메뉴 아이템들 */}
        {menuItems.map((item, index) => (
          <div key={index} className={`w-full ${item.label === "Zone" ? "relative" : ""}`}>
            <MenuItem
              icon={<Icon>{item.icon}</Icon>}
              label={item.label}
              onClick={item.onClick}
              collapsed={isCollapsed}
            />
            
            {/* Zone 서브메뉴 - 모든 Zone 표시 */}
            {item.label === "Zone" && (
              <>
                {/* 확장된 상태에서의 서브메뉴 */}
                {!isCollapsed && (
                  <div 
                    className={`space-y-1 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                      zoneOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {getAllZoneItems().map(zone => 
                      renderSubMenuItem(zone.label, zone.path, zone.zoneId)
                    )}
                  </div>
                )}
                
                {/* 접힌 상태에서의 드롭다운 메뉴 */}
                {isCollapsed && zoneOpen && (
                  <div className="absolute left-full top-0 ml-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-2 min-w-[200px] z-50">
                    {getAllZoneItems().map(zone => (
                      <div
                        key={zone.zoneId}
                        onClick={() => navigate(zone.path)}
                        className="text-secondary-600 dark:text-neutral-300 cursor-pointer hover:bg-primary-50 dark:hover:bg-neutral-700/50 hover:text-primary-600 px-4 py-2.5 transition-all duration-200 group hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary-400 dark:bg-neutral-500 group-hover:bg-primary-500 transition-colors duration-200"></div>
                          <Text variant="menu" size="sm" weight="medium">
                            {zone.label}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

    </aside>
  );
};

export default Aside; 