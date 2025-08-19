import React, { useState } from 'react';
import { dummyReports } from '../dummy/data/reports';

const Report = () => {
  const [reports] = useState(dummyReports);
  const [reportType, setReportType] = useState('전체');
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 6; // 페이지당 6개씩 표시

  const handleDownload = (reportId) => {
    console.log(`리포트 ${reportId} 다운로드`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  // 검색 및 필터링
  const filteredReports = reports.filter(report => {
    // 검색어 필터링
    const matchesSearch = report.report_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 리포트 형식 필터링
    const matchesReportType = reportType === '전체' || report.report_type === reportType;
    
    // 기간 필터링 (간단한 예시 - 실제로는 더 정교한 로직이 필요)
    let matchesPeriod = true;
    if (selectedPeriod !== '전체' && report.created_at) {
      const reportDate = new Date(report.created_at);
      const now = new Date();
      const diffTime = Math.abs(now - reportDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (selectedPeriod) {
        case '1주':
          matchesPeriod = diffDays <= 7;
          break;
        case '2주':
          matchesPeriod = diffDays <= 14;
          break;
        case '1개월':
          matchesPeriod = diffDays <= 30;
          break;
        case '3개월':
          matchesPeriod = diffDays <= 90;
          break;
        case '직접입력':
          // 직접입력의 경우 모든 데이터 표시 (사용자가 직접 날짜 범위를 입력할 수 있도록)
          matchesPeriod = true;
          break;
        default:
          matchesPeriod = true;
      }
    }
    
    return matchesSearch && matchesReportType && matchesPeriod;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 필터 변경 시 첫 페이지로 리셋
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 필터 및 검색 영역 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 리포트 형식 드롭다운 */}
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                handleFilterChange();
              }}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="전체">리포트 형식</option>
              <option value="정기">정기</option>
              <option value="비정기">비정기</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 기간 필터 버튼들 */}
          <div className="flex space-x-2">
            {['전체', '1주', '2주', '1개월', '3개월', '직접입력'].map((period) => (
              <button
                key={period}
                onClick={() => {
                  setSelectedPeriod(period);
                  handleFilterChange();
                }}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* 검색바 */}
        <div className="relative">
          <input
            type="text"
            placeholder="리포트명 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 리포트 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <span>No</span>
                  <div className="flex flex-col">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <span>정기유무</span>
                  <div className="flex flex-col">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <span>리포트명</span>
                  <div className="flex flex-col">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <span>생성일자</span>
                  <div className="flex flex-col">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                다운로드
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentReports.map((report, index) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{startIndex + index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {report.report_type || '정기'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {report.report_name || '내용 입력'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {report.created_at ? formatDate(report.created_at) : '내용 입력'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownload(report.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Report; 