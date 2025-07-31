import React from "react";

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
          <span
            style={{
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "21px"
            }}
          >
            {label}
          </span>
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