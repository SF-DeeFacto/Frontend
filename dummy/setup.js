/**
 * SSE 모킹 서버 자동 설정
 * 이 파일을 import하면 자동으로 SSE 모킹이 활성화됩니다.
 */

import { initSSEMockServer } from './sseMockServer.js';

// 자동으로 모킹 서버 초기화
if (typeof window !== 'undefined') {
  initSSEMockServer();
  console.log('🎭 SSE 모킹 서버가 자동으로 활성화되었습니다.');
  console.log('📡 이제 기존 SSE 코드가 모킹 데이터를 사용합니다.');
}

export { initSSEMockServer };
