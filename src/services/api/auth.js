// 통합 인증 서비스 - 공통 API 클라이언트 사용

import api from './client';
import { userApi } from './user';

// API Gateway를 통한 로그인 처리
const handleApiGatewayLogin = async (credentials) => {
  try {
    console.log('API Gateway 로그인 시도 시작');
    console.log('사용자 정보:', { employeeId: credentials.username });

    // 로그인 요청 데이터 준비
    const loginData = {
      employeeId: credentials.username,
      password: credentials.password
    };

    console.log('로그인 요청 데이터:', loginData);
    console.log('로그인 요청 URL:', `/auth/login`);

    // 로그인 요청 - 공통 API 클라이언트 사용
    const response = await api.post('/auth/login', loginData);

    console.log('API Gateway 로그인 응답 성공:', response.status);
    console.log('응답 데이터:', response.data);

    // API Gateway 응답 구조에 맞게 처리
    const { data } = response.data;

    if (!data || !data.access || !data.access.token) {
      console.error('응답 데이터 구조가 올바르지 않습니다:', response.data);
      throw new Error('응답 데이터 구조가 올바르지 않습니다.');
    }

    const accessToken = data.access.token;
    const refreshToken = data.refresh?.token || '';
    const employeeId = credentials.username;

    console.log('토큰 추출 완료:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      employeeId
    });

    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('employeeId', employeeId);

    console.log('토큰 저장 완료');

    // 사용자 상세 정보 가져오기 - userApi 사용
    try {
      console.log('사용자 상세 정보 조회 시작');
      const userResult = await userApi.getUserProfile();

      if (userResult.success) {
        const userInfo = userResult.data;
        console.log('사용자 정보 조회 성공:', userInfo);

        localStorage.setItem('user', JSON.stringify({
          employeeId: userInfo.employeeId || employeeId,
          name: userInfo.name || employeeId,
          email: userInfo.email || '',
          department: userInfo.department || '',
          position: userInfo.position || '',
          role: userInfo.role || 'USER'
        }));

        console.log('사용자 정보 저장 완료');
      } else {
        console.error('사용자 정보 조회 실패:', userResult.error);
        localStorage.setItem('user', JSON.stringify({ 
          employeeId,
          name: employeeId,
          role: 'USER'
        }));
        console.log('기본 사용자 정보만 저장');
      }
    } catch (userInfoError) {
      console.error('사용자 정보 조회 중 오류:', userInfoError);
      localStorage.setItem('user', JSON.stringify({ 
        employeeId,
        name: employeeId,
        role: 'USER'
      }));
      console.log('오류 발생으로 기본 사용자 정보만 저장');
    }

    console.log('로그인 처리 완료');
    return { success: true, employeeId, isDummy: false };

  } catch (error) {
    console.error('API Gateway 로그인 실패 상세:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        error: 'API Gateway에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
      };
    }

    if (error.response?.status === 401) {
      return {
        success: false,
        error: '사원번호 또는 비밀번호가 올바르지 않습니다.'
      };
    }

    if (error.response?.status === 404) {
      return {
        success: false,
        error: '로그인 엔드포인트를 찾을 수 없습니다. API Gateway 설정을 확인해주세요.'
      };
    }

    return {
      success: false,
      error: error.response?.data?.message || '로그인에 실패했습니다.'
    };
  }
};

// 통합 로그인 함수 - 공통 API 클라이언트 사용
export const integratedLogin = async (credentials) => {
  try {
    console.log('통합 로그인 시작');

    // 공통 API 클라이언트를 통한 로그인 시도
    const loginResult = await handleApiGatewayLogin(credentials);
    console.log('로그인 결과:', loginResult);

    return loginResult;

  } catch (error) {
    console.error('통합 로그인 처리 중 오류:', error);
    return {
      success: false,
      error: '로그인 처리 중 오류가 발생했습니다.'
    };
  }
};

// API Gateway를 통한 로그아웃 함수
export const integratedLogout = async () => {
  try {
    // 공통 API 클라이언트를 통한 로그아웃 시도
    try {
      await api.post('/auth/logout');
      console.log('API Gateway 로그아웃 성공');
    } catch (error) {
      console.log('API Gateway 로그아웃 실패, 로컬 정리만 진행');
    }
  } catch (error) {
    console.log('API Gateway 연결 실패, 로컬 정리만 진행');
  } finally {
    // 로컬 스토리지 정리
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    console.log('로컬 스토리지 정리 완료');
    return { success: true };
  }
};

// 로그아웃 함수 (별칭으로 export)
export const logout = integratedLogout;

// 사용자 정보 확인
export const getCurrentUser = () => {
  const employeeId = localStorage.getItem('employeeId');
  const user = localStorage.getItem('user');

  if (employeeId && user) {
    try {
      return { employeeId, ...JSON.parse(user) };
    } catch (error) {
      return { employeeId };
    }
  }

  return null;
};

// 토큰 유효성 확인
export const validateToken = () => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      const userData = JSON.parse(user);
      return { valid: true, user: userData };
    } catch (error) {
      return { valid: false };
    }
  }

  return { valid: false };
};
