import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import { login } from '../services/api/auth';
// ===== 개발용 더미 로그인 기능 시작 =====
import { dummyUsers } from '../dummy/data/users';
// ===== 개발용 더미 로그인 기능 끝 =====

// Login CSS styles
const loginStyles = `
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  .login-page {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #f8f6ff 0%, #ede7f6 50%, #f3e5f5 100%);
      min-height: 100vh;
      overflow: hidden;
  }

  .container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  /* AI 시각화 배경 영역 (전체 화면) */
  .ai-visualization {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: radial-gradient(circle at 30% 50%, rgba(149, 117, 205, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 20%, rgba(186, 154, 238, 0.05) 0%, transparent 50%);
      z-index: 1;
  }

  /* 배경 데이터 그리드 */
  .ai-visualization::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
          linear-gradient(rgba(149, 117, 205, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(149, 117, 205, 0.15) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.3;
      animation: gridMove 20s linear infinite;
  }

  /* 배경 데이터 포인트 */
  .ai-visualization::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
          radial-gradient(2px 2px at 20px 30px, #ba9aee, transparent),
          radial-gradient(2px 2px at 40px 70px, #9575cd, transparent),
          radial-gradient(1px 1px at 90px 40px, #ba9aee, transparent),
          radial-gradient(1px 1px at 130px 80px, #9575cd, transparent),
          radial-gradient(2px 2px at 160px 30px, #ba9aee, transparent),
          radial-gradient(1px 1px at 200px 60px, #9575cd, transparent),
          radial-gradient(2px 2px at 240px 90px, #ba9aee, transparent),
          radial-gradient(1px 1px at 280px 20px, #9575cd, transparent),
          radial-gradient(2px 2px at 320px 70px, #ba9aee, transparent),
          radial-gradient(1px 1px at 360px 40px, #9575cd, transparent);
      background-repeat: repeat;
      background-size: 400px 100px;
      opacity: 0.4;
      animation: dataFlow 15s linear infinite;
  }

  /* AI 코어 */
  .ai-core {
      position: relative;
      z-index: 10;
  }

  .ai-platform {
      width: 120px;
      height: 20px;
      background: linear-gradient(90deg, #ba9aee, #9575cd);
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(186, 154, 238, 0.6);
      margin: 5px 0;
  }

  .ai-platform.top {
      transform: translateX(-20px);
  }

  .ai-platform.bottom {
      transform: translateX(20px);
  }

  .ai-text {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-weight: bold;
      color: #9575cd;
      text-shadow: 0 0 10px rgba(149, 117, 205, 0.8);
  }

  /* 인물 실루엣 */
  .human-figures {
      position: absolute;
      width: 100%;
      height: 100%;
  }

  .figure {
      position: absolute;
      width: 30px;
      height: 50px;
      border: 2px solid #ba9aee;
      border-radius: 15px 15px 0 0;
      opacity: 0.7;
  }

  .figure::before {
      content: '';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      border: 2px solid #ba9aee;
      border-radius: 50%;
  }

  .figure-1 {
      top: 20%;
      left: 15%;
      animation: glow 2s ease-in-out infinite alternate;
  }

  .figure-2 {
      top: 20%;
      right: 15%;
      animation: glow 2s ease-in-out infinite alternate 0.5s;
  }

  .figure-3 {
      bottom: 30%;
      left: 20%;
      animation: glow 2s ease-in-out infinite alternate 1s;
  }

  .figure-4 {
      bottom: 30%;
      right: 20%;
      animation: glow 2s ease-in-out infinite alternate 1.5s;
  }

  /* 바이너리 코드 */
  .binary-code {
      position: absolute;
      top: 10%;
      left: 10%;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #9575cd;
      opacity: 0.6;
  }

  .binary-line {
      margin: 5px 0;
      animation: fadeInOut 3s ease-in-out infinite;
  }

  .binary-line:nth-child(2) { animation-delay: 0.5s; }
  .binary-line:nth-child(3) { animation-delay: 1s; }
  .binary-line:nth-child(4) { animation-delay: 1.5s; }

  /* 데이터 그래프 */
  .data-graphs {
      position: absolute;
      top: 15%;
      left: 5%;
      display: flex;
      align-items: end;
      gap: 8px;
      height: 60px;
  }

  .graph-bar {
      width: 8px;
      background: linear-gradient(to top, #ba9aee, #9575cd);
      border-radius: 4px;
      animation: graphPulse 2s ease-in-out infinite;
  }

  .graph-bar:nth-child(1) { height: 40px; animation-delay: 0s; }
  .graph-bar:nth-child(2) { height: 60px; animation-delay: 0.2s; }
  .graph-bar:nth-child(3) { height: 30px; animation-delay: 0.4s; }
  .graph-bar:nth-child(4) { height: 50px; animation-delay: 0.6s; }
  .graph-bar:nth-child(5) { height: 35px; animation-delay: 0.8s; }

  /* 수치 */
  .data-value {
      position: absolute;
      top: 12%;
      left: 15%;
      font-size: 14px;
      color: #9575cd;
      font-weight: bold;
      opacity: 0.8;
  }

  /* 웨이브 라인 */
  .wave-lines {
      position: absolute;
      bottom: 20%;
      left: 10%;
      width: 200px;
      height: 60px;
  }

  .wave-line {
      position: absolute;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ba9aee, transparent);
      border-radius: 1px;
      animation: wave 3s ease-in-out infinite;
  }

  .wave-line:nth-child(1) { top: 0; animation-delay: 0s; }
  .wave-line:nth-child(2) { top: 20px; animation-delay: 1s; }
  .wave-line:nth-child(3) { top: 40px; animation-delay: 2s; }

  /* 중앙 로그인 섹션 */
  .login-section {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
  }

  .title {
      color: white;
      font-size: 24px;
      margin-bottom: 40px;
      text-align: center;
      font-weight: 300;
  }

  .login-panel {
      background: rgba(248, 246, 255, 0.95);
      border: 1px solid rgba(149, 117, 205, 0.3);
      border-radius: 10px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 0 30px rgba(186, 154, 238, 0.2);
  }

  .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      color: #4a4a4a;
      font-size: 18px;
  }

  .vertical-line {
      width: 4px;
      height: 20px;
      background: #9575cd;
      margin-right: 15px;
      border-radius: 2px;
  }

  .input-group {
      position: relative;
      margin-bottom: 20px;
  }

  .input-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #9575cd;
      font-size: 16px;
  }

  .input-group input {
      width: 100%;
      padding: 15px 15px 15px 50px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(149, 117, 205, 0.3);
      border-radius: 5px;
      color: #4a4a4a;
      font-size: 14px;
      transition: all 0.3s ease;
  }

  .input-group input::placeholder {
      color: rgba(74, 74, 74, 0.6);
  }

  .input-group input:focus {
      outline: none;
      border-color: #9575cd;
      box-shadow: 0 0 10px rgba(149, 117, 205, 0.3);
  }

  .login-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(90deg, #ba9aee, #9575cd);
      border: none;
      border-radius: 5px;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
  }

  .login-btn:hover {
      background: linear-gradient(90deg, #9575cd, #ba9aee);
      box-shadow: 0 0 20px rgba(186, 154, 238, 0.4);
      transform: translateY(-2px);
  }

  .login-btn:disabled {
      background: rgba(149, 117, 205, 0.3);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
  }

  .footer-text {
      color: rgba(74, 74, 74, 0.7);
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
  }

  .error-message {
      color: #ff6b35;
      font-size: 12px;
      margin-bottom: 15px;
      text-align: center;
      background: rgba(255, 107, 53, 0.1);
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 3px;
      padding: 8px;
  }

  /* 데이터 파티클 */
  .data-particles {
      position: absolute;
      width: 100%;
      height: 100%;
  }

  .particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: #ba9aee;
      border-radius: 50%;
      animation: particleFloat 8s linear infinite;
  }

  .particle:nth-child(1) {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
  }

  .particle:nth-child(2) {
      top: 60%;
      right: 15%;
      animation-delay: 2s;
  }

  .particle:nth-child(3) {
      bottom: 30%;
      left: 30%;
      animation-delay: 4s;
  }

  .particle:nth-child(4) {
      top: 40%;
      right: 40%;
      animation-delay: 1s;
  }

  .particle:nth-child(5) {
      bottom: 60%;
      left: 60%;
      animation-delay: 3s;
  }

  /* 네트워크 노드들 */
  .network-nodes {
      position: absolute;
      width: 100%;
      height: 100%;
  }

  .node {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .node-core {
      width: 12px;
      height: 12px;
      background: #9575cd;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(149, 117, 205, 0.8);
      z-index: 2;
  }

  .node-pulse {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid rgba(149, 117, 205, 0.3);
      border-radius: 50%;
      animation: nodePulse 2s ease-out infinite;
  }

  .node-1 {
      top: 25%;
      left: 35%;
      animation: nodeFloat 4s ease-in-out infinite;
  }

  .node-2 {
      top: 45%;
      right: 25%;
      animation: nodeFloat 4s ease-in-out infinite 1s;
  }

  .node-3 {
      bottom: 35%;
      left: 45%;
      animation: nodeFloat 4s ease-in-out infinite 2s;
  }

  .node-4 {
      bottom: 25%;
      right: 35%;
      animation: nodeFloat 4s ease-in-out infinite 3s;
  }

  /* 원형 차트 */
  .circular-chart {
      position: absolute;
      top: 25%;
      right: 20%;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .chart-circle {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid rgba(149, 117, 205, 0.3);
      border-top: 3px solid #9575cd;
      border-radius: 50%;
      animation: rotate 2s linear infinite;
  }

  .chart-percentage {
      color: #9575cd;
      font-size: 14px;
      font-weight: bold;
      z-index: 1;
  }

  /* 실시간 데이터 스트림 */
  .data-stream {
      position: absolute;
      top: 40%;
      right: 15%;
      color: #9575cd;
      font-size: 12px;
      font-family: 'Courier New', monospace;
  }

  .stream-item {
      margin: 5px 0;
      animation: streamUpdate 3s ease-in-out infinite;
      opacity: 0.8;
  }

  .stream-item:nth-child(2) { animation-delay: 0.5s; }
  .stream-item:nth-child(3) { animation-delay: 1s; }
  .stream-item:nth-child(4) { animation-delay: 1.5s; }

  /* 연결선들 */
  .connection-lines {
      position: absolute;
      width: 100%;
      height: 100%;
  }

  .connection-line {
      position: absolute;
      height: 1px;
      background: linear-gradient(90deg, transparent, #ba9aee, transparent);
      animation: dataTransfer 4s ease-in-out infinite;
  }

  .line-1 {
      top: 30%;
      left: 20%;
      width: 100px;
      animation-delay: 0s;
  }

  .line-2 {
      top: 50%;
      right: 30%;
      width: 80px;
      animation-delay: 1s;
  }

  .line-3 {
      bottom: 40%;
      left: 40%;
      width: 120px;
      animation-delay: 2s;
  }

  .line-4 {
      top: 70%;
      right: 20%;
      width: 60px;
      animation-delay: 3s;
  }

  /* 스캔 라인 */
  .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ba9aee, transparent);
      animation: scan 6s linear infinite;
      box-shadow: 0 0 10px rgba(186, 154, 238, 0.8);
  }

  /* 시스템 상태 표시 */
  .system-status {
      position: absolute;
      top: 75%;
      right: 25%;
      display: flex;
      flex-direction: column;
      gap: 10px;
  }

  .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #9575cd;
      font-size: 11px;
      opacity: 0.8;
  }

  .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: statusBlink 2s ease-in-out infinite;
  }

  .status-indicator.online .status-dot {
      background: #00ff88;
      box-shadow: 0 0 5px rgba(0, 255, 136, 0.6);
  }

  .status-indicator.warning .status-dot {
      background: #ffaa00;
      box-shadow: 0 0 5px rgba(255, 170, 0, 0.6);
  }

  /* 애니메이션 */
  @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(149, 117, 205, 0.3); }
      100% { box-shadow: 0 0 20px rgba(149, 117, 205, 0.8); }
  }

  @keyframes nodePulse {
      0% {
          transform: scale(1);
          opacity: 1;
      }
      100% {
          transform: scale(2);
          opacity: 0;
      }
  }

  @keyframes nodeFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
  }

  @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  @keyframes streamUpdate {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
  }

  @keyframes dataTransfer {
      0%, 100% { opacity: 0; transform: scaleX(0); }
      50% { opacity: 1; transform: scaleX(1); }
  }

  @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
  }

  @keyframes statusBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
  }

  @keyframes fadeInOut {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
  }

  @keyframes graphPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
  }

  @keyframes wave {
      0%, 100% { transform: translateX(-100%); opacity: 0; }
      50% { transform: translateX(0); opacity: 1; }
  }

  @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
  }

  @keyframes dataFlow {
      0% { transform: translateX(0); }
      100% { transform: translateX(-400px); }
  }

  @keyframes particleFloat {
      0% {
          opacity: 0;
          transform: translateY(0) translateX(0);
      }
      10% {
          opacity: 1;
      }
      90% {
          opacity: 1;
      }
      100% {
          opacity: 0;
          transform: translateY(-100px) translateX(50px);
      }
  }

  /* 반응형 디자인 */
  @media (max-width: 768px) {
      .container {
          flex-direction: column;
      }
      
      .ai-visualization {
          height: 40vh;
      }
      
      .login-section {
          height: 60vh;
          padding: 20px;
      }
      
      .login-panel {
          padding: 30px 20px;
      }
      
      .title {
          font-size: 20px;
          margin-bottom: 20px;
      }
  }
`;

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