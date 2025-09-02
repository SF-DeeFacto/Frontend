import authApiClient from '../index';

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
      console.log('⏰ 요청 시작 시간:', new Date().toLocaleTimeString());
    }
    
    const response = await authApiClient.post('/auth/login', {
      employeeId: credentials.username,
      password: credentials.password
    });

    if (isDev) {
      console.log('✅ 로그인 성공:', response.data.message);
      console.log('⏱️ 응답까지 소요 시간:', new Date().toLocaleTimeString());
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
        console.log('사용자 정보 조회 성공:', userInfo.name);
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
        console.log('사용자 정보 저장 완료');
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
    console.error('=== 로그인 에러 상세 정보 ===');
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });
    
    // 서버 연결 실패 시 더 자세한 정보 제공
    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        error: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || '로그인에 실패했습니다.'
    };
  }
};

// 로그아웃
export const logout = async () => {
  try {
    console.log('로그아웃 요청 시작');
    const response = await authApiClient.post('/auth/logout');
    console.log('로그아웃 응답:', response.data);
  } catch (error) {
    console.error('Logout failed:', error);
    console.error('Logout error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
  } finally {
    // 로컬 스토리지에서 모든 사용자 관련 데이터 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // 인증 캐시 무효화 (로그아웃) - localStorage 이벤트 트리거
    window.dispatchEvent(new StorageEvent('storage', { key: 'access_token', newValue: null }));
    
    console.log('로컬 스토리지 정리 완료');
    return { success: true };
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
    console.error('Failed to get user info:', error);
    return null;
  }
};
