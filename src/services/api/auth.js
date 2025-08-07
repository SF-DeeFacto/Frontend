import authApiClient from '../index';

// 로그인
export const login = async (credentials) => {
  try {
    console.log('=== 로그인 요청 디버깅 ===');
    console.log('authApiClient:', authApiClient);
    console.log('authApiClient.defaults:', authApiClient?.defaults);
    console.log('baseURL:', authApiClient?.defaults?.baseURL);
    console.log('환경변수 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('모든 환경변수:', import.meta.env);
    
    // 백엔드 서버 연결 확인
    const testUrl = authApiClient.defaults.baseURL + '/health';
    console.log('서버 연결 테스트 URL:', testUrl);
    
    console.log('로그인 요청 시작');
    console.log('요청 URL:', authApiClient.defaults.baseURL + '/auth/login');
    console.log('요청 데이터:', {
      employeeId: credentials.username,
      password: credentials.password
    });
    
    const response = await authApiClient.post('/auth/login', {
      employeeId: credentials.username,
      password: credentials.password
    });

    console.log('로그인 응답:', response.data);

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
      
      console.log('사용자 정보 응답:', userInfoResponse.data);
      console.log('사용자 정보:', userInfo);
      
      // 사용자 정보를 localStorage에 저장
      localStorage.setItem('user', JSON.stringify({
        employeeId: userInfo.employeeId,
        name: userInfo.name,
        email: userInfo.email,
        department: userInfo.department,
        position: userInfo.position,
        role: userInfo.role
      }));
      
      console.log('저장된 사용자 정보:', JSON.parse(localStorage.getItem('user')));
    } catch (userInfoError) {
      console.error('사용자 정보 가져오기 실패:', userInfoError);
      // 사용자 정보 가져오기 실패 시 기본 정보만 저장
      localStorage.setItem('user', JSON.stringify({ employeeId }));
    }

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
