import React, { useState } from 'react';
import GrafanaPanel from '../components/grafana/GrafanaPanel';

const GrafanaDashboard = () => {
  const [timeRange, setTimeRange] = useState({
    from: Date.now() - 3600000, // 1시간 전
    to: Date.now()
  });

  const [queries] = useState([
    'up', // 서비스 상태
    'cpu_usage_percent', // CPU 사용률
    'memory_usage_percent', // 메모리 사용률
    'disk_usage_percent', // 디스크 사용률
  ]);

  const handleTimeRangeChange = (range) => {
    const now = Date.now();
    let from;
    
    switch (range) {
      case '1h':
        from = now - 3600000;
        break;
      case '6h':
        from = now - 21600000;
        break;
      case '24h':
        from = now - 86400000;
        break;
      case '7d':
        from = now - 604800000;
        break;
      default:
        from = now - 3600000;
    }
    
    setTimeRange({ from, to: now });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Grafana 모니터링 대시보드
          </h1>
          
          {/* 시간 범위 선택 */}
          <div className="flex space-x-2 mb-4">
            <span className="text-sm font-medium text-gray-700 self-center">시간 범위:</span>
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* 그래프 패널들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 시스템 상태 */}
          <GrafanaPanel
            title="시스템 상태"
            chartType="line"
            query={queries[0]}
            timeRange={timeRange}
            refreshInterval={30000}
            height={300}
          />

          {/* CPU 사용률 */}
          <GrafanaPanel
            title="CPU 사용률 (%)"
            chartType="line"
            query={queries[1]}
            timeRange={timeRange}
            refreshInterval={30000}
            height={300}
          />

          {/* 메모리 사용률 */}
          <GrafanaPanel
            title="메모리 사용률 (%)"
            chartType="bar"
            query={queries[2]}
            timeRange={timeRange}
            refreshInterval={30000}
            height={300}
          />

          {/* 디스크 사용률 */}
          <GrafanaPanel
            title="디스크 사용률"
            chartType="doughnut"
            query={queries[3]}
            timeRange={timeRange}
            refreshInterval={60000}
            height={300}
          />
        </div>

        {/* 전체 대시보드 보기 */}
        <div className="mt-8">
          <GrafanaPanel
            title="전체 시계열 데이터"
            chartType="line"
            query="rate(http_requests_total[5m])"
            timeRange={timeRange}
            refreshInterval={15000}
            height={400}
          />
        </div>

        {/* Grafana 임베드 옵션 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Grafana 원본 대시보드</h2>
          <div className="border rounded">
            <iframe
              src="http://192.168.55.180:3000/d/dashboard-uid/dashboard-name?orgId=1&theme=light&kiosk"
              width="100%"
              height="500"
              frameBorder="0"
              title="Grafana Dashboard"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            * iframe URL에서 dashboard-uid와 dashboard-name을 실제 값으로 변경하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrafanaDashboard;
