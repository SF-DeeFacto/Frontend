import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { handleApiError } from '../utils/unifiedErrorHandler';
import { SYSTEM_CONFIG } from '../config/constants';

/**
 * 사용자 검색 관련 커스텀 훅
 */
export const useUserSearch = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: SYSTEM_CONFIG.DEFAULT_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * API 응답에서 사용자 데이터 추출
   */
  const extractUserData = (response) => {
    if (!response?.data) return { content: [], totalElements: 0, totalPages: 0 };
    
    const apiData = response.data.data || response.data;
    return {
      content: apiData.content || [],
      totalElements: apiData.totalElements || 0,
      totalPages: apiData.totalPages || 0
    };
  };

  /**
   * 사용자 데이터 매핑 (백엔드 필드명을 프론트엔드 형식으로 변환)
   */
  const mapUserData = (users) => {
    return users.map(user => ({
      ...user,
      isActive: user.active !== undefined ? user.active : true,
      gender: user.gender === 'M' ? 'male' : (user.gender === 'F' ? 'female' : user.gender)
    }));
  };

  /**
   * 검색 파라미터 생성
   */
  const createSearchParams = (page, size, searchTerm) => {
    const baseParams = { page, size: size || pagination.size };
    
    if (searchTerm && searchTerm.trim()) {
      return {
        name: searchTerm.trim(),
        employeeId: searchTerm.trim()
      };
    }
    
    return baseParams;
  };

  /**
   * 이름과 사번으로 병렬 검색
   */
  const searchByNameAndEmployeeId = async (page, size, searchTerm) => {
    const trimmedTerm = searchTerm.trim();
    const searchParams = { page, size: size || pagination.size };
    
    console.log('이름 검색 파라미터:', { ...searchParams, name: trimmedTerm });
    console.log('사번 검색 파라미터:', { ...searchParams, employeeId: trimmedTerm });
    
    // 두 검색을 병렬로 실행
    const [nameResponse, employeeIdResponse] = await Promise.all([
      userService.searchUsers({ ...searchParams, name: trimmedTerm })
        .catch(() => ({ data: { content: [] } })),
      userService.searchUsers({ ...searchParams, employeeId: trimmedTerm })
        .catch(() => ({ data: { content: [] } }))
    ]);
    
    // 결과 추출
    const nameData = extractUserData(nameResponse);
    const employeeIdData = extractUserData(employeeIdResponse);
    
    // 결과 합치기 (중복 제거)
    const uniqueResults = new Map();
    [...nameData.content, ...employeeIdData.content].forEach(user => {
      uniqueResults.set(user.employeeId, user);
    });
    
    const searchResults = Array.from(uniqueResults.values());
    const totalElements = searchResults.length;
    const totalPages = Math.ceil(totalElements / (size || pagination.size));
    
    return {
      content: searchResults,
      totalElements,
      totalPages
    };
  };

  /**
   * 전체 사용자 조회
   */
  const searchAllUsers = async (page, size) => {
    const searchParams = { page, size: size || pagination.size };
    
    console.log('전체 조회 파라미터:', searchParams);
    const response = await userService.searchUsers(searchParams);
    
    return extractUserData(response);
  };

  /**
   * 사용자 목록 로드
   */
  const loadUsers = useCallback(async (page = 0, searchTerm = '', size = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      let searchResults;
      
      if (searchTerm && searchTerm.trim()) {
        // 이름 또는 사번 검색
        searchResults = await searchByNameAndEmployeeId(page, size, searchTerm);
      } else {
        // 전체 조회
        searchResults = await searchAllUsers(page, size);
      }
      
      // 사용자 데이터 매핑
      const mappedUsers = mapUserData(searchResults.content);
      
      setUsers(mappedUsers);
      setPagination({
        page: page,
        size: size || pagination.size,
        totalElements: searchResults.totalElements,
        totalPages: searchResults.totalPages
      });
      
      console.log('검색 결과:', mappedUsers.length, '개의 사용자 발견');
      
    } catch (error) {
      const errorInfo = handleApiError(error, '사용자 목록 로드');
      console.error('사용자 목록 로드 실패:', errorInfo.message);
      setError(errorInfo.userMessage);
      setUsers([]);
      setPagination({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.size]);

  /**
   * 검색어 변경 핸들러
   */
  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  }, []);

  /**
   * 페이지 변경 핸들러
   */
  const handlePageChange = useCallback((newPage) => {
    loadUsers(newPage, searchTerm);
  }, [loadUsers, searchTerm]);

  /**
   * 페이지 크기 변경 핸들러
   */
  const handlePageSizeChange = useCallback((newSize) => {
    loadUsers(0, searchTerm, newSize);
  }, [loadUsers, searchTerm]);

  /**
   * 검색어 변경 시 디바운스된 검색 실행
   */
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadUsers(0, searchTerm);
    }, 300); // 300ms 지연으로 debounce 효과

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, loadUsers]);

  return {
    users,
    pagination,
    loading,
    error,
    searchTerm,
    loadUsers,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    setError
  };
};
