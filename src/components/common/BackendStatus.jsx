import React, { useState, useEffect } from 'react';
import { getAvailableBackendConfig } from '../../config/backendConfig';

const BackendStatus = () => {
  const [apiGatewayStatus, setApiGatewayStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkApiGatewayStatus();
  }, []);

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
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (status) => {
    return status ? '연결됨' : '연결 안됨';
  };

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">
        API Gateway 상태 확인 중...
      </div>
    );
  }

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
        className="text-blue-600 hover:text-blue-800 underline"
      >
        상태 새로고침
      </button>
    </div>
  );
};

export default BackendStatus;
