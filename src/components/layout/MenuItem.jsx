import React from "react";
import Text from "../common/Text";

const MenuItem = ({ icon, label, onClick, collapsed, rightIcon }) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-[37px] px-[12px] py-[8px] items-center rounded-md cursor-pointer hover:bg-[#E9EDFB] text-gray-700 ${
        collapsed ? 'w-[46px] justify-center' : 'w-[180px] justify-between'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-5 h-5">{icon}</div>
        {!collapsed && (
          <Text variant="menu" size="sm" weight="medium">
            {label}
          </Text>
        )}
      </div>
      {!collapsed && rightIcon && (
        <div className="flex items-center justify-center">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default MenuItem; 