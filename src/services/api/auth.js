import authApiClient from '../index';
import { handleApiError } from '../../utils/unifiedErrorHandler';
import axios from 'axios';

// 로그인
export const login = async (credentials) => {
  try {
    // 로그인 요청 전에 기존 토큰 정리 (인터셉터에서 자동 추가되는 것을 방지)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('user');
    
    // Content-Type 헤더가 제대로 설정되었는지 확인 및 수정
    if (!authApiClient.defaults.headers.common['Content-Type']) {
      authApiClient.defaults.headers.common['Content-Type'] = 'application/json';
    }
    
    // 개발 환경에서만 로그 출력
    const isDev = import.meta.env.DEV;
    if (isDev) {
      console.log('🚀 로그인 요청 시작:', credentials.username);
    }
    
    const response = await authApiClient.post('/auth/login', {
      employeeId: credentials.username,
      password: credentials.password
    });

    if (isDev) {
      console.log('✅ 로그인 성공:', response.data.message);
    }

    // 백엔드 응답 구조에 맞게 수정
    const { data } = response.data;
    const accessToken = data.access.token;
    const refreshToken = data.refresh.token;
    
    // 사용자 정보는 별도 API로 조회하거나, 로그인 시 employeeId만 저장
    const employeeId = credentials.username;
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('employeeId', employeeId);
    
    // 사용자 상세 정보 가져오기
    try {
      const userInfoResponse = await authApiClient.get('/user/info/profile', {
        headers: {
          'X-Employee-Id': employeeId,
          'X-Role': 'USER' // 기본값으로 USER 사용
        }
      });
      const userInfo = userInfoResponse.data.data; // ApiResponseDto 구조에 맞게 수정
      
      if (isDev) {
        // console.log('사용자 정보 조회 성공:', userInfo.name);
      }
      
      // 사용자 정보를 localStorage에 저장 (백엔드에서 제공하는 모든 필드 포함)
      localStorage.setItem('user', JSON.stringify({
        employeeId: userInfo.employeeId,
        name: userInfo.name,
        email: userInfo.email,
        department: userInfo.department,
        position: userInfo.position,
        role: userInfo.role,
        gender: userInfo.gender,
        scope: userInfo.scope,
        shift: userInfo.shift,
        active: userInfo.active,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt
      }));
      
      if (isDev) {
        // console.log('사용자 정보 저장 완료');
      }
    } catch (userInfoError) {
      console.error('사용자 정보 가져오기 실패:', userInfoError);
      // 사용자 정보 가져오기 실패 시 기본 정보만 저장
      localStorage.setItem('user', JSON.stringify({ employeeId }));
    }

    // 인증 캐시 무효화 (새로운 로그인) - localStorage 이벤트 트리거
    window.dispatchEvent(new StorageEvent('storage', { key: 'user', newValue: localStorage.getItem('user') }));

    return { success: true, employeeId };
  } catch (error) {
    const errorInfo = handleApiError(error, '로그인');
    
    // 서버 연결 실패 시 더 자세한 정보 제공
    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        error: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
      };
    }
    
    return {
      success: false,
      error: errorInfo.userMessage
    };
  }
};

// 로그아웃
export const logout = async () => {
  try {
    // console.log('로그아웃 요청 시작');
    const response = await authApiClient.post('/auth/logout');
    // console.log('로그아웃 응답:', response.data);
  } catch (error) {
    // console.error('Logout failed:', error);
    // console.error('Logout error details:', {
    //   message: error.message,
    //   code: error.code,
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data
    // });
  } finally {
    // 로컬 스토리지에서 모든 사용자 관련 데이터 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // 인증 캐시 무효화 (로그아웃) - localStorage 이벤트 트리거
    window.dispatchEvent(new StorageEvent('storage', { key: 'access_token', newValue: null }));
    
    // console.log('로컬 스토리지 정리 완료');
    return { success: true };
  }
};

// JWT 토큰 디코딩 (페이로드만)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

