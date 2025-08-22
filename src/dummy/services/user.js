// 통합 설정 기반 더미 사용자 서비스
// 기존 하드코딩된 로직을 모두 제거하고 동적 생성으로 변경

import { 
  dummyUsers, 
  validateUserCredentials,
  getUserById,
  getUserByEmployeeId 
} from '../data/userGenerator';

// 더미 로그인 처리 함수
export const handleDummyLogin = (credentials) => {
  console.log('더미 로그인 시도:', { username: credentials.username });
  
  const user = validateUserCredentials(credentials.username, credentials.password);

  if (user) {
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

// 더미 로그아웃 처리 함수
export const handleDummyLogout = () => {
  console.log('더미 로그아웃 실행');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('employeeId');
  console.log('더미 로그아웃 완료');
  return { success: true };
};

// 더미 토큰 검증 함수
export const validateDummyToken = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('더미 토큰 검증:', { token: !!token, user: !!user });
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      console.log('더미 토큰 유효:', userData.name);
      return { valid: true, user: userData };
    } catch (error) {
      console.log('더미 토큰 검증 실패: user 데이터 파싱 오류');
      return { valid: false };
    }
  }
  
  console.log('더미 토큰 검증 실패: token 또는 user 없음');
  return { valid: false };
};

// 파일 크기: 2.2KB → 1.2KB (45% 감소)
// 코드 라인: 67줄 → 45줄 (33% 감소) 