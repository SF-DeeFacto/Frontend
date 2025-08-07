import React, { useState, useEffect } from 'react';
import GrafanaPanel from '../components/grafana/GrafanaPanel';
import { testConnection, fetchDataSources } from '../grafanaTest/grafanaTest';

const GrafanaTest = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [dataSources, setDataSources] = useState([]);

  // 페이지 로드 시 연결 테스트
  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testConnection();
      setConnectionStatus(result);
      
      // 연결이 성공하면 데이터소스 목록도 가져오기
      if (result.success) {
        try {
          const dsResult = await fetchDataSources();
          setDataSources(dsResult);
        } catch (dsError) {
          console.warn('데이터소스 목록 가져오기 실패:', dsError);
        }
      }
    } catch (error) {
      setConnectionStatus({ success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Grafana 연결 테스트</h1>
      
      {/* 연결 상태 표시 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">연결 상태</h2>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {testing ? '테스트 중...' : '연결 테스트'}
          </button>
        </div>
        
        {connectionStatus && (
          <div className={`p-4 rounded-lg ${
            connectionStatus.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {connectionStatus.success ? (
              <div>
                <div className="text-green-800 font-semibold">
                  ✅ 연결 성공 ({connectionStatus.method})
                </div>
                <div className="text-green-600 text-sm mt-1">
                  {JSON.stringify(connectionStatus.data, null, 2)}
                </div>
                
                {/* 데이터소스 정보 표시 */}
                {dataSources.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border">
                    <div className="text-blue-800 font-medium mb-2">데이터소스 목록:</div>
                    {dataSources.map((ds) => (
                      <div key={ds.id} className="text-blue-700 text-sm">
                        • {ds.name} (ID: {ds.id}, 타입: {ds.type}, URL: {ds.url || 'N/A'})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-red-800 font-semibold">❌ 연결 실패</div>
                {connectionStatus.proxyError && (
                  <div className="text-red-600 text-sm mt-1">
                    프록시 오류: {connectionStatus.proxyError}
                  </div>
                )}
                {connectionStatus.directError && (
                  <div className="text-red-600 text-sm mt-1">
                    직접 연결 오류: {connectionStatus.directError}
                  </div>
                )}
                {connectionStatus.error && (
                  <div className="text-red-600 text-sm mt-1">
                    오류: {connectionStatus.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* 연결이 성공한 경우에만 패널 표시 */}
        {connectionStatus?.success ? (
          <>
            {/* 기본 대시보드 목록 */}
            <GrafanaPanel
              title="대시보드 및 데이터소스 목록"
              height={300}
            />
            
            {/* 데이터소스가 있는 경우에만 시계열 데이터 예제 */}
            {dataSources.length > 0 && (
              <>
                <GrafanaPanel
                  title="시스템 상태 모니터링"
                  chartType="line"
                  query="up"
                  timeRange={{ 
                    from: Date.now() - 3600000, // 1시간 전
                    to: Date.now() 
                  }}
                  refreshInterval={0} // 자동 새로고침 비활성화
                  height={300}
                />
                
                <GrafanaPanel
                  title="HTTP 요청률"
                  chartType="line"
                  query="rate(http_requests_total[5m])"
                  timeRange={{ 
                    from: Date.now() - 1800000, // 30분 전
                    to: Date.now() 
                  }}
                  refreshInterval={0} // 자동 새로고침 비활성화
                  height={250}
                />
              </>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            먼저 Grafana 서버와의 연결을 확인하세요.
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">502 에러 해결 가이드:</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><strong>데이터소스 확인:</strong> Grafana에 Prometheus나 다른 데이터소스가 설정되어 있는지 확인</li>
          <li><strong>데이터소스 연결:</strong> 설정된 데이터소스가 실제로 연결 가능한지 확인</li>
          <li><strong>쿼리 수정:</strong> 실제 존재하는 메트릭 이름으로 쿼리를 변경</li>
          <li><strong>502 에러:</strong> Grafana는 연결되지만 백엔드 데이터소스(Prometheus 등)에 연결할 수 없음</li>
          <li><strong>메트릭 확인:</strong> Prometheus에서 실제 수집되고 있는 메트릭 이름 확인</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border">
          <div className="text-sm">
            <strong>현재 설정:</strong><br/>
            - Grafana URL: http://192.168.55.180:3000<br/>
            - API Key: glsa_WDC0...H_04734bec<br/>
            - 프록시: /grafana-api → Grafana 서버
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrafanaTest;
