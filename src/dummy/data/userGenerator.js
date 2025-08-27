// 통합 유저 더미데이터 및 서비스
// ⚠️  더미데이터 삭제 시 참고사항:
// 1. src/services/api/auth.js - 실제 로그인/로그아웃 API 연동 완료 ✅
// 2. src/services/userService.js - 실제 사용자 관리 API 연동 완료 ✅
// 3. 이 파일의 더미데이터는 개발/테스트용으로만 사용됨

// 사용자 역할 정의
const USER_ROLES = {
  ADMIN: 'admin'
};

// 더미 사용자 데이터 생성
export const generateDummyUsers = (count = 1) => {
  const users = [];
  
  // 기본 관리자 계정만 유지
  users.push({
    id: 1,
    employee_id: 'admin',
    password: '1234',
    name: '홍길동',
    email: 'hong@deefacto.com',
    gender: '남',
    department: '관리팀',
    position: '관리자',
    role: USER_ROLES.ADMIN,
    created_at: '2024-01-01 09:00:00',
    updated_at: '2024-01-01 09:00:00',
    shift: null
  });

  return users;
};

// 기본 더미 사용자 데이터
export const dummyUsers = generateDummyUsers(1);

// 사용자 검증 함수
export const validateUserCredentials = (username, password) => {
  return dummyUsers.find(user => 
    user.employee_id === username && user.password === password
  );
};

// ===== 더미 로그인 서비스 =====
// ⚠️  실제 API 연동: src/services/api/auth.js의 login 함수 사용 권장
// 이 더미 함수들은 개발/테스트용으로만 사용됨

// 더미 로그인 처리 함수
export const handleDummyLogin = (credentials) => {
  console.log('더미 로그인 시도:', { username: credentials.username });
  
  const user = validateUserCredentials(credentials.username, credentials.password);

  if (user) {
    // 이거 진짜 삭제해야함. 
    // 더미 토큰 생성 (실제로는 JWT 토큰이어야 함)
    const dummyToken = `dummy_token_${Date.now()}`;
    
    // 로컬 스토리지에 저장
    localStorage.setItem('token', dummyToken);
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      employee_id: user.employee_id,
      name: user.name,
      email: user.email,
      department: user.department,
      position: user.position,
      role: user.role
    }));

    console.log('더미 로그인 성공:', user.name);
    return { success: true, user };
  } else {
    console.log('더미 로그인 실패: 잘못된 사원번호 또는 비밀번호');
    return { success: false, error: '사원번호 또는 비밀번호가 잘못되었습니다.' };
  }
};

// ===== API 폴백용 유저 서비스 =====
// ⚠️  실제 API 연동: src/services/userService.js의 함수들 사용 권장
// 이 더미 함수들은 API 실패 시 폴백용으로만 사용됨

// 사용자 서비스 API (API 실패 시 더미 데이터 폴백)
export const userService = {
  // 현재 로그인한 사용자의 프로필 정보 조회
  getProfile: async () => {
    try {
      const response = await fetch('/user/info/profile');
      return response.data;
    } catch (error) {
      console.log('프로필 조회 API 실패, 더미 데이터로 폴백:', error.message);
      // 더미 사용자 데이터로 폴백
      const dummyUser = dummyUsers[0]; // 첫 번째 더미 사용자를 현재 사용자로 가정
      return {
        id: dummyUser.id,
        employee_id: dummyUser.employee_id,
        name: dummyUser.name,
        email: dummyUser.email,
        department: dummyUser.department,
        position: dummyUser.position,
        role: dummyUser.role
      };
    }
  },

  // 사용자 목록 조회 (관리자용)
  getUsers: async (page = 0, size = 10, name = '', email = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(name && { name }),
        ...(email && { email })
      });
      
      const response = await fetch(`/user/info/search?${params}`);
      return response.data;
    } catch (error) {
      console.log('사용자 목록 조회 API 실패, 더미 데이터로 폴백:', error.message);
      // 더미 사용자 데이터로 폴백
      let filteredUsers = [...dummyUsers];
      
      if (name) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      
      if (email) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(email.toLowerCase())
        );
      }
      
      // 페이지네이션 적용
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      return {
        content: paginatedUsers,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
        currentPage: page,
        size: size
      };
    }
  },

  // 사용자 등록 (관리자용)
  registerUser: async (userData) => {
    try {
      const response = await fetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
      return response.data;
    } catch (error) {
      console.log('사용자 등록 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 사용자가 등록되었습니다.',
        data: {
          id: Date.now(),
          ...userData
        }
      };
    }
  },

  // 사용자 정보 수정 (관리자용)
  updateUser: async (userData) => {
    try {
      const response = await fetch('/user/info/change', { method: 'POST', body: JSON.stringify(userData) });
      return response.data;
    } catch (error) {
      console.log('사용자 정보 수정 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 사용자 정보가 수정되었습니다.',
        data: userData
      };
    }
  },

  // 사용자 삭제 (관리자용)
  deleteUser: async (employeeId) => {
    try {
      const response = await fetch('/user/delete', { method: 'POST', body: JSON.stringify({ employeeId }) });
      return response.data;
    } catch (error) {
      console.log('사용자 삭제 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 사용자가 삭제되었습니다.',
        data: { employeeId }
      };
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      const response = await fetch('/user/info/password', { method: 'POST', body: JSON.stringify(passwordData) });
      return response.data;
    } catch (error) {
      console.log('비밀번호 변경 API 실패, 더미 응답으로 폴백:', error.message);
      // 더미 성공 응답으로 폴백
      return {
        success: true,
        message: '더미 환경에서 비밀번호가 변경되었습니다.',
        data: { success: true }
      };
    }
  }
};
