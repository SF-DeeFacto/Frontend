import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApiClient } from '../services';
 import axios from 'axios';

// const API_BASE = 'http://localhost:8085';
 const API_BASE = '/report-api';
//const API_BASE = import.meta.env.VITE_REPORT_API_BASE_URL || '/report-api';
// const EMPLOYEE_ID = '1';

const Report = () => {
  // 공통 인증 로직 사용
  const { isAuthenticated, isLoading: authLoading, user, token } = useAuth();
  // TODO: 실제로는 로그인 정보에서 employeeId를 가져오도록 변경하세요
  

  // UI 상태
  const [reports, setReports] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const[tocken,setToken]=useState("");

  const itemsPerPage = 10; // 서버 page size에 맞춰 변경 가능

  // 서버에서 리포트 목록 조회
  const fetchReports = async (page = currentPage) => {
    // 인증되지 않은 경우 조회하지 않음
    if (!isAuthenticated || !user?.employeeId) {
      console.log('인증되지 않은 사용자입니다.');
      return;
    }
    const EMPLOYEE_ID = localStorage.getItem('employeeId');
    setLoading(true);
    setError(null);
    try {
      const params = {
        // backend expects startDate/endDate as query params if provided
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: Math.max(0, page - 1), // Spring Pageable: 0-based
        size: itemsPerPage,
      };
      console.log('🚀 리포트 목록 조회 시작');
      console.log('📋 요청 파라미터:', params);
      console.log('👤 사용자 정보:', user.employeeId);
      console.log("tocken : "+token);

      // 기존 axios 방식 (주석 처리)
      const res = await axios.get(`${API_BASE}/reports/list`, {
        params,
        headers: {
          
          'Authorization': `Bearer ${token}`
        },
      });
      
      // 새로운 authApiClient 방식
      // const res = await authApiClient.get(`${API_BASE}/reports/list`, {
      //   params,
      //   headers: {
      //     'X-Employee-Id': user.employeeId
      //   },
      // });
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
    setToken(localStorage.getItem('access_Token'));
    if (isAuthenticated && user?.employeeId) {
      setCurrentPage(1);
      fetchReports(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, startDate, endDate, searchQuery, isAuthenticated, user?.employeeId]);

  useEffect(() => {
    if (isAuthenticated && user?.employeeId) {
      fetchReports(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isAuthenticated, user?.employeeId]);

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
    // 인증되지 않은 경우 다운로드하지 않음
    if (!isAuthenticated || !user?.employeeId) {
      console.log('인증되지 않은 사용자입니다.');
      setError('인증이 필요합니다.');
      return;

    }
    console.log('다운로드 요청:', fileName);
    console.log('👤 사용자 정보:', user.employeeId);
    console.log("token : " + token);

    setError(null);
    const url = `${API_BASE}/reports/download/${fileName}`;
    try {
      console.log('[REPORTS] download', url);
      
      // 기존 axios 방식 (주석 처리)
      const res = await axios.get(url, {
        headers: {
          'X-Employee-Id': user.employeeId,
          'Authorization': `Bearer ${token}`
        },
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
  // 리포트명 검색 기능 보완: 대소문자 무시, 공백 무시, fileName도 포함, 부분 일치 지원
  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    // report_name, fileName 모두 검사, 공백/대소문자 무시
    const reportName = (report.report_name || '').replace(/\s+/g, '').toLowerCase();
    const fileName = (report.fileName || '').replace(/\s+/g, '').toLowerCase();
    return reportName.includes(normalizedQuery.replace(/\s+/g, '')) || fileName.includes(normalizedQuery.replace(/\s+/g, ''));
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

  // 인증 로딩 중이거나 인증되지 않은 경우
  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-sm text-gray-500 dark:text-neutral-400">인증 확인 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-sm text-red-600 dark:text-red-400">로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {loading && <div className="text-sm text-gray-500 dark:text-neutral-400">로딩 중...</div>}
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

      {/* 기간 검색 UI */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 기간 검색 (startDate, endDate) */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); handleFilterChange(); }}
              className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            />
            <span className="mx-1">~</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => { setEndDate(e.target.value); handleFilterChange(); }}
              className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* 리포트 테이블 */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-neutral-200 border-b border-gray-200 dark:border-neutral-600">No</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-neutral-200 border-b border-gray-200 dark:border-neutral-600">정기유무</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-neutral-200 border-b border-gray-200 dark:border-neutral-600">리포트명</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-neutral-200 border-b border-gray-200 dark:border-neutral-600">생성일자</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-neutral-200 border-b border-gray-200 dark:border-neutral-600">다운로드</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-600">
            {currentReports.map((report, index) => (
              <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-neutral-100">{startIndex + index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-neutral-100">{report.type || '정기'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-neutral-100">{report.fileName || '내용 입력'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-neutral-100">{report.createdAt ? formatDate(report.createdAt) : '내용 입력'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownload(report.fileName)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md text-sm transition-colors duration-200"
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
              className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1} 
                onClick={() => handlePageChange(i + 1)} 
                className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                    : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
