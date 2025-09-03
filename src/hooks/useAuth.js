/**
 * 인증 관련 커스텀 훅
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '@constants';

/**
 * 로컬 스토리지에서 안전하게 값을 가져오는 함수
 * @param {string} key - 스토리지 키
 * @returns {string|null} 값 또는 null
 */
const getStorageValue = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * 사용자 데이터를 안전하게 파싱하는 함수
 * @param {string} userString - JSON 문자열
 * @returns {Object|null} 파싱된 사용자 객체 또는 null
 */
const parseUserData = (userString) => {
  if (!userString) return null;
  
  try {
    const userData = JSON.parse(userString);
    
    // 필수 필드 검증
    if (!userData || typeof userData !== 'object') return null;
    if (!userData.employeeId || !userData.name) return null;
    
    return userData;
  } catch (error) {
    console.warn('Failed to parse user data:', error);
    return null;
  }
};

/**
 * 토큰 유효성 검사
 * @param {string} token - 액세스 토큰
 * @returns {boolean} 유효성 여부
 */
const isTokenValid = (token) => {
  if (!token) return false;
  if (typeof token !== 'string') return false;
  if (token.length < 10) return false; // 최소 길이 검증
  
  // TODO: JWT 토큰인 경우 만료 시간 검증 추가
  return true;
};

/**
 * 인증 상태 확인 훅
 * @returns {Object} 인증 관련 데이터와 함수들
 */
export const useAuth = () => {
  const navigate = useNavigate();

  // 현재 인증 상태 확인
  const authState = useMemo(() => {
    const token = getStorageValue(STORAGE_KEYS.ACCESS_TOKEN);
    const userString = getStorageValue(STORAGE_KEYS.USER);
    const userData = parseUserData(userString);

    const isAuthenticated = !!(token && userData && isTokenValid(token));

    return {
      isAuthenticated,
      user: userData,
      token,
    };
  }, []);

  /**
   * 로그아웃 함수
   */
  const logout = useCallback(() => {
    try {
      // 모든 인증 관련 데이터 제거
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // 인증 캐시 무효화 이벤트 발생
      window.dispatchEvent(new StorageEvent('storage', { 
        key: STORAGE_KEYS.ACCESS_TOKEN, 
        newValue: null 
      }));
      
      // 로그인 페이지로 이동
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // 에러가 발생해도 로그인 페이지로 이동
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  /**
   * 인증 확인 및 리다이렉트
   */
  const checkAuthAndRedirect = useCallback(() => {
    if (!authState.isAuthenticated) {
      logout();
      return false;
    }
    return true;
  }, [authState.isAuthenticated, logout]);

  return {
    ...authState,
    logout,
    checkAuthAndRedirect,
  };
};

/**
 * 인증이 필요한 페이지에서 사용하는 가드 훅
 * @param {Object} options - 옵션
 * @param {boolean} options.redirectOnFail - 인증 실패 시 자동 리다이렉트 여부
 * @returns {Object} 인증 상태
 */
export const useAuthGuard = (options = { redirectOnFail: true }) => {
  const { redirectOnFail } = options;
  const authData = useAuth();
  const { isAuthenticated, checkAuthAndRedirect } = authData;

  useEffect(() => {
    if (redirectOnFail && !isAuthenticated) {
      checkAuthAndRedirect();
    }
  }, [isAuthenticated, checkAuthAndRedirect, redirectOnFail]);

  return authData;
};

/**
 * 사용자 권한 확인 훅
 * @param {string|string[]} requiredRoles - 필요한 권한
 * @returns {Object} 권한 관련 정보
 */
export const usePermission = (requiredRoles = []) => {
  const { user, isAuthenticated } = useAuth();
  
  const hasPermission = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    
    const userRole = user.role;
    if (!userRole) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (roles.length === 0) return true; // 권한 요구사항이 없으면 true
    
    return roles.includes(userRole);
  }, [user, isAuthenticated, requiredRoles]);

  return {
    hasPermission,
    userRole: user?.role,
    isAuthenticated,
  };
};

export default useAuth;
