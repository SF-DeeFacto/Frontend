// src/components/layout/MainLayout.jsx
import React from 'react';
import Header from './Header';
import Aside from './Aside';
import Text from '../common/Text';

const MainLayout = ({ title, children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex flex-1">
      <Aside />
      <div className="flex-1 bg-gray-50">
        {title && (
          <div className="px-[30px] py-[12px]">
            <Text variant="title" size="28px" weight="bold" color="gray-900">
              {title}
            </Text>
          </div>
        )}
        <div className="px-[30px] py-[12px]">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default MainLayout;
