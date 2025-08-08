import React, { useState } from 'react';

const ZONES = ['전체','A-1', 'A-2', 'B-1', 'B-2', 'B-3', 'B-4', 'C-1', 'C-2'];
const SENSORS = ['온도', '습도', '풍향', '정전기', '파티클'];

const Graph = () => {
  const [selectedZone, setSelectedZone] = useState(ZONES[0]);
  const [selectedSensors, setSelectedSensors] = useState([SENSORS[0]]);
  //const dashboardUrl = `http://222.235.142.221:12333/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}&var-sensor=${encodeURIComponent(sensorParam)}`;
  const dashboardUrl_temp=`http://192.168.55.180:3000/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}}`;
  // 센서 여러 개 선택 시 쿼리 파라미터 예시 (실제 Grafana 대시보드에서 지원해야 적용됨)
  // 예: ...&var-zone=A-1&var-sensor=온도,습도
  const sensorParam = selectedSensors.join(',');
  const dev_ip = '192.168.55.180:3000';
  //const dev_ip = '222.235.142.221:12333';
  // zone index에 따라 dashboardUrl 분기
  const zoneIndex = ZONES.indexOf(selectedZone);
  let dashboardUrl = '';
  switch (zoneIndex) {
    case 0: // 전체
      dashboardUrl = `http://${dev_ip}/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 1: // A-1 http://localhost:3000/public-dashboards/0756fd7ace044aaaa242737b67d70c7e
      dashboardUrl = `http://${dev_ip}/public-dashboards/0756fd7ace044aaaa242737b67d70c7e?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 2: // A-2 http://localhost:3000/public-dashboards/ea9aa742fa0e428a9036a4dcb0063024
      dashboardUrl = `http://${dev_ip}/public-dashboards/ea9aa742fa0e428a9036a4dcb0063024?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 3: // B-1 http://localhost:3000/public-dashboards/bcbc0c42106c4b64ac938e0cd3e9585f
      dashboardUrl = `http://${dev_ip}/public-dashboards/bcbc0c42106c4b64ac938e0cd3e9585f?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 4: // B-2 5842a561ae9b4a40b5759eb94589f2ac
      dashboardUrl = `http://${dev_ip}/public-dashboards/5842a561ae9b4a40b5759eb94589f2ac?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 5: // B-3 http://localhost:3000/public-dashboards/b33cc1e73bcc49b690930ae4f0058894
      dashboardUrl = `http://${dev_ip}/public-dashboards/b33cc1e73bcc49b690930ae4f0058894?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 6: // B-4 http://localhost:3000/public-dashboards/dc760976e7944f3cbcb96e28e82885b0
      dashboardUrl = `http://${dev_ip}/public-dashboards/dc760976e7944f3cbcb96e28e82885b0?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 7: // C-1 http://localhost:3000/public-dashboards/c718a19c836e40efacfb71f9da19cfe2
      dashboardUrl = `http://${dev_ip}/public-dashboards/c718a19c836e40efacfb71f9da19cfe2?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 8: // C-2 http://localhost:3000/public-dashboards/3452b51bf5504f0dba16f932f7786abb
      dashboardUrl = `http://${dev_ip}/public-dashboards/3452b51bf5504f0dba16f932f7786abb?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    default:
      dashboardUrl = `http://${dev_ip}/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
  }
  
  console.log('Generated dashboardUrl:', dashboardUrl);
  
  return (
    <>
      
      
      {/* 상단 Zone, Sensor 선택 UI */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Zone</span>
          <select
            value={selectedZone}
            onChange={e => {
              setSelectedZone(e.target.value);
              setSelectedSensors([]); // zone 변경 시 센서 선택 초기화
            }}
            style={{ padding: '0.5rem', borderRadius: 4 }}
          >
            {ZONES.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </label>
        
      </div>
      
      
      {/* 기존 그래프 영역 */}
      <div style={{ width: '100%', height: '190vh', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
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