import { dummyUsers } from '../data/users.js';

// 더미 로그인 처리 함수
export const handleDummyLogin = (credentials) => {
  const user = dummyUsers.find(
    (user) => user.employee_id === credentials.username && user.password === credentials.password
  );

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
    return { success: false, error: '사원번호 또는 비밀번호가 잘못되었습니다.' };
  }
};

// 더미 로그아웃 처리 함수
export const handleDummyLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('더미 로그아웃 완료');
  return { success: true };
};

// 더미 토큰 검증 함수
export const validateDummyToken = () => {
  const token = localStorage.getItem('token');
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