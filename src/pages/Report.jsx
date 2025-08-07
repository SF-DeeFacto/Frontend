import React, { useState } from 'react';
import { OptionFrame } from '../components/common/option';
import Button from '../components/common/Button';
import { dummyReports } from '../dummy/data/reports';

const Report = () => {
  // 더미 데이터 사용
  const [reports] = useState(dummyReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOptionOpen, setIsOptionOpen] = useState(false); // 옵션 토글 상태
  
  // 옵션 토글 상태에 따라 아이템 수 조정
  const itemsPerPage = isOptionOpen ? 9 : 10;

  const handleDownload = (reportId) => {
    // 다운로드 로직 구현
    console.log(`리포트 ${reportId} 다운로드`);
    // 실제로는 API 호출이나 파일 다운로드 로직이 들어갈 수 있습니다
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 현재 페이지의 데이터 계산
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = reports.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 옵션 토글 상태 변경 함수
  const handleOptionToggle = (isOpen) => {
    setIsOptionOpen(isOpen);
    setCurrentPage(1); // 옵션 변경 시 첫 페이지로 리셋
  };

  return (
    <div className="space-y-50 relative">
      {/* 첫 번째 섹션: 옵션 영역 */}
      <OptionFrame onToggle={handleOptionToggle}>
        <div className="space-y-[20px] text-sm text-[#001d6c] font-medium">
          {/* Section 1: 정렬 */}
          <div className="flex items-center space-x-4 pb-3 pt-4 border-b border-gray-200">
            <span className="w-[70px]">정렬</span>
            <div className="flex space-x-[25px]">
              <Button>전체</Button>
              <Button>정기</Button>
              <Button>비정기</Button>
            </div>
          </div>
          {/* Section 2: 기간 */}
          <div className="flex items-center space-x-4 pb-3 pt-4 border-b border-gray-200">
            <span className="w-[70px]">기간</span>
            <div className="flex space-x-[25px]">
              <Button>1주</Button>
              <Button>1개월</Button>
              <Button>3개월</Button>
              <Button>6개월</Button>
              <Button>1년</Button>
              <Button>직접입력</Button>
            </div>
          </div>
        </div>
      </OptionFrame>

      {/* 두 번째 섹션: 리포트 목록 테이블 */}
      <div>
        <h2 className="text-xl font-semibold text-[#001d6c] mb-6">리포트 목록</h2>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-4 gap-4 p-[20px] border-b border-gray-200 font-semibold text-white" style={{backgroundColor: '#f0f8ff'}}>
            <div className="text-center">No</div>
            <div className="text-center">리포트 명</div>
            <div className="text-center">생성일자</div>
            <div className="text-center">다운로드</div>
          </div>
          
          {/* 테이블 바디 */}
          <div className="divide-y divide-gray-200">
            {currentReports.map((report) => (
              <div key={report.id} className="grid grid-cols-4 gap-4 p-[20px] hover:bg-gray-50 transition-colors">
                <div className="text-center text-gray-600">{report.id}</div>
                <div className="text-center text-[#001d6c] font-medium">{report.report_name}</div>
                <div className="text-center text-gray-600">{formatDate(report.created_at)}</div>
                <div className="text-center">
                  <button
                    onClick={() => handleDownload(report.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    다운로드
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 세 번째 섹션: 페이지네이션 */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4">
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report; 