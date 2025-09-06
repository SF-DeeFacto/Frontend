import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SENSORS = ['온도', '습도', '풍향', '정전기', '파티클'];

const Graph = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const zoneFromUrl = searchParams.get('zone');
  
  // 사용자 scope에 따른 구역 목록 필터링
  const getAllowedZones = () => {
    const allZones = [
      { value: '전체', scope: null },
      { value: 'A01', scope: 'a' },
      { value: 'A02', scope: 'a' },
      { value: 'B01', scope: 'b' },
      { value: 'B02', scope: 'b' },
      { value: 'B03', scope: 'b' },
      { value: 'B04', scope: 'b' },
      { value: 'C01', scope: 'c' },
      { value: 'C02', scope: 'c' }
    ];

    // 사용자 scope가 없으면 모든 구역 표시
    if (!user?.scope) {
      return allZones.map(zone => zone.value);
    }

    // 사용자 scope에 따라 필터링
    const userScopes = user.scope.split(',').map(s => s.trim());
    return allZones
      .filter(zone => zone.scope === null || userScopes.includes(zone.scope))
      .map(zone => zone.value);
  };

  const ZONES = getAllowedZones();

  // URL에서 zone 파라미터가 있으면 해당 Zone을 선택, 없으면 기본값
  const getInitialZone = () => {
    if (zoneFromUrl) {
      // URL의 zone 파라미터를 ZONES 배열 형식에 맞게 변환
      const zoneMapping = {
        'a01': 'A01',
        'a02': 'A02', 
        'b01': 'B01',
        'b02': 'B02',
        'b03': 'B03',
        'b04': 'B04',
        'c01': 'C01',
        'c02': 'C02'
      };
      const mappedZone = zoneMapping[zoneFromUrl.toLowerCase()];
      // 사용자가 접근 가능한 구역인지 확인
      if (mappedZone && ZONES.includes(mappedZone)) {
        return mappedZone;
      }
    }
    return ZONES[0];
  };

  const [selectedZone, setSelectedZone] = useState(getInitialZone());
  const [selectedSensors, setSelectedSensors] = useState([SENSORS[0]]);
  // 실시간/과거 선택 state
  const [timeMode, setTimeMode] = useState('실시간');

  // 실시간/과거 select가 외부 값에 의해 바뀌어야 할 때 자동으로 timeMode를 변경
  // 예시: 특정 조건(zone, sensor 등)에 따라 timeMode를 자동 변경하고 싶을 때
  

  // URL 파라미터가 변경될 때 selectedZone 업데이트
  useEffect(() => {
    if (zoneFromUrl) {
      const zoneMapping = {
        'a01': 'A01',
        'a02': 'A02', 
        'b01': 'B01',
        'b02': 'B02',
        'b03': 'B03',
        'b04': 'B04',
        'c01': 'C01',
        'c02': 'C02'
      };
      const newZone = zoneMapping[zoneFromUrl.toLowerCase()];
      if (newZone && newZone !== selectedZone) {
        setSelectedZone(newZone);
      }
    }
    //console.log('시간' + timeMode);
  }, [zoneFromUrl, selectedZone,timeMode]);
  //const dashboardUrl = `http://222.235.142.221:12333/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}&var-sensor=${encodeURIComponent(sensorParam)}`;
  const dashboardUrl_temp=`http://192.168.55.180:3000/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}}`;
  // 센서 여러 개 선택 시 쿼리 파라미터 예시 (실제 Grafana 대시보드에서 지원해야 적용됨)
  // 예: ...&var-zone=A-1&var-sensor=온도,습도
  const sensorParam = selectedSensors.join(',');
  // const dev_ip = '192.168.55.180:3000';

  // const dev_ip = 'https://ac63b2a0c9ede49f793d3dc81ad44a15-5661160d80c851fb.elb.ap-northeast-2.amazonaws.com';
  const dev_ip = 'https://grafana.deefacto.click';

  //const dev_ip = '222.235.142.221:12333';
  // zone index에 따라 dashboardUrl 분기
  const zoneIndex = ZONES.indexOf(selectedZone);
  let search_time =0;
  if(timeMode==='실시간'){
    search_time=0;
  }else{//과거
    search_time=1;
  }
  let dashboardUrl = '';
  switch (zoneIndex+search_time*9) {
    case 0: // 전체
      dashboardUrl = `${dev_ip}/public-dashboards/df3613e7baa24545aaae492d40b12ec8?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 1: // A-1 http://localhost:3000/public-dashboards/0756fd7ace044aaaa242737b67d70c7e
      dashboardUrl = `${dev_ip}/public-dashboards/3637645420a94e3eab895238fed78740?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 2: // A-2 http://localhost:3000/public-dashboards/ea9aa742fa0e428a9036a4dcb0063024
      dashboardUrl = `${dev_ip}/public-dashboards/17e8cea0d52c4815bea764c591841c86?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 3: // B-1 http://localhost:3000/public-dashboards/bcbc0c42106c4b64ac938e0cd3e9585f
      dashboardUrl = `${dev_ip}/public-dashboards/321d145a9309467f8f43c0f001505e59?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 4: // B-2 5842a561ae9b4a40b5759eb94589f2ac
      dashboardUrl = `${dev_ip}/public-dashboards/27a36d0423f1446e9aca770355b445e1?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 5: // B-3 http://localhost:3000/public-dashboards/b33cc1e73bcc49b690930ae4f0058894
      dashboardUrl = `${dev_ip}/public-dashboards/f9f60663168f41738e2c1170aae47bb1?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 6: // B-4 http://localhost:3000/public-dashboards/dc760976e7944f3cbcb96e28e82885b0
      dashboardUrl = `${dev_ip}/public-dashboards/3c3a83740e564f4e9734c7c02ff8101c?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 7: // C-1 http://localhost:3000/public-dashboards/c718a19c836e40efacfb71f9da19cfe2
      dashboardUrl = `${dev_ip}/public-dashboards/bbfa6c1f3d2f401fa06aedb992807fa7?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 8: // C-2 http://localhost:3000/public-dashboards/3452b51bf5504f0dba16f932f7786abb
      dashboardUrl = `${dev_ip}/public-dashboards/02c466be3dad4f3f94a3a1cd4eb241f4?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;

      case 9: // 전체 http://localhost:3000/public-dashboards/f398f1571b6d4e10b67c02df51f30cad
      dashboardUrl = `${dev_ip}/public-dashboards/f398f1571b6d4e10b67c02df51f30cad?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 10: // A-1 http://localhost:3000/public-dashboards/5814e9b8ba014402ae061fb7c0ae11bf
      dashboardUrl = `${dev_ip}/public-dashboards/5814e9b8ba014402ae061fb7c0ae11bf?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 11: // A-2 http://localhost:3000/public-dashboards/fd9142b2d93d4f34be4b630db38cf766
      dashboardUrl = `${dev_ip}/public-dashboards/fd9142b2d93d4f34be4b630db38cf766?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 12: // B-1 http://localhost:3000/public-dashboards/1d6ce57f1ee24c228c2a6c28c2e682e2
      dashboardUrl = `${dev_ip}/public-dashboards/1d6ce57f1ee24c228c2a6c28c2e682e2?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 13: // B-2 http://localhost:3000/public-dashboards/af806bc6e48245d09f617bb82a811681
      dashboardUrl = `${dev_ip}/public-dashboards/af806bc6e48245d09f617bb82a811681?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 14: // B-3 http://localhost:3000/public-dashboards/44e34e2d2d1f4a3bbd1a15932ff3d6a1
      dashboardUrl = `${dev_ip}/public-dashboards/44e34e2d2d1f4a3bbd1a15932ff3d6a1?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 15: // B-4 http://localhost:3000/public-dashboards/5b8ebc6b260c45d7bc31d86968febb38
      dashboardUrl = `${dev_ip}/public-dashboards/5b8ebc6b260c45d7bc31d86968febb38?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 16: // C-1 http://localhost:3000/public-dashboards/dcb31b98b0694e5d961983914c070475
      dashboardUrl = `${dev_ip}/public-dashboards/dcb31b98b0694e5d961983914c070475?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    case 17: // C-2 http://localhost:3000/public-dashboards/a89495cd1d1646cc9e48313b51387bff
      dashboardUrl = `${dev_ip}/public-dashboards/a89495cd1d1646cc9e48313b51387bff?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
    default:
      dashboardUrl = `${dev_ip}/public-dashboards/df3613e7baa24545aaae492d40b12ec8?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}`;
      break;
  }
  
  // console.log('Generated dashboardUrl:', dashboardUrl);
  
  return (
    <>
      
      
      {/* 상단 실시간/과거, Zone 선택 UI */}
      <div className="flex flex-row gap-6 items-center mb-6 flex-wrap">
        {/* 실시간/과거 선택 */}
        <label className="flex items-center gap-2">
          <span className="font-bold text-secondary-800 dark:text-neutral-100">조회</span>
          <select
            value={timeMode}
            onChange={e => setTimeMode(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          >
            <option value="실시간">실시간</option>
            <option value="과거">과거</option>
          </select>
        </label>
        {/* Zone 선택 */}
        <label className="flex items-center gap-2">
          <span className="font-bold text-secondary-800 dark:text-neutral-100">Zone</span>
          <select
            value={selectedZone}
            onChange={e => {
              setSelectedZone(e.target.value);
              setSelectedSensors([]); // zone 변경 시 센서 선택 초기화
            }}
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          >
            {ZONES.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </label>
      </div>
      
      
      {/* 기존 그래프 영역 */}
      <div className="w-full h-[190vh] bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden transition-colors duration-300">
        <iframe
          src={dashboardUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Grafana Dashboard"
          className="border-0"
          allowFullScreen
        />
      </div>
      {/* 기존 Graph 페이지 내용만 남김 */}
    </>
  );
};

export default Graph;