import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getDashboards } from '../grafanaTest/grafanaTest_2';

const DashboardChart = () => {
  const [chartData, setChartData] = useState();
  const [jsonData, setJsonData] = useState();
  useEffect(() => {
    dashboardinfo('glsa_WDC0IP3wP4Q5d6nksu0P3hEf3SpxTYIH_04734bec').then(data => {
      // 예시: 대시보드별 title을 x축, id를 y축 데이터로 사용
    //   setChartData({
    //     labels: data.map(d => d.title),
    //     datasets: [{
    //       label: 'Dashboard ID',
    //       data: data.map(d => d.id),
    //       backgroundColor: 'rgba(75,192,192,0.4)',
    //     }]
    //   });
        setJsonData(data);
        console.log('Dashboard Data:', data);
        
    });
  }, []);
  console.log('Chart Data:', chartData);
  if (!jsonData) return <div>Loading...</div>;
  return (
    <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
      {JSON.stringify(jsonData, null, 2)}
    </pre>
  );
  //if (!chartData) return <div>Loading...</div>;

  //return <Bar data={chartData} />;
};

export default DashboardChart;