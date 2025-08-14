import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import { login } from '../services/api/auth';
// ===== 개발용 더미 로그인 기능 시작 =====
import { dummyUsers } from '../dummy/data/users';
// ===== 개발용 더미 로그인 기능 끝 =====

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // ===== 개발용 더미 로그인 기능 시작 =====
    // 먼저 더미 데이터에서 사용자 찾기
    const dummyUser = dummyUsers.find(user => 
      user.employee_id === credentials.username && 
      user.password === credentials.password
    );
    
    if (dummyUser) {
      // 더미 토큰 생성
      const dummyToken = 'dummy_token_' + Date.now();
      const dummyRefreshToken = 'dummy_refresh_token_' + Date.now();
      
      // localStorage에 더미 데이터 저장
      localStorage.setItem('access_token', dummyToken);
      localStorage.setItem('refresh_token', dummyRefreshToken);
      localStorage.setItem('employeeId', dummyUser.employee_id);
      localStorage.setItem('user', JSON.stringify({
        employeeId: dummyUser.employee_id,
        name: dummyUser.name,
        email: dummyUser.email,
        department: dummyUser.department,
        position: dummyUser.position,
        role: dummyUser.role
      }));
      
      console.log('더미 데이터로 로그인 성공:', dummyUser);
      navigate('/home');
      setIsLoading(false);
      return;
    }
    // ===== 개발용 더미 로그인 기능 끝 =====

    // 실제 백엔드 로그인 기능 시작
    try {
      const result = await login(credentials);
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log('백엔드 연동 실패');
      setError('사원번호 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
    // ===== 실제 백엔드 로그인 기능 끝 =====
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white">
      <div className="flex-1 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-xl shadow-lg w-[350px] max-w-[90vw] flex flex-col">
          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl mr-3">🧊</span>
            <Text variant="title" size="28px" weight="bold" color="black">
              DeeFacto
            </Text>
          </div>
          <div className="mb-4">
            <Text variant="body" size="sm" weight="bold" color="black" className="text-black font-bold mb-1.5 block text-left">
              사원번호
            </Text>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
              placeholder="사원번호를 입력하세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base box-border bg-white text-gray-800 focus:border-black focus:outline-none transition-colors"
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <Text variant="body" size="sm" weight="bold" color="black" className="text-black font-bold mb-1.5 block text-left">
              비밀번호
            </Text>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full px-3 pr-12 py-3 border border-gray-300 rounded-md text-base box-border bg-white text-gray-800 focus:border-black focus:outline-none transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer p-0"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="12" rx="9" ry="6" />
                    <circle cx="12" cy="12" r="2.5" />
                    <line x1="3" y1="21" x2="21" y2="3" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="12" rx="9" ry="6" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Text variant="body" size="xs" color="gray-600" className="text-gray-500 text-left mb-4 text-sm">
            로그인에 문제가 있는 경우 관리자에게 문의하십시오
          </Text>
          {error && (
            <Text variant="body" size="xs" color="red" className="text-red-500 text-sm mb-3 text-center">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-2 text-lg"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
      <div className="text-center text-gray-400 text-sm mb-4">
        © 2025 DeeFacto. All rights reserved.
      </div>
    </div>
  );
};

export default Login; 