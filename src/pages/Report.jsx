// import React, { useState, useEffect } from 'react';
// import axios from 'axios';


// const Report = () => {
//   // TODO: 실제로는 로그인 정보에서 employeeId를 가져오도록 변경하세요
//   // local redis에 저장된 사원 번호 {123}  `{}` 까지 값으로 되어서 포함시킴
//   const EMPLOYEE_ID = '{123}';

//   const [reports, setReports] = useState([]);
//   const [reportType, setReportType] = useState('전체');
//   const [selectedPeriod, setSelectedPeriod] = useState('전체');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
  
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const itemsPerPage = 6; // 페이지당 6개씩 표시

//   // 서버에서 리포트 목록 조회
//   const fetchReports = async (page = currentPage) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = {
//         type: reportType !== '전체' ? reportType : undefined,
//         // backend expects startDate/endDate as query params if provided
//         startDate: startDate || undefined,
//         endDate: endDate || undefined,
//         page: Math.max(0, page - 1), // Spring Pageable: 0-based
//         size: itemsPerPage,
//       };

//       const res = await axios.get('/reports/list', {
//         params,
//         headers: {
//           'X-Employee-Id': EMPLOYEE_ID,
//         },
//       });

//       // ApiResponseDto 형태: { code, message, data }
//       const payload = res.data?.data ?? res.data;
//       // payload is expected to be a Page<Report>
//       const content = payload?.content ?? payload;
//       const total = payload?.totalElements ?? payload?.total ?? (Array.isArray(content) ? content.length : 0);

//       setReports(content || []);
//       setTotalItems(total);
//     } catch (err) {
//       console.error('리포트 조회 실패', err);
//       setError('리포트 목록을 불러오는 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchReports();
//   console.log('리포트 조회:', { reports, reportType, selectedPeriod, searchQuery });

//   const handleDownload = (reportId) => {
//     console.log(`리포트 ${reportId} 다운로드`);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}. ${month}. ${day}`;
//   };

//   // 검색 및 필터링
//   const filteredReports = reports.filter(report => {
//     // 검색어 필터링
//     const matchesSearch = report.report_name.toLowerCase().includes(searchQuery.toLowerCase());
    
//     // 리포트 형식 필터링
//     const matchesReportType = reportType === '전체' || report.report_type === reportType;
    
//     // 기간 필터링
//     let matchesPeriod = true;
//     if (selectedPeriod !== '전체' && report.created_at) {
//       const reportDate = new Date(report.created_at);
      
//       if (selectedPeriod === '직접입력' && startDate && endDate) {
//         // 직접입력 날짜 범위 체크
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59); // 종료일은 해당 날짜의 마지막 시간으로 설정
//         matchesPeriod = reportDate >= start && reportDate <= end;
//       } else if (selectedPeriod !== '직접입력') {
//         // 기존 기간 필터링
//         const now = new Date();
//         const diffTime = Math.abs(now - reportDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
//         switch (selectedPeriod) {
//           case '1주':
//             matchesPeriod = diffDays <= 7;
//             break;
//           case '2주':
//             matchesPeriod = diffDays <= 14;
//             break;
//           case '1개월':
//             matchesPeriod = diffDays <= 30;
//             break;
//           case '3개월':
//             matchesPeriod = diffDays <= 90;
//             break;
//           default:
//             matchesPeriod = true;
//         }
//       }
//     }
    
//     return matchesSearch && matchesReportType && matchesPeriod;
//   });

//   // 페이지네이션 계산
//   const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentReports = filteredReports.slice(startIndex, endIndex);

//   // 페이지 변경 함수
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // 필터 변경 시 첫 페이지로 리셋
//   const handleFilterChange = () => {
//     setCurrentPage(1);
//   };

//   // 직접입력 날짜 선택 처리
//   const handleDirectInputClick = () => {
//     setSelectedPeriod('직접입력');
//     setShowDatePicker(true);
//     handleFilterChange();
//   };

//   // 날짜 적용
//   const handleDateApply = () => {
//     if (startDate && endDate) {
//       setShowDatePicker(false);
//       handleFilterChange();
//     }
//   };

