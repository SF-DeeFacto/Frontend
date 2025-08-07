import React from 'react';

const Graph = () => {
  // http://localhost:3000/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512
  //const dashboardUrl=`http://192.168.55.180:3000/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512`;
  const dashboardUrl=`http://222.235.142.221:12333/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light`;

  return (
    
    <>
    <div style={{ width: '100%', height: '80vh', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
      <iframe
        src={dashboardUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Grafana Dashboard"
        style={{ border: 0 }}
        allowFullScreen
      />
    </div>
      {/* 기존 Graph 페이지 내용만 남김 */}
    </>
  );
};

export default Graph; 