// 토큰 만료 시간 확인
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// 토큰 만료까지 남은 시간 (초)
export const getTokenTimeLeft = (token) => {
  if (!token) return 0;
  
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

// 토큰 갱신
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    // 리프레시 API 호출 시에는 별도의 axios 인스턴스 사용 (인터셉터 없이)
    const response = await axios.post('/api/auth/refresh', refreshToken, {
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    const { access } = response.data;
    const newAccessToken = access.token;
    const expiresIn = access.expiresIn;

    // 새로운 액세스 토큰 저장
    localStorage.setItem('access_token', newAccessToken);

    // 개발 환경에서만 로그 출력
    const isDev = import.meta.env.DEV;
    if (isDev) {
      console.log('✅ 토큰 갱신 성공:', { expiresIn });
    }

    return {
      success: true,
      accessToken: newAccessToken,
      expiresIn: expiresIn
    };
  } catch (error) {
    const errorInfo = handleApiError(error, '토큰 갱신');
    
    // 개발 환경에서만 로그 출력
    const isDev = import.meta.env.DEV;
    if (isDev) {
      console.error('❌ 토큰 갱신 실패:', errorInfo.message);
    }
    
    return {
      success: false,
      error: errorInfo.userMessage
    };
  }
};

// 토큰 자동 갱신 (만료 5분 전에 갱신)
export const autoRefreshToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshTokenValue = localStorage.getItem('refresh_token');
  
  if (!accessToken || !refreshTokenValue) {
    return { success: false, error: '토큰이 없습니다.' };
  }

  // 토큰이 이미 만료된 경우
  if (isTokenExpired(accessToken)) {
    console.log('🔐 토큰이 만료되었습니다. 갱신을 시도합니다.');
    return await refreshToken();
  }

  // 토큰 만료까지 5분 이하인 경우 갱신
  const timeLeft = getTokenTimeLeft(accessToken);
  if (timeLeft <= 300) { // 5분 = 300초
    console.log(`🔐 토큰이 곧 만료됩니다 (${Math.floor(timeLeft / 60)}분 남음). 갱신을 시도합니다.`);
    return await refreshToken();
  }

  return { success: true, message: '토큰이 아직 유효합니다.' };
};

// 토큰 갱신 실패 시 로그아웃 처리
export const handleTokenRefreshFailure = () => {
  console.error('🔐 토큰 갱신에 실패했습니다. 로그아웃 처리합니다.');
  
  // 모든 인증 관련 데이터 삭제
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('employeeId');
  localStorage.removeItem('user');
  localStorage.removeItem('unread_alarm_count');
  
  // 로그아웃 이벤트 발생
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'access_token',
    newValue: null
  }));
  
  // 로그인 페이지로 리다이렉트
  window.location.href = '/login';
};

// 토큰 상태 확인 및 갱신 (에러 처리 포함)
export const checkAndRefreshToken = async () => {
  try {
    const result = await autoRefreshToken();
    
    if (!result.success) {
      console.error('토큰 갱신 실패:', result.error);
      
      // 리프레시 토큰이 만료되었거나 유효하지 않은 경우
      if (result.error.includes('리프레시') || result.error.includes('만료')) {
        handleTokenRefreshFailure();
        return { success: false, shouldLogout: true };
      }
      
      return { success: false, shouldLogout: false };
    }
    
    return { success: true, shouldLogout: false };
  } catch (error) {
    console.error('토큰 확인 중 오류 발생:', error);
    return { success: false, shouldLogout: false };
  }
};

// 사용자 정보 확인
export const getCurrentUser = () => {
  const employeeId = localStorage.getItem('employeeId');
  return employeeId ? { employeeId } : null;
};

// 사용자 상세 정보 조회 (필요시 별도 API 호출)
export const getUserInfo = async () => {
  try {
    const response = await authApiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    const errorInfo = handleApiError(error, '사용자 정보 조회');
    console.error('사용자 정보 조회 실패:', errorInfo.message);
    return null;
  }
};

// ===== 권한 관련 유틸리티 함수들 =====

/**
 * 현재 로그인한 사용자의 상세 정보를 가져옵니다.
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getCurrentUserDetail = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('사용자 정보 파싱 오류:', error);
    return null;
  }
};

/**
 * 현재 사용자의 권한을 확인합니다.
 * @returns {string|null} 사용자 권한 (ROOT, ADMIN, USER 등) 또는 null
 */
export const getCurrentUserRole = () => {
  const user = getCurrentUserDetail();
  return user?.role || null;
};

/**
 * 사용자가 특정 권한을 가지고 있는지 확인합니다.
 * @param {string|string[]} requiredRoles - 필요한 권한 (문자열 또는 배열)
 * @returns {boolean} 권한 보유 여부
 */
export const hasRole = (requiredRoles) => {
  const userRole = getCurrentUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  return userRole === requiredRoles;
};

/**
 * ROOT 권한을 가지고 있는지 확인합니다.
 * @returns {boolean} ROOT 권한 보유 여부
 */
export const isRoot = () => {
  return hasRole('ROOT');
};

/**
 * ADMIN 권한을 가지고 있는지 확인합니다.
 * @returns {boolean} ADMIN 권한 보유 여부
 */
export const isAdmin = () => {
  return hasRole('ADMIN');
};

/**
 * ROOT 또는 ADMIN 권한을 가지고 있는지 확인합니다.
 * @returns {boolean} ROOT 또는 ADMIN 권한 보유 여부
 */
export const isRootOrAdmin = () => {
  return hasRole(['ROOT', 'ADMIN']);
};

/**
 * 사용자가 로그인되어 있는지 확인합니다.
 * @returns {boolean} 로그인 상태
 */
export const isAuthenticated = () => {
  const user = getCurrentUserDetail();
  const token = localStorage.getItem('access_token');
  return !!(user && token);
};