//   // 날짜 선택 취소
//   const handleDateCancel = () => {
//     setShowDatePicker(false);
//     setStartDate('');
//     setEndDate('');
//     setSelectedPeriod('전체');
//     handleFilterChange();
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* 필터 및 검색 영역 */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           {/* 리포트 형식 드롭다운 */}
//           <div className="relative">
//             <select
//               value={reportType}
//               onChange={(e) => {
//                 setReportType(e.target.value);
//                 handleFilterChange();
//               }}
//               className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="전체">리포트 형식</option>
//               <option value="정기">정기</option>
//               <option value="비정기">비정기</option>
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//               <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>
//           </div>

//           {/* 기간 필터 버튼들 */}
//           <div className="flex space-x-2">
//             {['전체', '1주', '2주', '1개월', '3개월'].map((period) => (
//               <button
//                 key={period}
//                 onClick={() => {
//                   setSelectedPeriod(period);
//                   handleFilterChange();
//                 }}
//                 className={`px-3 py-2 text-sm rounded-md transition-colors ${
//                   selectedPeriod === period
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {period}
//               </button>
//             ))}
//             <button
//               onClick={handleDirectInputClick}
//               className={`px-3 py-2 text-sm rounded-md transition-colors ${
//                 selectedPeriod === '직접입력'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               직접입력
//             </button>
//           </div>
          
//           {/* 선택된 날짜 범위 표시 */}
//           {selectedPeriod === '직접입력' && startDate && endDate && (
//             <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
//               {startDate} ~ {endDate}
//             </div>
//           )}
//         </div>

