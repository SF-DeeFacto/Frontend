import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import { login } from '../services/api/auth';
// ===== 개발용 더미 로그인 기능 시작 =====
import { dummyUsers } from '../dummy/dummyUser';
// ===== 개발용 더미 로그인 기능 끝 =====

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
      background: '#fafafa',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      opacity: 0.3,
      pointerEvents: 'none'
    },
    logoIntroSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      opacity: showLoginForm ? 0 : 1,
      transform: showLoginForm ? 'scale(0.8) translateY(-20px)' : 'scale(1) translateY(0)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: showLoginForm ? 'none' : 'auto',
      cursor: 'pointer'
    },
    logoIntro: {
      fontSize: '80px',
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      animation: 'bounce 2s ease-in-out infinite'
    },
    logoTextIntro: {
      color: '#1f2937',
      fontSize: '36px',
      fontWeight: '300',
      letterSpacing: '0.1em',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    wordAnimation: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    wordPart: {
      fontSize: '24px',
      fontWeight: '400',
      color: '#6b7280',
      transition: 'all 0.8s ease',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'slideInUp 0.8s ease forwards'
    },
    wordPart2: {
      fontSize: '24px',
      fontWeight: '400',
      color: '#6b7280',
      transition: 'all 0.8s ease',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'slideInUp 0.8s ease 0.3s forwards'
    },
    plusSign: {
      fontSize: '20px',
      color: '#9ca3af',
      margin: '0 12px',
      opacity: 0,
      animation: 'fadeIn 0.6s ease 0.6s forwards'
    },
    equalsSign: {
      fontSize: '20px',
      color: '#9ca3af',
      margin: '0 12px',
      opacity: 0,
      animation: 'fadeIn 0.6s ease 1.2s forwards'
    },
    finalWord: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#1f2937',
      opacity: 0,
      animation: 'fadeInScale 1s ease 1.5s forwards'
    },
    meaningText: {
      color: '#6b7280',
      fontSize: '16px',
      textAlign: 'center',
      maxWidth: '300px',
      lineHeight: '1.6',
      opacity: 0,
      animation: 'fadeInUp 1s ease 2s forwards'
    },
    clickHint: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '18px',
      fontWeight: '500',
      textAlign: 'center',
      opacity: 0.8,
      animation: 'pulse 2s ease-in-out infinite'
    },
    loginForm: {
      background: '#ffffff',
      padding: '40px 40px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      width: '400px',
      maxWidth: '90vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      border: '1px solid #e5e7eb',
      position: 'relative',
      zIndex: 1,
      opacity: showLoginForm ? 1 : 0,
      transform: showLoginForm ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(30px)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: showLoginForm ? 'auto' : 'none'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '40px',
      flexDirection: 'column',
      gap: '16px'
    },
    logoIcon: {
      fontSize: '48px',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
    },
    logoText: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
    },
    formGroup: {
      marginBottom: '24px',
      position: 'relative'
    },
    label: {
      color: '#374151',
      fontWeight: '500',
      marginBottom: '6px',
      display: 'block',
      textAlign: 'left',
      fontSize: '13px',
      letterSpacing: '0.025em',
      textTransform: 'uppercase'
    },
    inputContainer: {
      position: 'relative',
      transition: 'all 0.3s ease'
    },
    formInput: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      color: '#374151',
      transition: 'all 0.15s ease',
      outline: 'none'
    },
    formInputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '6px',
      transition: 'all 0.15s ease',
      color: '#9ca3af'
    },
    passwordToggleHover: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280'
    },
    errorMessage: {
      color: '#dc2626',
      fontSize: '13px',
      marginBottom: '16px',
      textAlign: 'center',
      padding: '10px 12px',
      backgroundColor: '#fef2f2',
      borderRadius: '6px',
      border: '1px solid #fecaca'
    },
    helpText: {
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '13px',
      lineHeight: '1.4',
      padding: '0 16px'
    },
    submitButton: {
      background: '#4b5563',
      color: 'white',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    submitButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(75, 85, 99, 0.3)'
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },
    footer: {
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      marginTop: '32px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.backgroundPattern}></div>
      
      {/* 로고 인트로 섹션 */}
      <div 
        style={{
          ...styles.logoIntroSection,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: showLoginForm 
            ? 'translate(-50%, -50%) scale(0.8) translateY(-20px)' 
            : 'translate(-50%, -50%) scale(1) translateY(0)',
          zIndex: showLoginForm ? 0 : 2
        }}
        onClick={handleLogoClick}
        onMouseEnter={(e) => {
          e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
          e.currentTarget.querySelector('img').style.filter = 'drop-shadow(0 12px 32px rgba(0,0,0,0.3))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelector('img').style.transform = 'scale(1)';
          e.target.style.filter = 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))';
        }}
      >
        <img 
          src="/logo2.png" 
          alt="DeeFacto" 
          style={{
            width: '30%',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2))',
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
            animation: 'bounce 2s ease-in-out infinite'
          }}
        />
        
        {/* 단어 합성 애니메이션 */}
        <div style={styles.wordAnimation}>
          <span style={styles.wordPart}>De facto</span>
          <span style={styles.plusSign}>+</span>
          <span style={styles.wordPart2}>Factory</span>
          <span style={styles.equalsSign}>=</span>
          <span style={styles.finalWord}>DeeFacto</span>
        </div>
        
        <div style={styles.meaningText}>
          "사실상 표준" + "공장"<br/>
          표준을 위한 공장 모니터링 서비스<br/>
        </div>
      </div>

      {/* 로그인 폼 */}
      <div style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: showLoginForm ? 2 : 0
      }}>
        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={styles.logoSection}>
            <img 
              src="/logo.png" 
              alt="DeeFacto" 
              style={{
                width: '200px',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}
              onError={(e) => {
                // 이미지 로드 실패 시 이미지를 숨기고 텍스트만 표시
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
              <span style={styles.logoIcon}>🧊</span>
              <Text variant="title" size="32px" weight="bold" style={styles.logoText}>
                DeeFacto
              </Text>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>사원번호</label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                placeholder="사원번호를 입력하세요"
                style={styles.formInput}
                autoComplete="username"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.backgroundColor = '#ffffff';
                }}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>비밀번호</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="비밀번호를 입력하세요"
                style={{...styles.formInput, paddingRight: '56px'}}
                autoComplete="current-password"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.backgroundColor = '#ffffff';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'none';
                  e.target.style.color = '#6b7280';
                }}
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
          
          <Text variant="body" size="xs" color="gray-600" style={styles.helpText}>
            로그인에 문제가 있는 경우 관리자에게 문의하십시오
          </Text>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
      
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          @keyframes slideInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          
          @keyframes fadeInScale {
            to {
              opacity: 1;
              transform: scale(1.1);
            }
          }
          
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login; 