// 통합 인증 서비스 - API Gateway만 사용

import axios from 'axios';
import { getAvailableBackendConfig } from '../../config/backendConfig';
import { userApi } from './user';

// API Gateway 클라이언트 생성 (Vite 프록시 사용)
const createApiGatewayClient = (apiGatewayConfig) => {
  return axios.create({
    baseURL: apiGatewayConfig.baseURL, // /api 사용 (Vite 프록시)
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
};

// API Gateway를 통한 로그인 처리
const handleApiGatewayLogin = async (credentials, apiGatewayConfig) => {
  try {
    console.log('API Gateway 로그인 시도:', apiGatewayConfig.baseURL);
    
    // API Gateway 클라이언트 생성 (프록시 사용)
    const apiClient = createApiGatewayClient(apiGatewayConfig);
    
    // 로그인 요청 - Vite 프록시를 통한 호출
    const response = await apiClient.post('/auth/login', {
      employeeId: credentials.username,
      password: credentials.password
    });

    console.log('API Gateway 로그인 응답:', response.data);

    // API Gateway 응답 구조에 맞게 처리
    const { data } = response.data;
    const accessToken = data.access.token;
    const refreshToken = data.refresh.token;
    const employeeId = credentials.username;
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('employeeId', employeeId);
    
    // 사용자 상세 정보 가져오기 - userApi 사용
    try {
      const userResult = await userApi.getUserProfile();
      if (userResult.success) {
        const userInfo = userResult.data;
        localStorage.setItem('user', JSON.stringify({
          employeeId: userInfo.employeeId,
          name: userInfo.name,
          email: userInfo.email,
          department: userInfo.department,
          position: userInfo.position,
          role: userInfo.role
        }));
      } else {
        console.error('사용자 정보 가져오기 실패:', userResult.error);
        localStorage.setItem('user', JSON.stringify({ employeeId }));
      }
    } catch (userInfoError) {
      console.error('사용자 정보 가져오기 실패:', userInfoError);
      localStorage.setItem('user', JSON.stringify({ employeeId }));
    }

    return { success: true, employeeId, isDummy: false };
    
  } catch (error) {
    console.error('API Gateway 로그인 실패:', error);
    
    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        error: 'API Gateway에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || '로그인에 실패했습니다.'
    };
  }
};

// 통합 로그인 함수 - API Gateway만 사용
export const integratedLogin = async (credentials) => {
  try {
    // API Gateway 서버 상태 확인
    const apiGatewayConfig = await getAvailableBackendConfig();
    
    if (!apiGatewayConfig) {
      return { 
        success: false, 
        error: 'API Gateway에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.' 
      };
    }
    
    // API Gateway를 통한 로그인 시도
    const loginResult = await handleApiGatewayLogin(credentials, apiGatewayConfig);
    return loginResult;
    
  } catch (error) {
    console.error('API Gateway 로그인 에러:', error);
    return { 
      success: false, 
      error: '로그인 처리 중 오류가 발생했습니다.' 
    };
  }
};

// API Gateway를 통한 로그아웃 함수
export const integratedLogout = async () => {
  try {
    // API Gateway를 통한 로그아웃 시도
    const apiGatewayConfig = await getAvailableBackendConfig();
    if (apiGatewayConfig) {
      try {
        const apiClient = createApiGatewayClient(apiGatewayConfig);
        await apiClient.post('/auth/logout');
        console.log('API Gateway 로그아웃 성공');
      } catch (error) {
        console.log('API Gateway 로그아웃 실패, 로컬 정리만 진행');
      }
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
