import axios from 'axios';

const GRAFANA_URL = '/grafana-api'; // Grafana 주소
const API_KEY = 'glsa_WDC0IP3wP4Q5d6nksu0P3hEf3SpxTYIH_04734bec';

async function getDashboards() {
  const res = await axios.get(`${GRAFANA_URL}/api/search`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  // console.log("data : "+res.data);

    return res.data;
}
async function getDashboardsUID(dashboardName) {
  const dashboards = await getDashboards();
  const dashboard = dashboards.find(d => d.title === dashboardName);
    if (dashboard) {
        return dashboard.uid;
    } else {
        throw new Error(`대시보드 "${dashboardName}"을(를) 찾을 수 없습니다.`);
    }
}
async function getDataSources() {
  const res = await axios.get(`${GRAFANA_URL}/api/datasources`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return res.data;
}
async function queryPanelData(query, timeRange) {
  const res = await axios.post(`${GRAFANA_URL}/api/ds/query`, {
    queries: [
      {
        refId: 'A',
        expr: query,
        intervalMs: 1000,
        maxDataPoints: 500,
      },
    ],
    range: {
      from: new Date(timeRange.from).toISOString(),
      to: new Date(timeRange.to).toISOString(),
    },
  }, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return res.data;
}
async function dashboardinfo(dashboardUid) {
  const res = await axios.get(`${GRAFANA_URL}/${dashboardUid}/:${dashboardUid}`, {        
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
    return res.data;
}
export { getDashboards, getDataSources, queryPanelData, getDashboardsUID, dashboardinfo };
