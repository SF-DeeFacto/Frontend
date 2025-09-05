import React, { useEffect } from 'react';
import { connectNotificationSSE } from '../../services/sse';

/**
 * 실시간 경고 알림 (alert만 사용)
 */
const AlertPopup = () => {
  useEffect(() => {
    let disconnectSSE = null;

    const handleSSEMessage = (data) => {
      console.log('✨ AlertPopup: handleSSEMessage 호출됨');
      console.log('🚨 실시간 알림 수신:', data);
      console.log('데이터 타입:', typeof data);
      console.log('notiType:', data?.notiType);
      
      // 모든 메시지를 alert로 표시 (테스트용)
      alert(`SSE 메시지 수신!\n\n데이터: ${JSON.stringify(data, null, 2)}`);
      
      if (data && data.notiType === 'ALERT') {
        // 간단한 alert만 사용
        alert(`경고 알림\n\n${data.title}\nZone: ${data.zoneId.toUpperCase()}`);
      }
    };

    const handleSSEError = (error) => {
      console.error('❌ SSE 연결 오류:', error);
    };

    const handleSSEOpen = () => {
      console.log('✅ SSE 연결 성공');
    };

    // SSE 연결 시작
    disconnectSSE = connectNotificationSSE({
      onMessage: handleSSEMessage,
      onError: handleSSEError,
      onOpen: handleSSEOpen
    });

    return () => {
      if (disconnectSSE) {
        disconnectSSE();
      }
    };
  }, []);

  return null;
};

export default AlertPopup;
