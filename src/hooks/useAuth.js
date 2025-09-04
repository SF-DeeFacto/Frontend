import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 인증 상태 관리 커스텀 훅
 * 
 * @param {Object} options - 옵션 객체
 * @param {boolean} options.redirectOnFail - 인증 실패 시 로그인 페이지로 리다이렉트 여부 (기본값: true)
 * @param {string} options.redirectPath - 리다이렉트할 경로 (기본값: '/login')
 * @returns {Object} 인증 상태 및 사용자 정보
 */
export const useAuth = (options = {}) => {
  const {
    redirectOnFail = true,
    redirectPath = '/login'
  } = options;

  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');

        // 토큰이나 사용자 데이터가 없는 경우
        if (!token || !userData) {
          if (redirectOnFail) {
            navigate(redirectPath);
          }
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null
          });
          return;
        }

        // 사용자 데이터 파싱 시도
        let user;
        try {
          user = JSON.parse(userData);
        } catch (parseError) {
          console.error('사용자 데이터 파싱 오류:', parseError);
          if (redirectOnFail) {
            navigate(redirectPath);
          }
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null
          });
          return;
        }

        // 필수 사용자 정보 검증
        if (!user.name || !user.employeeId) {
          console.log('사용자 정보가 불완전합니다.');
          if (redirectOnFail) {
            navigate(redirectPath);
          }
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null
          });
          return;
        }

        // 인증 성공
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          token
        });

      } catch (error) {
        console.error('인증 체크 중 오류 발생:', error);
        if (redirectOnFail) {
          navigate(redirectPath);
        }
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          token: null
        });
      }
    };

    checkAuth();

    // localStorage 변화 감지 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, redirectOnFail, redirectPath]);

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('user');
    localStorage.removeItem('unread_alarm_count');
    
    // 로그아웃 이벤트 발생
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      newValue: null,
      oldValue: authState.token
    }));

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null
    });

    if (redirectOnFail) {
      navigate(redirectPath);
    }
  };

  /**
   * 사용자 정보 업데이트
   */
  const updateUser = (newUserData) => {
    try {
      const updatedUser = { ...authState.user, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
    }
  };

  return {
    ...authState,
    logout,
    updateUser,
    // 편의 메서드들
    hasRole: (role) => authState.user?.role === role,
    hasScope: (scope) => authState.user?.scope?.includes(scope),
    isAdmin: () => authState.user?.role === 'ADMIN',
    isUser: () => authState.user?.role === 'USER'
  };
};

export default useAuth;
