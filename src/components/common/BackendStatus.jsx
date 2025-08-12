import React, { useState, useEffect } from 'react';
import api from '../../services/api/client';

const BackendStatus = () => {
  const [apiGatewayStatus, setApiGatewayStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkApiGatewayStatus = async () => {
    setIsLoading(true);
    
    try {
      console.log('백엔드 상태 확인 시작... (게이트웨이 경유)');
      
      // 방법 1: 간단한 연결 테스트 (OPTIONS 요청)
      try {
        // OPTIONS 요청으로 서버 연결 상태 확인
        const response = await fetch('/api/', {
          method: 'OPTIONS',
          mode: 'cors'
        });
        
        if (response.status === 200 || response.status === 204) {
          console.log('API Gateway 연결 성공 (OPTIONS 요청)');
          setApiGatewayStatus(true);
        } else {
          throw new Error(`응답 오류: ${response.status}`);
        }
      } catch (optionsError) {
        console.log('OPTIONS 요청 실패, 다른 방법 시도...');
        
        // 방법 2: 간단한 GET 요청으로 연결 확인
        try {
          const response = await api.get('/'); // 루트 경로 시도
          if (response.status === 200) {
            console.log('API Gateway 연결 성공 (루트 경로)');
            setApiGatewayStatus(true);
          } else {
            throw new Error(`응답 오류: ${response.status}`);
          }
        } catch (getError) {
          console.log('GET 요청도 실패, 백엔드 연결 실패 판단');
          setApiGatewayStatus(false);
        }
      }
      
      setLastChecked(new Date());
      
    } catch (error) {
      console.error('API Gateway 상태 확인 실패:', error);
      setApiGatewayStatus(false);
      setLastChecked(new Date());
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

  const getStatusIcon = (status) => {
    if (status === null) return '❓';
    return status ? '✅' : '❌';
  };

  const formatLastChecked = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('ko-KR');
  };

  return (
    <div className="text-xs text-gray-600 space-y-2 p-3 bg-gray-50 rounded-lg">
      <div className="font-medium text-gray-700">백엔드 서버 상태</div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">API Gateway:</span>
          <span className={getStatusColor(apiGatewayStatus)}>
            {getStatusIcon(apiGatewayStatus)} {getStatusText(apiGatewayStatus)}
          </span>
        </div>
        
        {lastChecked && (
          <div className="text-xs text-gray-500">
            마지막 확인: {formatLastChecked(lastChecked)}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={checkApiGatewayStatus}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '확인 중...' : '상태 확인'}
        </button>
      </div>
      
      {apiGatewayStatus === false && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          <strong>연결 문제 해결 방법:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>백엔드 서버가 실행 중인지 확인</li>
            <li>포트 8080이 사용 가능한지 확인</li>
            <li>Vite 프록시 설정 확인</li>
            <li>서버 로그에서 오류 메시지 확인</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
