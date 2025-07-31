// src/components/layout/MainLayout.jsx
import React from 'react';
import Header from './Header';
import Aside from './Aside';
import PageTitle from './PageTitle';

const MainLayout = ({ title, children }) => (
  <div className="flex flex-col">
    <Header />
    <div className="flex">
      <Aside />
      <div className="flex-1 bg-gray-50 px-[30px]">
        {title && <PageTitle>{title}</PageTitle>}
        {children}
      </div>
    </div>
  </div>
);

export default MainLayout;
