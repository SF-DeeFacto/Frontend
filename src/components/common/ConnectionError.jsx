import React from 'react';
import { CONNECTION_STATE } from '../../types/sensor';

const ConnectionError = ({ connectionState, onRetry }) => {
  const getErrorMessage = (state) => {
    switch (state) {
      case CONNECTION_STATE.ERROR:
        return '서버 연결에 문제가 발생했습니다.';
      case CONNECTION_STATE.DISCONNECTED:
        return '서버와의 연결이 끊어졌습니다.';
      case CONNECTION_STATE.CONNECTING:
        return '서버에 연결 중입니다...';
      default:
        return '알 수 없는 연결 오류가 발생했습니다.';
    }
  };

  const getErrorIcon = (state) => {
    switch (state) {
      case CONNECTION_STATE.ERROR:
        return '❌';
      case CONNECTION_STATE.DISCONNECTED:
        return '🔌';
      case CONNECTION_STATE.CONNECTING:
        return '🔄';
      default:
        return '⚠️';
    }
  };

  if (connectionState === CONNECTION_STATE.CONNECTED) {
    return null;
  }

  return (
    <div className="connection-error">
      <div className="error-message">
        <span className="error-icon">{getErrorIcon(connectionState)}</span>
        <span className="error-text">{getErrorMessage(connectionState)}</span>
      </div>
      {connectionState === CONNECTION_STATE.ERROR && onRetry && (
        <button 
          onClick={onRetry}
          className="retry-connection-button"
        >
          연결 재시도
        </button>
      )}
    </div>
  );
};

export default ConnectionError;
