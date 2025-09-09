import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Text from "../common/Text";

// 스타일 클래스 생성 유틸리티 함수
const createMenuItemStyles = (isActive, collapsed) => {
  const baseTransition = "transition-colors duration-200";
  const activeColor = "text-primary-600";
  const inactiveColor = "text-secondary-600 dark:text-neutral-300 group-hover:text-primary-600";
  const rightIconInactiveColor = "text-secondary-400 dark:text-neutral-400 group-hover:text-primary-600";
  
  return {
    container: `nav-item group relative overflow-hidden transition-all duration-200 cursor-pointer ${
      collapsed ? 'w-12 h-12 justify-center' : 'w-full justify-between'
    } ${isActive ? 'active' : ''}`,
    
    icon: `flex items-center justify-center ${baseTransition} ${
      isActive ? activeColor : inactiveColor
    }`,
    
    text: `${baseTransition} ${
      isActive ? activeColor : inactiveColor
    }`,
    
    rightIcon: `flex items-center justify-center ${baseTransition} ${
      isActive ? activeColor : rightIconInactiveColor
    }`
  };
};

const MenuItem = ({ icon, label, onClick, collapsed, rightIcon, href }) => {
  const location = useLocation();
  const isActive = href && location.pathname.includes(href);
  
  // 스타일 클래스들을 메모이제이션으로 최적화
  const styles = useMemo(
    () => createMenuItemStyles(isActive, collapsed),
    [isActive, collapsed]
  );
  
  return (
    <div
      onClick={onClick}
      className={styles.container}
      title={collapsed ? label : undefined}
    >
      {/* 활성 상태 인디케이터 */}
      {isActive && (
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-r-full" />
      )}
      
      {/* 호버 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className={styles.icon}>
          {icon}
        </div>
        
        {!collapsed && (
          <Text 
            variant="menu" 
            size="sm" 
            weight={isActive ? "semibold" : "medium"}
            className={styles.text}
          >
            {label}
          </Text>
        )}
      </div>
      
      {/* 우측 아이콘 */}
      {!collapsed && rightIcon && (
        <div className={styles.rightIcon}>
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default MenuItem; 