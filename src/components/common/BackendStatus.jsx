import React, { useState } from 'react';
import { getAvailableBackendConfig } from '../../config/backendConfig';

const BackendStatus = () => {
  const [apiGatewayStatus, setApiGatewayStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkApiGatewayStatus = async () => {
    setIsLoading(true);
    
    try {
      // API Gateway 상태만 확인
      const config = await getAvailableBackendConfig();
      setApiGatewayStatus(!!config);
    } catch (error) {
      console.error('API Gateway 상태 확인 실패:', error);
      setApiGatewayStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === null) return 'text-gray-500';
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (status) => {
    if (status === null) return '확인 안됨';
    return status ? '연결됨' : '연결 안됨';
  };

  return (
    <div className="text-xs text-gray-600 space-y-1">
      <div className="flex items-center space-x-2">
        <span>API Gateway:</span>
        <span className={getStatusColor(apiGatewayStatus)}>
          {getStatusText(apiGatewayStatus)}
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        모든 백엔드 서비스는 API Gateway를 통해 연결됩니다.
      </div>
      <button
        onClick={checkApiGatewayStatus}
        disabled={isLoading}
        className="text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
      >
        {isLoading ? '확인 중...' : '상태 확인'}
      </button>
    </div>
  );
};

export default BackendStatus;
