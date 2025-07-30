import React from "react";

const MenuItem = ({ icon, label, onClick, collapsed, rightIcon }) => {
  return (
    <div
      onClick={onClick}
      className="flex w-[180px] h-[37px] px-[12px] py-[8px] items-center gap-[12px] rounded-md cursor-pointer hover:bg-[#E9EDFB] text-gray-700"
    >
      <div className="w-5 h-5">{icon}</div>
      {!collapsed && (
        <span
          className="ml-2"
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
      {!collapsed && rightIcon}
    </div>
  );
};

export default MenuItem; 