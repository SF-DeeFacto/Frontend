import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SENSORS = ['온도', '습도', '풍향', '정전기', '파티클'];

const Graph = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const zoneFromUrl = searchParams.get('zone');
  
  // 스코프 접근 여부 확인
  const canAccessZoneValue = (zoneValue) => {
    if (!zoneValue) return false;
    if (zoneValue === '전체') return true;
    if (!user?.scope) return true;
    const scopes = user.scope.split(',').map(s => s.trim().toLowerCase());
    const zoneScope = String(zoneValue)[0]?.toLowerCase();
    return scopes.includes(zoneScope);
  };
  
  // 고정된 구역 순서 (대시보드 매핑용)
  const ZONE_ORDER = ['전체', 'A01', 'A02', 'B01', 'B02', 'B03', 'B04', 'C01', 'C02'];

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
  // 실시간/요약 선택 state
  const [timeMode, setTimeMode] = useState('실시간');

  // 실시간/요약 select가 외부 값에 의해 바뀌어야 할 때 자동으로 timeMode를 변경
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
      const newZone = zoneMapping[String(zoneFromUrl).toLowerCase()];
      if (newZone) {
        if (!canAccessZoneValue(newZone)) {
          window.alert('해당 구역에 대한 접근 권한이 없습니다.');
          // 접근 가능한 첫 번째 존으로 설정
          if (ZONES && ZONES.length > 0) {
            setSelectedZone(ZONES[0]);
          }
        } else if (newZone !== selectedZone) {
          setSelectedZone(newZone);
        }
      }
    }
  }, [zoneFromUrl, selectedZone, ZONES]);
  //const dashboardUrl = `http://222.235.142.221:12333/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}&var-sensor=${encodeURIComponent(sensorParam)}`;
  const dashboardUrl_temp=`http://192.168.55.180:3000/public-dashboards/d5f7a75286564bc196d5de9d1eaeb512?refresh=auto&from=now-5m&to=now&timezone=browser&theme=light&var-zone=${encodeURIComponent(selectedZone)}}`;
  // 센서 여러 개 선택 시 쿼리 파라미터 예시 (실제 Grafana 대시보드에서 지원해야 적용됨)
  // 예: ...&var-zone=A-1&var-sensor=온도,습도
  const sensorParam = selectedSensors.join(',');
  // const dev_ip = '192.168.55.180:3000';

  // const dev_ip = 'https://ac63b2a0c9ede49f793d3dc81ad44a15-5661160d80c851fb.elb.ap-northeast-2.amazonaws.com';
  const dev_ip = 'https://grafana.deefacto.click';

  //const dev_ip = '222.235.142.221:12333';
  // zone index에 따라 dashboardUrl 분기 (필터링에 영향받지 않도록 고정 순서 사용)
  const zoneIndex = Math.max(0, ZONE_ORDER.indexOf(selectedZone));
  let search_time =0;
  if(timeMode==='실시간'){
    search_time=0;
  }else{//요약
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
      {/* 상단 필터/조회 영역 - Equipset 스타일과 통일 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex flex-wrap items-start gap-6">
          {/* 그래프 종류 토글 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">그래프 종류</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTimeMode('실시간')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeMode === '실시간'
                    ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                    : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                }`}
              >
                실시간
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('요약')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeMode === '요약'
                    ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                    : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                }`}
              >
                요약
              </button>
            </div>
          </div>

          {/* Zone 선택 (토글 버튼) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
            <div className="flex flex-wrap gap-2">
              {ZONES.map(zone => (
                <button
                  type="button"
                  key={zone}
                  onClick={() => {
                    setSelectedZone(zone);
                    setSelectedSensors([]); // zone 변경 시 센서 선택 초기화
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedZone === zone
                      ? 'bg-[#494FA2] text-white hover:bg-white hover:text-[#494FA2]'
                      : 'bg-white text-gray-700 hover:bg-[#494FA2] hover:text-white'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </div>
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
