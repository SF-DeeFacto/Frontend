import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { SmartLoading } from '../ui';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { 
  fetchDashboards, 
  queryPanelData, 
  fetchRealTimeMetrics, 
  fetchDataSources 
} from '../../grafanaTest/grafanaTest';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const GrafanaPanel = ({ 
  title = 'Grafana 대시보드',
  chartType = 'line',
  query = '',
  timeRange = { from: Date.now() - 3600000, to: Date.now() },
  refreshInterval = 30000, // 30초
  height = 400
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboards, setDashboards] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const isMountedRef = useRef(true);
  const intervalRef = useRef(null);

  // 차트 옵션 설정
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: chartType === 'line' ? {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'MM-DD HH:mm',
          },
        },
        title: {
          display: true,
          text: '시간',
        },
      },
      y: {
        title: {
          display: true,
          text: '값',
        },
      },
    } : {},
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // 데이터 가져오기 함수
  const fetchData = async () => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);

      if (query) {
        // 쿼리가 있으면 시계열 데이터 가져오기
        console.log('시계열 데이터 쿼리 시작:', query);
        const data = await queryPanelData(query, timeRange);
        
        if (data && data.data && data.data.result) {
          const processedData = processTimeSeriesData(data.data.result);
          if (isMountedRef.current) {
            setChartData(processedData);
          }
        } else {
          console.warn('쿼리 결과가 비어있습니다:', data);
          if (isMountedRef.current) {
            setChartData(null);
          }
        }
      } else {
        // 쿼리가 없으면 대시보드 목록과 데이터소스 목록 가져오기
        const [dashboardList, dataSourceList] = await Promise.all([
          fetchDashboards(),
          fetchDataSources()
        ]);
        
        if (isMountedRef.current) {
          setDashboards(dashboardList);
          setDataSources(dataSourceList);
        }
      }
    } catch (err) {
      console.error('데이터 가져오기 오류:', err);
      if (isMountedRef.current) {
        setError('데이터를 가져오는 중 오류가 발생했습니다: ' + err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // 시계열 데이터 처리 함수
  const processTimeSeriesData = (results) => {
    const datasets = results.map((result, index) => {
      const values = result.values || [];
      const data = values.map(([timestamp, value]) => ({
        x: new Date(timestamp * 1000),
        y: parseFloat(value),
      }));

      return {
        label: result.metric.__name__ || `시리즈 ${index + 1}`,
        data: data,
        borderColor: getColorByIndex(index),
        backgroundColor: getColorByIndex(index, 0.1),
        tension: 0.1,
        fill: false,
      };
    });

    return { datasets };
  };

  // 색상 생성 함수
  const getColorByIndex = (index, alpha = 1) => {
    const colors = [
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 205, 86, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
    ];
    return colors[index % colors.length];
  };

  // 차트 컴포넌트 렌더링
  const renderChart = () => {
    if (!chartData) return null;

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [query, timeRange.from, timeRange.to]);

  // 자동 새로고침 설정 (개선된 버전)
  useEffect(() => {
    // 이전 인터벌 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // 쿼리가 있고 새로고침 간격이 설정된 경우에만 자동 새로고침
    if (refreshInterval > 0 && query && !error) {
      intervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          console.log('자동 새로고침 실행:', new Date().toLocaleTimeString());
          fetchData();
        }
      }, refreshInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, query, error]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <SmartLoading
        loading={true}
        loadingText={LOADING_TEXTS.DATA.GENERAL}
        className="h-64"
      />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-semibold">오류</div>
        <div className="text-red-600">{error}</div>
        <button 
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={fetchData}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
      
      {chartData ? (
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          표시할 데이터가 없습니다.
        </div>
      )}

      {dashboards.length > 0 && !chartData && (
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-2">사용 가능한 대시보드:</h4>
          <ul className="space-y-2">
            {dashboards.slice(0, 5).map((dashboard) => (
              <li key={dashboard.uid} className="p-2 border rounded hover:bg-gray-50">
                <div className="font-medium">{dashboard.title}</div>
                <div className="text-sm text-gray-600">{dashboard.uri}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dataSources.length > 0 && !chartData && (
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-2">사용 가능한 데이터소스:</h4>
          <ul className="space-y-2">
            {dataSources.map((ds) => (
              <li key={ds.id} className="p-2 border rounded hover:bg-gray-50">
                <div className="font-medium">{ds.name} (ID: {ds.id})</div>
                <div className="text-sm text-gray-600">
                  타입: {ds.type} | URL: {ds.url || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  상태: {ds.access || 'Unknown'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrafanaPanel;
