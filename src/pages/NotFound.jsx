import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      {/* 기존 NotFound 페이지 내용만 남김 */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-700 mb-8">페이지를 찾을 수 없습니다.</p>
          <Link to="/home" className="text-blue-500 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound; 