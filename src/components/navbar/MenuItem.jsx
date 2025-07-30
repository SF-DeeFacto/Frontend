import React from "react";

const MenuItem = ({ icon, label, onClick, collapsed, rightIcon }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between text-sm px-4 py-4 rounded-md cursor-pointer hover:bg-[#E9EDFB] text-gray-700"
    >
      <div className="flex items-center gap-4">
        <div className="w-5 h-5">{icon}</div>
        {!collapsed && <span>{label}</span>}
      </div>
      {!collapsed && rightIcon}
    </div>
  );
};

export default MenuItem;
