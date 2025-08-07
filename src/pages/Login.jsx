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

  const styles = {
    loginContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
    loginForm: {
      background: 'white',
      padding: '48px 40px',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      width: '350px',
      maxWidth: '90vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch'
    },
    formGroup: {
      marginBottom: '18px'
    },
    letter: {
      color: '#000000',
      fontWeight: 'bold',
      marginBottom: '6px',
      display: 'block',
      textAlign: 'left'
    },
    formInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '16px',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      color: '#333'
    },
    errorMessage: {
      color: 'red',
      fontSize: '13px',
      marginBottom: '12px',
      textAlign: 'center'
    },
    signIn: {
      color: '#888',
      textAlign: 'left',
      marginBottom: '18px',
      fontSize: '15px'
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px', marginRight: '12px' }}>🧊</span>
            <Text variant="title" size="28px" weight="bold" color="black">
              DeeFacto
            </Text>
          </div>
          <div style={styles.formGroup}>
            <Text variant="body" size="sm" weight="bold" color="black" style={styles.letter}>
              사원번호
            </Text>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
              placeholder="사원번호를 입력하세요"
              style={styles.formInput}
              autoComplete="username"
              onFocus={(e) => {
                e.target.style.borderColor = '#000000';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ccc';
              }}
            />
          </div>
          <div style={styles.formGroup}>
            <Text variant="body" size="sm" weight="bold" color="black" style={styles.letter}>
              비밀번호
            </Text>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="비밀번호를 입력하세요"
                style={{...styles.formInput, paddingRight: '48px'}}
                autoComplete="current-password"
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ccc';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
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
          <Text variant="body" size="xs" color="gray-600" style={styles.signIn}>
            로그인에 문제가 있는 경우 관리자에게 문의하십시오
          </Text>
          {error && (
            <Text variant="body" size="xs" color="red" style={styles.errorMessage}>
              {error}
            </Text>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            style={{
              marginTop: '8px',
              fontSize: '18px'
            }}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
          
                     
        </form>
      </div>
      <div style={{ textAlign: 'center', color: '#bbb', fontSize: '13px', marginBottom: '16px' }}>
        © 2024 DeeFacto. All rights reserved.
      </div>
    </div>
  );
};

export default Login; 