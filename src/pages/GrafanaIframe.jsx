import React from 'react';

const GRAFANA_URL = 'http://192.168.55.180:3000'; // 실제 Grafana 주소로 변경
const DASHBOARD_UID = '9fe9c841-0cbf-4878-93b1-9329e0494214'; // 실제 대시보드 UID로 변경


const GrafanaIframe = () => {
  // 전체 대시보드 임베드 URL 예시
  const dashboardUrl=`http://222.235.142.221:12333/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light`;
  // const dashboardUrl=`http://127.0.0.1:3000/d/9fe9c841-0cbf-4878-93b1-9329e0494214/kim-mysql-test-connection-show-grapthj?orgId=1&from=now-5m&to=now&timezone=browser&refresh=auto&theme=light`;
  //const dashboardUrl = `${GRAFANA_URL}/d/${DASHBOARD_UID}?orgId=${ORG_ID}&kiosk&theme=light`;
  // 특정 패널만 임베드하려면 아래와 같이 panelId, viewPanel 등 추가
  // const panelUrl = `${GRAFANA_URL}/d-solo/${DASHBOARD_UID}/?orgId=${ORG_ID}&panelId=${PANEL_ID}&theme=light`;

  return (
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
  );
};

export default GrafanaIframe;
