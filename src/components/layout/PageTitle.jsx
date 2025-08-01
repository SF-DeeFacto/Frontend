import React from 'react';

const PageTitle = ({ children }) => (
  <div className="flex flex-col w-full items-start flex-shrink-0" style={{ paddingTop: '20px', paddingBottom: '11px' }}>
    <div className="w-full h-[35px] flex items-center">
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