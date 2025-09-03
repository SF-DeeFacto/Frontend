import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Text from '@components/common/Text';
import { login } from '@services/api/auth';
import { dummyUsers } from '@/dummy/dummyUser';
import styles from './Login.module.css';

/**
 * 로고 인트로 컴포넌트
 */
const LogoIntro = memo(({ isVisible, onLogoClick }) => (
  <div 
    className={`${styles.logoIntroSection} ${isVisible ? styles.visible : styles.hidden}`}
    onClick={onLogoClick}
  >
    <img 
      src="/logo2.png" 
      alt="DeeFacto" 
      className={styles.logoIntro}
    />
    
    {/* 단어 합성 애니메이션 */}
    <div className={styles.wordAnimation}>
      <span className={styles.wordPart}>De facto</span>
      <span className={styles.plusSign}>+</span>
      <span className={styles.wordPart2}>Factory</span>
      <span className={styles.equalsSign}>=</span>
      <span className={styles.finalWord}>DeeFacto</span>
    </div>
    
    <div className={styles.meaningText}>
      "사실상 표준" + "공장"<br/>
      표준을 위한 공장 모니터링 서비스
    </div>
  </div>
));

LogoIntro.displayName = 'LogoIntro';
LogoIntro.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onLogoClick: PropTypes.func.isRequired,
};

/**
 * 로그인 폼 컴포넌트
 */
const LoginForm = memo(({ 
  isVisible, 
  credentials, 
  showPassword, 
  isLoading, 
  error,
  onInputChange,
  onPasswordToggle,
  onSubmit 
}) => (
  <form 
    onSubmit={onSubmit} 
    className={`${styles.loginForm} ${isVisible ? styles.visible : styles.hidden}`}
  >
    {/* 로고 섹션 */}
    <div className={styles.logoSection}>
      <img 
        src="/logo.png" 
        alt="DeeFacto" 
        className={styles.logoIcon}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
      />
      <div 
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '16px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}
      >
        <span style={{ fontSize: '48px' }}>🧊</span>
        <Text variant="title" size="32px" weight="bold" className={styles.logoText}>
          DeeFacto
        </Text>
      </div>
    </div>
    
    {/* 사원번호 입력 */}
    <div className={styles.formGroup}>
      <label className={styles.label}>사원번호</label>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={credentials.username}
          onChange={(e) => onInputChange('username', e.target.value)}
          required
          placeholder="사원번호를 입력하세요"
          className={styles.formInput}
          autoComplete="username"
        />
      </div>
    </div>
    
    {/* 비밀번호 입력 */}
    <div className={styles.formGroup}>
      <label className={styles.label}>비밀번호</label>
      <div className={styles.inputContainer}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={credentials.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
          className={`${styles.formInput} ${styles.passwordInput}`}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={onPasswordToggle}
          className={styles.passwordToggle}
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="9" ry="6" />
              <circle cx="12" cy="12" r="2.5" />
              <line x1="3" y1="21" x2="21" y2="3" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="9" ry="6" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
    
    {/* 도움말 텍스트 */}
    <Text variant="body" size="xs" color="gray-600" className={styles.helpText}>
      로그인에 문제가 있는 경우 관리자에게 문의하십시오
    </Text>
    
    {/* 에러 메시지 */}
    {error && (
      <div className={styles.errorMessage}>
        {error}
      </div>
    )}
    
    {/* 로그인 버튼 */}
    <button
      type="submit"
      disabled={isLoading}
      className={styles.submitButton}
    >
      {isLoading ? '로그인 중...' : '로그인'}
    </button>
  </form>
));

LoginForm.displayName = 'LoginForm';
LoginForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  credentials: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  showPassword: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onInputChange: PropTypes.func.isRequired,
  onPasswordToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

/**
 * 메인 로그인 컴포넌트
 */
const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLogoClick = () => {
    setShowLoginForm(true);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 더미 로그인 처리
    const dummyUser = dummyUsers.find(user => 
      user.employee_id === credentials.username && 
      user.password === credentials.password
    );
    
    if (dummyUser) {
      const dummyToken = 'dummy_token_' + Date.now();
      const dummyRefreshToken = 'dummy_refresh_token_' + Date.now();
      
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

    // 실제 백엔드 로그인
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
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backgroundPattern} />
      
      <LogoIntro 
        isVisible={!showLoginForm}
        onLogoClick={handleLogoClick}
      />
      
      <LoginForm
        isVisible={showLoginForm}
        credentials={credentials}
        showPassword={showPassword}
        isLoading={isLoading}
        error={error}
        onInputChange={handleInputChange}
        onPasswordToggle={handlePasswordToggle}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;