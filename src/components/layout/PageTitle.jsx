import React from 'react';

const PageTitle = ({ children }) => (
  <div className="flex flex-col w-[1200px] px-[30px] py-[11px] items-start flex-shrink-0">
    <div className="w-[1154px] h-[35px] flex items-center">
      <span
        style={{
          fontSize: "28px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "35px"
        }}
      >
        {children}
      </span>
    </div>
  </div>
);

export default PageTitle; 