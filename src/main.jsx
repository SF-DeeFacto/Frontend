import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// SSE 모킹 서버 활성화 (개발 환경에서만)
//삭제
if (import.meta.env.DEV) {
  import('../dummy/setup.js').then(() => {
    console.log('🎭 SSE 모킹 서버가 활성화되었습니다!');
  }).catch(err => {
    console.error('❌ SSE 모킹 서버 로드 실패:', err);
  });
}
//삭제제

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 