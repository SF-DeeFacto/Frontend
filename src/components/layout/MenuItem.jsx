import React from "react";
import { useLocation } from "react-router-dom";
import Text from "../common/Text";

const MenuItem = ({ icon, label, onClick, collapsed, rightIcon, href }) => {
  const location = useLocation();
  const isActive = href && location.pathname.includes(href);
  
  return (
    <div
      onClick={onClick}
      className={`nav-item group relative overflow-hidden ${
        collapsed ? 'w-12 h-12 justify-center' : 'w-full justify-between'
      } ${isActive ? 'active' : ''}`}
      title={collapsed ? label : undefined}
    >
      {/* 활성 상태 인디케이터 */}
      {isActive && (
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-r-full"></div>
      )}
      
      {/* 호버 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
      
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className={`flex items-center justify-center transition-all duration-200 ${
          isActive ? 'text-primary-600' : 'text-secondary-600 dark:text-neutral-300 group-hover:text-primary-600'
        }`}>
          {icon}
        </div>
        {!collapsed && (
          <Text 
            variant="menu" 
            size="sm" 
            weight={isActive ? "semibold" : "medium"}
            className={`transition-colors duration-200 ${
              isActive ? 'text-primary-600' : 'text-secondary-600 dark:text-neutral-300 group-hover:text-primary-600'
            }`}
          >
            {label}
          </Text>
        )}
      </div>
      
      {!collapsed && rightIcon && (
        <div className={`flex items-center justify-center transition-all duration-200 ${
          isActive ? 'text-primary-600' : 'text-secondary-400 dark:text-neutral-400 group-hover:text-primary-600'
        }`}>
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default MenuItem; 