//         {/* 검색바 */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="리포트명 입력하세요"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//           />
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* 날짜 선택 모달 */}
//       {showDatePicker && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800">날짜 범위 선택</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   min={startDate}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
            
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={handleDateCancel}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//               >
//                 취소
//               </button>
//               <button
//                 onClick={handleDateApply}
//                 disabled={!startDate || !endDate}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 적용
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 리포트 테이블 */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
//                 <div className="flex items-center space-x-1">
//                   <span>No</span>
//                   <div className="flex flex-col">
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                     </svg>
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
//                 <div className="flex items-center space-x-1">
//                   <span>정기유무</span>
//                   <div className="flex flex-col">
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                     </svg>
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
//                 <div className="flex items-center space-x-1">
//                   <span>리포트명</span>
//                   <div className="flex flex-col">
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                     </svg>
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
//                 <div className="flex items-center space-x-1">
//                   <span>생성일자</span>
//                   <div className="flex flex-col">
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                     </svg>
//                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
//                 다운로드
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {currentReports.map((report, index) => (
//               <tr key={report.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm text-gray-900">{startIndex + index + 1}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {report.report_type || '정기'}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {report.report_name || '내용 입력'}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {report.created_at ? formatDate(report.created_at) : '내용 입력'}
//                 </td>
//                 <td className="px-6 py-4">
//                   <button
//                     onClick={() => handleDownload(report.id)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
//                   >
//                     Download
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 페이지네이션 */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6">
//           <nav className="flex items-center space-x-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`px-3 py-2 text-sm rounded-md transition-colors ${
//                   currentPage === i + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Report; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const API_BASE = 'http://localhost:8085';
const API_BASE = '/report-api';
const EMPLOYEE_ID = '1';
const Report = () => {
  // TODO: 실제로는 로그인 정보에서 employeeId를 가져오도록 변경하세요
  

  // UI 상태
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState('전체');
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 5; // 서버 page size에 맞춰 변경 가능

  // 서버에서 리포트 목록 조회
  const fetchReports = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        type: reportType !== '전체' ? reportType : undefined,
        // backend expects startDate/endDate as query params if provided
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: Math.max(0, page - 1), // Spring Pageable: 0-based
        size: itemsPerPage,
      };
      console.log('🚀 리포트 목록 조회 시작');
      console.log('📋 요청 파라미터:', params);

      const res = await axios.get(`${API_BASE}/reports/list`, {
        params,
        headers: {
          'X-Employee-Id': EMPLOYEE_ID
        },
      });
      console.log('✅ 리포트 목록 조회 성공:', res.data);

      // ApiResponseDto 형태: { code, message, data }
      const payload = res.data?.data ?? res.data;
      // payload is expected to be a Page<Report>
      const content = payload?.content ?? payload;
      const total = payload?.totalElements ?? payload?.total ?? (Array.isArray(content) ? content.length : 0);

      setReports(content || []);
      setTotalItems(total);
    } catch (err) {
      console.error('❌ 리포트 조회 실패:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError('리포트 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 및 필터/페이지 변경 시 조회
  useEffect(() => {
    setCurrentPage(1);
    fetchReports(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, selectedPeriod, startDate, endDate, searchQuery]);

  useEffect(() => {
    fetchReports(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // 다운로드 처리
  // const handleDownload = async (fileName) => {
  //   setError(null);
  //   try {
  //     const res = await axios.get(`${API_BASE}/reports/download/${encodeURIComponent(fileName)}`, {
  //       headers: {
  //         'X-Employee-Id': EMPLOYEE_ID,
  //       },
  //       responseType: 'blob',
  //     });

  //     const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;

  //     // 서버가 Content-Disposition 파일명 제공하지 않으면 fileName 사용
  //     const disposition = res.headers['content-disposition'];
  //     let downloadName = fileName;
  //     if (disposition) {
  //       const match = disposition.match(/filename="?(.+?)"?(\;|$)/);
  //       if (match) downloadName = match[1];
  //     }

  //     a.download = downloadName;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error('파일 다운로드 실패', err);
  //     setError('파일 다운로드에 실패했습니다.');
  //   }
  // };
  async function handleDownload(fileName) {
  setError(null);
  const url = `${API_BASE}/reports/download/${fileName}`;
  try {
    // console.log('[REPORTS] download', url);
    const res = await axios.get(url, {
      headers: { 'X-Employee-Id': EMPLOYEE_ID },
      responseType: 'blob',
      validateStatus: (s) => true, // always let us inspect the response
    });

    // 서버가 에러를 JSON/text로 반환했을 수 있음 -> blob을 텍스트로 읽어 검사
    if (res.status !== 200) {
      const blob = res.data;
      let text = '';
      try { text = await blob.text(); } catch (e) { text = '[cannot parse error body]'; }
      // console.error('[REPORTS] download error', { status: res.status, body: text });
      setError(`서버 오류(${res.status}): ${text}`);
      return;
    }

    // 정상 다운로드 처리
    const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
    const disposition = res.headers['content-disposition'];
    let downloadName = fileName;
    if (disposition) {
      const match = disposition.match(/filename="?(.+?)"?(\;|$)/);
      if (match) downloadName = match[1];
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    // console.error('[REPORTS] download unexpected error', err);
    setError('파일 다운로드 중 네트워크 오류가 발생했습니다.');
    // 폴백: 새 탭으로 열어 서버 에러/로그 확인 (브라우저에서 직접 열어보게 함)
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
  // 기존 화면 렌더링 로직을 유지하면서 데이터 바인딩
  const filteredReports = reports.filter(report => {
    // 클라이언트 추가 필터(서버에서 이미 필터링이 가능하면 불필요)
    if (!searchQuery) return true;
    return (report.report_name || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(0, itemsPerPage); // 서버 페이징 사용하면 reports는 이미 한 페이지

  // UI 이벤트들 (날짜 선택 등 기존 로직 유지)
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  const handleFilterChange = () => setCurrentPage(1);

  const formatDate = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  return (
    <div className="p-6 space-y-6">
      {loading && <div className="text-sm text-gray-500">로딩 중...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* 기존 필터/검색 UI (생략 가능) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); handleFilterChange(); }}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm"
            >
              <option value="전체">리포트 형식</option>
              <option value="정기">정기</option>
              <option value="비정기">비정기</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="리포트명 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
          />
        </div>
      </div>

      {/* 리포트 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">No</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">정기유무</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">리포트명</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">생성일자</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">다운로드</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentReports.map((report, index) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{startIndex + index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{report.type || '정기'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{report.fileName || '내용 입력'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{report.createdAt ? formatDate(report.createdAt) : '내용 입력'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownload(report.fileName)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
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
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm rounded-md bg-gray-100">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`px-3 py-2 text-sm rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{i + 1}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm rounded-md bg-gray-100">Next</button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Report;
